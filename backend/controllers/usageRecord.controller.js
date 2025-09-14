import UsageRecord from '../models/usageRecord.model.js';
import Device from '../models/device.model.js';
import EventRecord from '../models/eventRecord.model.js';
import User from '../models/user.model.js';
import { isDateValid } from '../functions/functions.js';
import moment from 'moment-timezone';

import mongoose from "mongoose";

export const recordUsageEvent = async(req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.deviceID;
    const garbageType = req.body.garbageType;

    if(!deviceID){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }

    if(!garbageType){
        return res.status(200).json({success: false, message: "Please provide the type of garbage the user thrown!"});
    }else if(garbageType !== "BIODEGRADABLE" && garbageType !== "NON-BIODEGRADABLE" && garbageType !== "HAZARDOUS"){
        return res.status(200).json({success: false, message: "Garbage Type is invalid!"});
    }

    const session = await mongoose.startSession();
    try{
        const device = await Device.findOne({"deviceID":deviceID});
        if(!device){
            return res.status(200).json({success: false, message: "Device is Not registered!"});
        }
        
        
        if(!device.isOnline){
            return res.status(200).json({success: false, message: "Device is Not Online!"});
        }

        session.startTransaction();

        const usage = new UsageRecord();
        usage.device = device._id;
        usage.garbageType = garbageType;
        
        await usage.save({session});

        await session.commitTransaction();

        res.status(200).json({success: true, message: "Usage Event recorded Successfully!"});
    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in recording Bin Usage! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const retrieveUsageRecord = async(req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.keyword;
    const isBiodegradable = req.body.isBiodegradable;
    const isNonBiodegradable = req.body.isNonBiodegradable;
    const isHazardous = req.body.isHazardous;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    let garbageTypeFilter=[];
    let idFilter = null;
    let startDateUTC,
        endDateUTC;

    if(deviceID != null && deviceID.toString().length >0){
        idFilter={"$or":[
                {"device.deviceID": {$regex: deviceID.toString(), $options: "i"}},
                {"device.location": {$regex: deviceID.toString(), $options: "i"}}
            ]};
    }

    if(typeof isBiodegradable === 'boolean' && isBiodegradable){
        garbageTypeFilter.push({"garbageType": {$regex: "^BIODEGRADABLE$", $options: "i"}});
    }

    if(typeof isNonBiodegradable === 'boolean' && isNonBiodegradable){
        garbageTypeFilter.push({"garbageType": {$regex: "NON-BIODEGRADABLE", $options: "i"}});
    }

    if(typeof isHazardous === 'boolean' && isHazardous){
        garbageTypeFilter.push({"garbageType": {$regex: "HAZARDOUS", $options: "i"}});
    }

    if(startDate !==null && startDate !== undefined && startDate.length>0){
        if(!await isDateValid(startDate)){
            return res.status(200).json({success: false, message: "Start date was invalid!"});
        }else if(endDate !==null && endDate !== undefined && endDate.length>0  && !await isDateValid(endDate)){
            return res.status(200).json({success: false, message: "End date was invalid!"});
        }
    }else if(endDate !==null && endDate !== undefined && endDate.length>0){
        return res.status(200).json({success: false, message: "Cannot have an End date without a Start date!"});
    }

    if((!garbageTypeFilter || garbageTypeFilter.length < 1) && !idFilter && !startDate){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }
    
    try{

        var matchParams = {};
         if(idFilter && (garbageTypeFilter.length > 0)){
            matchParams = {
                    $match: {
                        $and: [idFilter],
                        $or: garbageTypeFilter
                    }
                };
        }else if(idFilter && (garbageTypeFilter.length<1)){
            matchParams = {
                    $match: idFilter
                }
        }else if(!idFilter && garbageTypeFilter){
            matchParams = {
                    $match: {
                        $or: garbageTypeFilter
                    }
                }
        }

        if(startDate !==null && startDate !== undefined && startDate.length>0){
            startDateUTC = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Manila').startOf('day').toDate();

            if(endDate !==null && endDate !== undefined && endDate.length>0){
                endDateUTC = moment.tz(endDate, 'YYYY-MM-DD', 'Asia/Manila').endOf('day').toDate();
            }else{
                endDateUTC = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Manila').endOf('day').toDate();
            }

            if(garbageTypeFilter.length<1&&idFilter===null){
                matchParams = {
                    $match:{
                        "eventDate": {
                            $gte: startDateUTC,
                            $lte: endDateUTC
                        }
                    }
                }
            }else{
                matchParams.$match["eventDate"]={ 
                    $gte: startDateUTC,
                    $lte: endDateUTC
                };
            }
        }

            const usageRecords = await UsageRecord.aggregate([
                {
                    $lookup: {
                    from: "devices",
                    localField: "device",
                    foreignField: "_id",
                    as: "device"
                    }
                },{
                    $addFields: {
                    device:{$first:"$device"} 
                    }
                },
                matchParams,{
                    $project:{
                        _id: 1,
                        garbageType: 1,
                        eventDate: {
                            $dateToString: {
                            date: '$eventDate',
                            format: '%Y-%m-%d %H:%M:%S', // Example format: YYYY-MM-DD HH:MM:SS
                            timezone: 'Asia/Manila'
                            }
                        },
                        device:{
                            _id: 1,
                            deviceID: 1,
                            location: 1
                        }
                    }
                }
            ]);
            
            if(!usageRecords instanceof Array || usageRecords.length === 0){
                res.status(200).json({success: false, message: "No record found!"});
            }else{
                res.status(200).json({success: true, data: usageRecords});
            }
            
        }catch(error){
            console.error("Error trying to search for devices usage records in the Database!");
            console.error(error.stack);
            res.status(500).json({success: false, message: "Server Error"});
        }
    
        return res;
}

export const retrieveChartValuesThisWeek = async(req, res) =>{
    try{
        const usageRecords = await UsageRecord.aggregate([
            {
                $match: {
                    eventDate:{
                        $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
                    }
                }
            },{
                $group: {
                    _id: "$garbageType",
                    value:{
                        $sum: 1
                    }
                }
            }
        ]);


        if(!usageRecords instanceof Array || usageRecords.length === 0){
            res.status(200).json({success: false, message: "No record found!"});
        }else{
            res.status(200).json({success: true, data: usageRecords});
        }

    }catch(error){
        console.error("Error trying retrieve the Data for the last 7 days!");
        console.error(error.stack);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const binFullError = async(req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.deviceID;
    const garbageType = req.body.garbageType;

    if(!deviceID){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }

    if(!garbageType){
        return res.status(200).json({success: false, message: "Please provide the Garbage Bin Type that overflown!"});
    }else if(garbageType !== "BIODEGRADABLE" && garbageType !== "NON-BIODEGRADABLE" && garbageType !== "HAZARDOUS"){
        return res.status(200).json({success: false, message: "Garbage Bin Type is invalid!"});
    }

    const session = await mongoose.startSession();
    try{
        const device = await Device.findOne({"deviceID":deviceID});
        if(!device){
            return res.status(200).json({success: false, message: "Device is Not registered!"});
        }
        
        
        if(!device.isOnline){
            return res.status(200).json({success: false, message: "Device is Not Online!"});
        }

        session.startTransaction();

        if(garbageType === 'BIODEGRADABLE'){
            if(device.isBiodegradableBinFull){
                return res.status(200).json({success: false, message: "Device is Already flagged for Biodegradable bin full!"});
            }

            device.isBiodegradableBinFull = true;
        }else if(garbageType === 'NON-BIODEGRADABLE'){
            if(device.isNonBiodegradableBinFull){
                return res.status(200).json({success: false, message: "Device is Already flagged for Non-biodegradable bin full!"});
            }

            device.isNonBiodegradableBinFull = true;
        }else if(garbageType === 'HAZARDOUS'){
            if(device.isHazardousBinFull){
                return res.status(200).json({success: false, message: "Device is Already flagged for Hazardous bin full!"});
            }

            device.isHazardousBinFull = true;
        }

        await Device.findByIdAndUpdate(device._id, device, {new: true, session});

        const eventRecord = new EventRecord();
        eventRecord.device = device._id;
        eventRecord.eventType = "FULL";
        eventRecord.garbageType = garbageType;

        await eventRecord.save({session});

        await session.commitTransaction();

        const users = await User.find({"sendSmsNotification": true});
        users.map((user)=>{
            
            var to="+63"+user.contactNumber;
            if(user.contactNumber.charAt(0) == '0'){
                to="+63"+user.contactNumber.slice(1);
            }    
            console.log("sending message to: "+to);
            //sendBinFullNotificationSms(to, device._id, device.location, garbageType);

        });
        res.status(200).json({success: true, message: "Updated Garbage Bin Status Successfully!"});
    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in recording Bin Usage! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const binEmptiedEvent = async(req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.deviceID;
    const garbageType = req.body.garbageType;

    if(!deviceID){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }

    if(!garbageType){
        return res.status(200).json({success: false, message: "Please provide the Garbage Bin Type that overflown!"});
    }else if(garbageType !== "BIODEGRADABLE" && garbageType !== "NON-BIODEGRADABLE" && garbageType !== "HAZARDOUS"){
        return res.status(200).json({success: false, message: "Garbage Bin Type is invalid!"});
    }

    const session = await mongoose.startSession();
    try{
        const device = await Device.findOne({"deviceID":deviceID});
        if(!device){
            return res.status(200).json({success: false, message: "Device is Not registered!"});
        }
        
        session.startTransaction();

        if(garbageType === 'BIODEGRADABLE'){
            if(!device.isBiodegradableBinFull){
                return res.status(200).json({success: false, message: "Device Biodegradable bin isn't full yet!"});
            }
            device.isBiodegradableBinFull = false;
        }else if(garbageType === 'NON-BIODEGRADABLE'){
            if(!device.isNonBiodegradableBinFull){
                return res.status(200).json({success: false, message: "Device Non-biodegradable bin isn't full yet!"});
            }
            device.isNonBiodegradableBinFull = false;
        }else if(garbageType === 'HAZARDOUS'){
            if(!device.isHazardousBinFull){
                return res.status(200).json({success: false, message: "Device Hazardous bin isn't full yet!"});
            }
            device.isHazardousBinFull = false;
        }
          
        await Device.findByIdAndUpdate(device._id, device, {new: true, session});

        const eventRecord = new EventRecord();
        eventRecord.device = device._id;
        eventRecord.eventType = "EMPTIED";
        eventRecord.garbageType = garbageType;

        await eventRecord.save({session});

        await session.commitTransaction();

        res.status(200).json({success: true, message: "Updated Garbage Bin Status Successfully!"});
    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in recording Bin Usage! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}