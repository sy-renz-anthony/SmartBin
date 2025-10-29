import { isDateValid } from '../functions/functions.js';
import moment from 'moment-timezone';
import VolumeRecord from '../models/volumeRecord.model.js';

export const retrieveVolumeRecordBase = async(req, res) =>{
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
                            "dateTaken": {
                                $gte: startDateUTC,
                                $lte: endDateUTC
                            }
                        }
                    }
                }else{
                    matchParams.$match["dateTaken"]={ 
                        $gte: startDateUTC,
                        $lte: endDateUTC
                    };
                }
            }
    
                const volumeRecords = await VolumeRecord.aggregate([
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
                            dateTaken: {
                                $dateToString: {
                                date: '$dateTaken',
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
                
                if(!volumeRecords instanceof Array || volumeRecords.length === 0){
                    res.status(200).json({success: false, message: "No record found!"});
                }else{
                    res.status(200).json({success: true, data: volumeRecords});
                }
                
            }catch(error){
                console.error("Error trying to search for devices volume records in the Database!");
                console.error(error.stack);
                res.status(500).json({success: false, message: "Server Error"});
            }
        
            return res;
}

export const retrieveVolumeRecordGroupGarbageType = async(req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.keyword;
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
    
        if(startDate !==null && startDate !== undefined && startDate.length>0){
            if(!await isDateValid(startDate)){
                return res.status(200).json({success: false, message: "Start date was invalid!"});
            }else if(endDate !==null && endDate !== undefined && endDate.length>0  && !await isDateValid(endDate)){
                return res.status(200).json({success: false, message: "End date was invalid!"});
            }
        }else if(endDate !==null && endDate !== undefined && endDate.length>0){
            return res.status(200).json({success: false, message: "Cannot have an End date without a Start date!"});
        }
    
        if(!idFilter && !startDate){
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
                            "dateTaken": {
                                $gte: startDateUTC,
                                $lte: endDateUTC
                            }
                        }
                    }
                }else{
                    matchParams.$match["dateTaken"]={ 
                        $gte: startDateUTC,
                        $lte: endDateUTC
                    };
                }
            }
    
                const volumeRecords = await VolumeRecord.aggregate([
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
                            volume: 1,
                            dateTaken: {
                                $dateToString: {
                                date: '$dateTaken',
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
                    },
                    {
                      $group: {
                        _id: "$garbageType",        
                        totalVolume: { $sum: "$volume" },    
                      }
                    }
                ]);
                
                if(!volumeRecords instanceof Array || volumeRecords.length === 0){
                    res.status(200).json({success: false, message: "No record found!"});
                }else{
                    res.status(200).json({success: true, data: volumeRecords});
                }
                
            }catch(error){
                console.error("Error trying to search for devices volume records in the Database!");
                console.error(error.stack);
                res.status(500).json({success: false, message: "Server Error"});
            }
        
            return res;
}


