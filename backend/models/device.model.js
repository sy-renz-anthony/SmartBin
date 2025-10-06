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
    coordinate:{
        type: [Number],
        validate: {
            validator: function (arr) {
                return arr.length === 2;
            },
            message: 'Coordinates must be an array of exactly 2 numbers [longitude, latitude].'
        },
        required: true
    },
    barangay:{
        type: String,
        required: true
    },
    municipality:{
        type: String,
        required: true
    },
    province:{
        type: String,
        required: true
    },
    region:{
        type: String,
        required: true
    },
    postcode:{
        type: String,
        required: true
    },
    countryCode:{
        type: String,
        required: true
    },
    isHazardousBinFull:{
        type: Boolean,
        required: true,
        default: false
    },
    isBiodegradableBinFull:{
        type: Boolean,
        required: true,
        default: false
    },
    isNonBiodegradableBinFull:{
        type: Boolean,
        required: true,
        default: false
    },
    isOnline:{
        type: Boolean,
        required: true,
        default: false
    },
    lastOnlineCheck:{
        type: Number,
        default: 0
    }
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;