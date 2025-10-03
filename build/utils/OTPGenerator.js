"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
// utils/otpGenerator.ts
var generateOTP = function (length) {
    if (length === void 0) { length = 6; }
    var otp = "";
    var digits = "0123456789";
    for (var i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};
exports.generateOTP = generateOTP;
