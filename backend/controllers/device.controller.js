import mongoose from 'mongoose';

import Device from '../models/device.model.js';

export const getAllDevices = async(req, res) =>{
    try{
        const devices = await Device.find({});
        if(!devices instanceof Array || devices.length === 0){
            res.status(200).json({success: false, message: "No devices registered!"});
        }else{
            res.status(200).json({success: true, data: devices});
        }
        
    }catch(error){
        console.error("Error trying to retrieve the list of all devices from Database!");
        res.status(500).json({success: false, message: "Server Error"});
    }

    return res;
};

export const searchDevice = async(req, res) =>{
    const devID = req.body.deviceID;
    const loc = req.body.location;

    let filter=[];

    if(devID != null && devID.toString().length >0){
        filter.push({"deviceID": {$regex: devID.toString(), $options: "i"}});
    }

    if(loc != null && loc.toString().length >0){
        filter.push({"location": {$regex: loc.toString(), $options: "i"}});
    }

    if(filter == null || filter.length <1){
        return res.status(400).json({success: false, message: "No search parameter received!"});
    }

    try{
        const devices = await Device.aggregate([
            {
                $match: {
                    $or: filter
                }
            }    
        ]);
        
        if(!devices instanceof Array || devices.length === 0){
            res.status(200).json({success: false, message: "device not found!"});
        }else{
            res.status(200).json({success: true, data: devices});
        }
        
    }catch(error){
        console.error("Error trying to search for devices in the Database!");
        res.status(500).json({success: false, message: "Server Error"});
    }

    return res;
}

export const registerNewDevice = async(req, res) =>{
    const deviceID = req.body.deviceID;
    const location = req.body.location;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    if(!deviceID){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }

    if(!location){
        return res.status(200).json({success: false, message: "Invalid Device Location!"});
    }
    if(!longitude || typeof longitude !== 'number' || isNaN(longitude)){
        return res.status(200).json({success: false, message: "Invalid Device longitude!"});
    }

    if(!latitude || typeof latitude !== 'number' || isNaN(latitude)){
        return res.status(200).json({success: false, message: "Invalid Device latitude!"});
    }
    

    const session = await mongoose.startSession();
    try{
        const existingDevice = await Device.find({"deviceID": deviceID});

        if(existingDevice.length > 0){
            return res.status(200).json({success: false, message: "Device ID is already registered!"});
        }

        session.startTransaction();
        const newDevice = new Device();
        newDevice.deviceID = deviceID;
        newDevice.location = location;
        newDevice.coordinate = [latitude, longitude];

        await newDevice.save({session});
        await session.commitTransaction();

        res.status(200).json({success: true, data:[newDevice]});
    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in New Device Registration! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const updateDevice = async(req, res) =>{
    const { id } = req.params;
    const deviceID = req.body.deviceID;
    const location = req.body.location;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(200).json({success: false, message: "Invalid Device DB ID!"});
    }

    if(!deviceID){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }

    if(!location){
        return res.status(200).json({success: false, message: "Invalid Device Location!"});
    }

    if(!longitude || typeof longitude !== 'number' || isNaN(longitude)){
        return res.status(200).json({success: false, message: "Invalid Device longitude!"});
    }

    if(!latitude || typeof latitude !== 'number' || isNaN(latitude)){
        return res.status(200).json({success: false, message: "Invalid Device latitude!"});
    }

    const session = await mongoose.startSession();
    try{

        const device = await Device.findById(id);
        if(!device){
            return res.status(200).json({success: false, message: "Device DB ID not found!"});
        }

        const existingDevice = await Device.find({"deviceID": deviceID});
        if(Array.isArray(existingDevice) && existingDevice.length>0 && existingDevice[0]._id.toString() != id.toString()){
            return res.status(200).json({success: false, message: "Device ID is already registered!"});
        }

        session.startTransaction();
        device.deviceID = deviceID;
        device.location = location;
        device.coordinate = [latitude, longitude];

        const updatedDevice = await Device.findByIdAndUpdate(id, device, {new: true, session});

        await session.commitTransaction();

        res.status(200).json({success: true, data:[updatedDevice]});

    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in updating the Device information! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const deviceSelfCheck = async(req, res) =>{
    const deviceID = req.body.deviceID;
    
    if(deviceID != null && deviceID.toString().length <=0){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});    
    }

    const session = await mongoose.startSession();
    try{
        const existingDevice = await Device.find({"deviceID": deviceID});

        if(existingDevice.length <= 0){
            return res.status(200).json({success: false, message: "Invalid Device ID!"});
        }else{
            session.startTransaction();
            const device = existingDevice[0];
            device.isOnline=true;
            device.lastOnlineCheck=Date.now();
            await Device.findByIdAndUpdate(device._id, device, {new: true, session});
            await session.commitTransaction();

            res.status(200).json({success: true, message: "Device checked!"});
        }
        
    }catch(error){
        await session.abortTransaction();
        console.error("Error trying to search for devices in the Database!");
        res.status(500).json({success: false, message: "Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const getOnlineStatusCount = async (req, res) =>{
    try{
        const result = await Device.aggregate([
            {
                $group: {
                _id: "$isOnline",
                value: { $sum: 1 }
                }
            },
            {
                $project: {
                _id: 0,
                status: {
                    $cond: { if: { $eq: ["$_id", true] }, then: "Online", else: "Offline" }
                },
                value: 1
                }
            }
        ]);


        if(!result instanceof Array || result.length === 0){
            res.status(200).json({success: false, message: "No record found!"});
        }else{
            res.status(200).json({success: true, data: result});
        }

    }catch(error){
        console.error("Error trying retrieve the Data Online status of devices!");
        console.error(error.stack);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const isAllBinOk = async (req, res) =>{
    try{
        const result = await Device.aggregate([
            {
                $match: {
                    $or:[
                    {"isBiodegradableBinFull":true},
                    {"isNonBiodegradableBinFull":true},
                    {"isHazardousBinFull": true}
                ]
                }
            }
        ]);


        if(result instanceof Array && result.length > 0){
            res.status(200).json({success: true, isTrue: false, devicesNotOkCount: result.length});
        }else{
            res.status(200).json({success: true, isTrue: true, devicesNotOkCount: 0 });
        }

    }catch(error){
        console.error("Error trying retrieve the Data if all devices are ok!");
        console.error(error.stack);
        res.status(500).json({success: false, message: "Server Error"});
    }
}