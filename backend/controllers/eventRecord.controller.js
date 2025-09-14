import EventRecord from '../models/eventRecord.model.js';
import { isDateValid } from '../functions/functions.js';
import moment from 'moment-timezone';

export const retrieveEventRecord = async(req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.keyword;
    const isBiodegradable = req.body.isBiodegradable;
    const isNonBiodegradable = req.body.isNonBiodegradable;
    const isHazardous = req.body.isHazardous;
    const isFullEvent = req.body.isFullEvent;
    const isEmptyEvent = req.body.isEmptyEvent;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    let garbageTypeFilter=[];
    let eventTypeFilter=[];
    let idFilter = [];
    let startDateUTC,
        endDateUTC;

    if(deviceID != null && deviceID.toString().length >0){
        idFilter.push({"$or":[
                {"device.deviceID": {$regex: deviceID.toString(), $options: "i"}},
                {"device.location": {$regex: deviceID.toString(), $options: "i"}}
            ]});
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

    if(typeof isFullEvent === 'boolean' && isFullEvent){
        eventTypeFilter.push({"eventType": {$regex: "FULL", $options: "i"}});
    }

    if(typeof isEmptyEvent === 'boolean' && isEmptyEvent){
        eventTypeFilter.push({"eventType": {$regex: "EMPTIED", $options: "i"}});
    }

    if(eventTypeFilter.length>1){
        idFilter.push({"$or":eventTypeFilter});
    }else if(eventTypeFilter.length == 1){
        idFilter.push(eventTypeFilter[0]);
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

    if((!garbageTypeFilter || garbageTypeFilter.length < 1) && (!idFilter || idFilter.length<1) && !startDate){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }
    
    try{

        var matchParams = {};
         if((idFilter.length>0) && (garbageTypeFilter.length > 0)){
            matchParams = {
                    $match: {
                        $and: idFilter,
                        $or: garbageTypeFilter
                    }
                };
        }else if((idFilter.length>0) && (garbageTypeFilter.length<1)){
            if(idFilter.length==1){
                matchParams = {
                        $match: idFilter[0]
                    }
            }else{
                matchParams = {
                    $match: {
                        $and: idFilter
                    }
                }
            }
            
        }else if((idFilter.length<1) && (garbageTypeFilter.length>0)){
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

            if(garbageTypeFilter.length<1&&idFilter.length<1){
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
            const eventRecords = await EventRecord.aggregate([
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
                        eventType: 1,
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
            
            if(!eventRecords instanceof Array || eventRecords.length === 0){
                res.status(200).json({success: false, message: "No record found!"});
            }else{
                res.status(200).json({success: true, data: eventRecords});
            }
            
        }catch(error){
            console.error("Error trying to search for devices event records in the Database!");
            console.error(error.stack);
            res.status(500).json({success: false, message: "Server Error"});
        }
    
        return res;
}