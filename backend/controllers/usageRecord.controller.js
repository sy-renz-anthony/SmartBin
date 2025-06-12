import UsageRecord from '../models/usageRecord.model.js';
import Device from '../models/device.model.js';

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
    }else if(garbageType !== "WET" && garbageType !== "DRY" && garbageType !== "METALLIC"){
        return res.status(200).json({success: false, message: "Garbage Type is invalid!"});
    }

    const session = await mongoose.startSession();
    try{
        const device = await Device.findOne({"deviceID":deviceID});
        if(!device){
            return res.status(200).json({success: false, message: "Device is Not registered!"});
        }
        
        /*
        if(!device.isOnline){
            return res.status(401).json({success: false, message: "Device is Not Online!"});
        }*/

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

    const deviceID = req.body.deviceID;
    const isWet = req.body.isWet;
    const isDry = req.body.isDry;
    const isMetallic = req.body.isMetallic;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    let garbageTypeFilter=[];
    let idFilter = null;

    if(deviceID != null && deviceID.toString().length >0){
        idFilter=[{"device.deviceID": {$regex: deviceID.toString(), $options: "i"}}];
    }

    if(typeof isWet === 'boolean' && isWet){
        garbageTypeFilter.push({"garbageType": {$regex: "WET", $options: "i"}});
    }

    if(typeof isDry === 'boolean' && isDry){
        garbageTypeFilter.push({"garbageType": {$regex: "Dry", $options: "i"}});
    }

    if(typeof isMetallic === 'boolean' && isMetallic){
        garbageTypeFilter.push({"garbageType": {$regex: "METALLIC", $options: "i"}});
    }


    if((!garbageTypeFilter || garbageTypeFilter.length < 1) && !idFilter){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    try{

        var matchParams = {};
        if(idFilter && (garbageTypeFilter.length > 0)){
            matchParams = {
                    $match: {
                        $and: idFilter,
                        $or: garbageTypeFilter
                    }
                };
        }else if(idFilter && (garbageTypeFilter.length<1)){
            matchParams = {
                    $match: {
                        $or: idFilter
                    }
                }
        }else if(!idFilter && garbageTypeFilter){
            matchParams = {
                    $match: {
                        $or: garbageTypeFilter
                    }
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
                },matchParams
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