import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    deviceID:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    isWetBinFull:{
        type: Boolean,
        required: true,
        default: false
    },
    isDryBinFull:{
        type: Boolean,
        required: true,
        default: false
    },
    isMetallicBinFull:{
        type: Boolean,
        required: true,
        default: false
    },
    isOnline:{
        type: Boolean,
        required: true,
        default: false
    }
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;