import User from '../models/user.model.js';
import Device from '../models/device.model.js';

import mongoose from 'mongoose';

export const isUserEmailExisting = async (email, idToExcempt) =>{
    try{
        const user=await User.find({emailAddress: email});

        if(!user || user.length<1){
            return false;
        }else if(idToExcempt == user[0]._id){
            return false;
        }else{
            return true;
        }
    }catch(error){
        console.error("Error in checking existence of User email! - "+error.message);
        error.message = "Server Error!\n"+error.message;
        throw(error);
    }
}

export const isUserIDExisting = async (id, idToExcempt) =>{
    try{
        const user=await User.find({employeeID: id.toString()});
        if(!user || user.length<1){
            return false;
        }else if(idToExcempt == user[0]._id){
            return false;
        }else{
            return true;
        }
    }catch(error){
        console.error("Error in checking existence of User ID! - "+error.message);
        error.message = "Server Error!\n"+error.message;
        throw(error);
    }
}

export const isDeviceIDExisting = async (devID) =>{
    try{
        const device=await Device.find({deviceID: devID});

        if(!device || device.length<1){
            return false;
        }else{
            return true;
        }
    }catch(error){
        console.error("Error in checking existence of Device ID! - "+error.message);
        error.message = "Server Error!\n"+error.message;
        throw(error);
    }
}