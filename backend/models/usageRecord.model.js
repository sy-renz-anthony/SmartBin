import mongoose from 'mongoose';

const usageRecordSchema = new mongoose.Schema({
    device:{
        type: mongoose.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    garbageType:{
        type: String,
        required: true
    },
    eventDate:{
        type: Date,
        required: true,
        default: Date.now()
    }
});

const UsageRecord = mongoose.model('UsageRecord', usageRecordSchema);

export default UsageRecord;