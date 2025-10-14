import mongoose from 'mongoose';

const VolumeRecordSchema = new mongoose.Schema({
    device:{
        type: mongoose.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    garbageType:{
        type: String,
        required: true
    },
    dateTaken:{
        type: Date,
        required: true,
        default: Date.now()
    },
    volume:{
        type: Number,
        required: true,
        default: 0
    }
});

const VolumeRecord = mongoose.model('VolumeRecord', VolumeRecordSchema);

export default VolumeRecord;