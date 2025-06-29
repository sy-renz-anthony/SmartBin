import mongoose from 'mongoose';

const eventRecordSchema = new mongoose.Schema({
    device:{
        type: mongoose.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    garbageType:{
        type: String,
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

const EventRecord = mongoose.model('EventRecord', eventRecordSchema);

export default EventRecord;