import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema({
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

const Usage = mongoose.model('Usage', usageSchema);

export default Usage;