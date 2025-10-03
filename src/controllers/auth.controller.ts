import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Document } from "mongoose";
import mailerSender from "../utils/SendEmails";

/**
 * User Document Interface
 */
interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  otp?: string;
  otpExpires?: Date;
}

/**
 * Generate JWT Token
 */
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "24h",
  });
};

/**
 * Register User
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Registration failed" });
  }
};

/**
 * Login User
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as UserDocument | null;
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

/**
 * Logout User
 */
export const logout = async (_req: Request, res: Response) => {
  try {
    return res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Logout failed" });
  }
};

/**
 * Get All Users
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Fetching users failed" });
  }
};

/**
 * Send OTP
 */
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = expiresAt;
    await user.save();

    // Send OTP via email
    await mailerSender(
      email,
      "Your OTP Code",
      `<h2>Verification Code</h2>
       <p>Your OTP code is: <b>${otp}</b></p>
       <p>This code will expire in 5 minutes.</p>`
    );

    return res.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = (await User.findOne({ email })) as UserDocument | null;
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id.toString());

    return res.json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "OTP verification failed" });
  }
};

/**
 * Request Password Reset (via OTP)
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await user.save();

    await mailerSender(
      email,
      "Password Reset OTP",
      `<h2>Password Reset</h2>
       <p>Your OTP code is: <b>${otp}</b></p>
       <p>This code will expire in 10 minutes.</p>`
    );

    return res.json({ message: "Password reset OTP sent successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to request password reset" });
  }
};

/**
 * Reset Password using OTP
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Email, OTP, and new password are required" });

    const user = await User.findOne({ email }) as UserDocument | null;
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Password reset failed" });
  }
};
