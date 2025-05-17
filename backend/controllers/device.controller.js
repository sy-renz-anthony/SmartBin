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

    if(!deviceID){
        return res.status(400).json({success: false, message: "Invalid Device ID!"});
    }

    if(!location){
        return res.status(400).json({success: false, message: "Invalid Device Location!"});
    }

    const session = await mongoose.startSession();
    try{
        const existingDevice = await Device.find({"deviceID": deviceID});

        if(existingDevice.length > 0){
            return res.status(400).json({success: false, message: "Device ID is already registered!"});
        }

        session.startTransaction();
        const newDevice = new Device();
        newDevice.deviceID = deviceID;
        newDevice.location = location;

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

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(400).json({success: false, message: "Invalid Device DB ID!"});
    }

    if(!deviceID){
        return res.status(400).json({success: false, message: "Invalid Device ID!"});
    }

    if(!location){
        return res.status(400).json({success: false, message: "Invalid Device Location!"});
    }

    const session = await mongoose.startSession();
    try{

        const device = await Device.findById(id);
        if(!device){
            return res.status(400).json({success: false, message: "Device DB ID not found!"});
        }

        const existingDevice = await Device.find({"deviceID": deviceID});
        if(Array.isArray(existingDevice) && existingDevice.length>0 && existingDevice[0]._id.toString() != id.toString()){
            return res.status(400).json({success: false, message: "Device ID is already registered!"});
        }

        session.startTransaction();
        device.deviceID = deviceID;
        device.location = location;

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