import { Expo } from 'expo-server-sdk';
import User from '../models/user.model.js';
import Device from '../models/device.model.js';

const expo = new Expo();

const checkDevicesForFullBin = async() => {
    try{
        const devices = await Device.aggregate([
            {
                $match: {
                    $or: [
                        { isHazardousBinFull: true },
                        { isBiodegradableBinFull: true },
                        { isNonBiodegradableBinFull: true }
                    ]
                }
            }
        ]);
        if(!devices instanceof Array || devices.length === 0){
            return;
        }
        

        const users = await User.aggregate([
            {
                $match: {
                    expoPushNotificationToken: { 
                        $exists: true, 
                        $ne: "" 
                    }
                }
            }
        ]);


        var messageContent="";
        for (let device of devices) {
            let binFocus = "";
            if(messageContent.length>1){
                messageContent=messageContent+"\n";
            }

            if(device.isBiodegradableBinFull){
                binFocus="Biodegradable"
            }

            if(device.isNonBiodegradableBinFull){
                if(binFocus.length>0){
                    binFocus=binFocus+", ";
                }

                binFocus=binFocus+"Non-Biodegradable";
            }

            if(device.isHazardousBinFull){
                if(binFocus.length>0){
                    binFocus=binFocus+", ";
                }

                binFocus=binFocus+"Hazardous";
            }

            messageContent=messageContent+"The "+binFocus+" Bin of SmartBin device with ID#: "+device.deviceID+" is full.";
        }
        
        let messages = [];
        for (let user of users) {
            const token = user.expoPushNotificationToken;

            if (!Expo.isExpoPushToken(token)) {
                console.error(`Invalid token for user: ${user.emailAddress}`);
                continue;
            }

            messages.push({
                to: token,
                sound: 'default',
                title: 'Siaton SmartBin',
                body: messageContent,
                data: { },
                priority: 'high'
            });
        }

        let chunks = expo.chunkPushNotifications(messages);
        for (let chunk of chunks) {
            try {
                let tickets = await expo.sendPushNotificationsAsync(chunk);
                console.log("Notifications sent. Tickets:", tickets);
            } catch (error) {
                console.error("Error sending chunk:", error);
            }
        }

    }catch(error){
        console.error("Error trying to check the status of all device's bin from Database!");
    }
}

export default checkDevicesForFullBin