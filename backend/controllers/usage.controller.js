import Usage from '../models/usage.model.js';
import Device from '../models/device.model.js';

import mongoose from "mongoose";

export const garbageBinUsed = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.deviceID;
    const garbageType = req.body.garbageType;

    if(!deviceID){
        return res.status(400).json({success: false, message: "Invalid Device ID!"});
    }

    if(!garbageType){
        return res.status(400).json({success: false, message: "Please provide the type of garbage the user thrown!"});
    }else if(garbageType !== "WET" && garbageType !== "DRY" && garbageType !== "METALLIC"){
        return res.status(400).json({success: false, message: "Garbage Type is invalid!"});
    }

    const session = await mongoose.startSession();
    try{
        const device = await Device.findOne({"deviceID":deviceID});
        if(!device){
            return res.status(401).json({success: false, message: "Device is Not registered!"});
        }
        
        /*
        if(!device.isOnline){
            return res.status(401).json({success: false, message: "Device is Not Online!"});
        }*/

        session.startTransaction();

        const usage = new Usage();
        usage.device = device._id;
        usage.garbageType = garbageType;
        
        await usage.save({session});

        await session.commitTransaction();

        res.status(200).json({success: true, data: [usage]});
    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in Bin Usage Transaction creation! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}