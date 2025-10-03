"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.verifyOtp = exports.sendOtp = exports.getUsers = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const SendEmails_1 = __importDefault(require("../utils/SendEmails"));
/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "24h",
    });
};
/**
 * Register User
 */
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Registration failed" });
    }
};
exports.register = register;
/**
 * Login User
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = (await User_1.default.findOne({ email }));
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Login failed" });
    }
};
exports.login = login;
/**
 * Logout User
 */
const logout = async (_req, res) => {
    try {
        return res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Logout failed" });
    }
};
exports.logout = logout;
/**
 * Get All Users
 */
const getUsers = async (_req, res) => {
    try {
        const users = await User_1.default.find().select("-password");
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Fetching users failed" });
    }
};
exports.getUsers = getUsers;
/**
 * Send OTP
 */
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = expiresAt;
        await user.save();
        // Send OTP via email
        await (0, SendEmails_1.default)(email, "Your OTP Code", `<h2>Verification Code</h2>
       <p>Your OTP code is: <b>${otp}</b></p>
       <p>This code will expire in 5 minutes.</p>`);
        return res.json({ message: "OTP sent successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to send OTP" });
    }
};
exports.sendOtp = sendOtp;
/**
 * Verify OTP
 */
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = (await User_1.default.findOne({ email }));
        if (!user)
            return res.status(404).json({ message: "User not found" });
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "OTP verification failed" });
    }
};
exports.verifyOtp = verifyOtp;
/**
 * Request Password Reset (via OTP)
 */
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
        await user.save();
        await (0, SendEmails_1.default)(email, "Password Reset OTP", `<h2>Password Reset</h2>
       <p>Your OTP code is: <b>${otp}</b></p>
       <p>This code will expire in 10 minutes.</p>`);
        return res.json({ message: "Password reset OTP sent successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to request password reset" });
    }
};
exports.requestPasswordReset = requestPasswordReset;
/**
 * Reset Password using OTP
 */
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())
            return res.status(400).json({ message: "Invalid or expired OTP" });
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.json({ message: "Password reset successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Password reset failed" });
    }
};
exports.resetPassword = resetPassword;
