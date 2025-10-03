"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
// utils/otpGenerator.ts
const generateOTP = (length = 6) => {
    let otp = "";
    const digits = "0123456789";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};
exports.generateOTP = generateOTP;
