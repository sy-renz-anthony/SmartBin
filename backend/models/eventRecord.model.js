import mongoose from 'mongoose';

const eventRecordSchema = new mongoose.Schema({
    device:{
        type: mongoose.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    eventType:{
        type: String,
        required: true
    },
    eventDate:{
        type: Date,
        required: true,
        default: Date.now()
    }
});

const EventRecord = mongoose.model('UsageRecord', eventRecordSchema);

export default EventRecord;