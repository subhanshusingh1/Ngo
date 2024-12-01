// import modules
import mongoose from "mongoose";
import validator from "validator";

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Your Email!!!'],
        lowercase: true,
        validate: [validator.isEmail, 'Please Provide Valid Email'],
        index: true,
        unique: true
    },
    otp: {
        type: String,
        required: [true, 'OTP is required'],
        maxlength: 8
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});


export default mongoose.model('OTP', OtpSchema);