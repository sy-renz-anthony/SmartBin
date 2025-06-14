import UsageRecord from '../models/usageRecord.model.js';
import Device from '../models/device.model.js';
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

    const deviceID = req.body.keyword;
    const isWet = req.body.isWet;
    const isDry = req.body.isDry;
    const isMetallic = req.body.isMetallic;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    let filter=[];
    let startDateUTC,
        endDateUTC;

    if(deviceID != null && deviceID.toString().length >0){
        filter.push({"device.deviceID": {$regex: deviceID.toString(), $options: "i"}});
        filter.push({"device.location": {$regex: deviceID.toString(), $options: "i"}});
    }

    if(typeof isWet === 'boolean' && isWet){
        filter.push({"garbageType": {$regex: "WET", $options: "i"}});
    }

    if(typeof isDry === 'boolean' && isDry){
        filter.push({"garbageType": {$regex: "Dry", $options: "i"}});
    }

    if(typeof isMetallic === 'boolean' && isMetallic){
        filter.push({"garbageType": {$regex: "METALLIC", $options: "i"}});
    }

    if((!filter || filter.length < 1) && (!startDate || startDate.length<1)){
        return res.status(200).json({success: false, message: "Invalid values!"});
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

    try{

        var matchParams = {};
        if(filter.length>0){
            matchParams = {
                $match: {
                    $or: filter
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
            matchParams.$match["eventDate"]={ 
                $gte: startDateUTC,
                $lte: endDateUTC
            };
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