"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.app_name,
        pass: process.env.app_password,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
// Generic sender
const mailerSender = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully.");
        return true;
    }
    catch (error) {
        console.error("❌ Error sending email: ", error.message);
        return false;
    }
};
// OTP sender
const sendOTP = async (to, otp) => {
    const subject = "Your OTP Code";
    const htmlContent = `
    <h2>Verification Code</h2>
    <p>Your OTP code is: <b>${otp}</b></p>
    <p>This code will expire in 5 minutes.</p>
  `;
    return await mailerSender(to, subject, htmlContent);
};
exports.sendOTP = sendOTP;
exports.default = mailerSender;
