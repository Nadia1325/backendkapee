/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
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
const mailerSender = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  try {
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully.");
    return true;
  } catch (error: any) {
    console.error("❌ Error sending email: ", error.message);
    return false;
  }
};

// OTP sender
export const sendOTP = async (to: string, otp: string): Promise<boolean> => {
  const subject = "Your OTP Code";
  const htmlContent = `
    <h2>Verification Code</h2>
    <p>Your OTP code is: <b>${otp}</b></p>
    <p>This code will expire in 5 minutes.</p>
  `;
  return await mailerSender(to, subject, htmlContent);
};

export default mailerSender;