"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.verifyOtp = exports.sendOtp = exports.getUsers = exports.logout = exports.login = exports.register = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importDefault(require("../models/User"));
var SendEmails_1 = __importDefault(require("../utils/SendEmails"));
/**
 * Generate JWT Token
 */
var generateToken = function (userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "24h",
    });
};
/**
 * Register User
 */
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, role, existingUser, hashedPassword, user, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password, role = _a.role;
                return [4 /*yield*/, User_1.default.findOne({ $or: [{ email: email }, { username: username }] })];
            case 1:
                existingUser = _b.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(400).json({ message: "User already exists" })];
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                user = new User_1.default({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    role: role || "user",
                });
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                token = generateToken(user._id.toString());
                return [2 /*return*/, res.status(201).json({
                        token: token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                        },
                    })];
            case 4:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: error_1.message || "Registration failed" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
/**
 * Login User
 */
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = (_b.sent());
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: "Invalid credentials" })];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch)
                    return [2 /*return*/, res.status(400).json({ message: "Invalid credentials" })];
                token = generateToken(user._id.toString());
                return [2 /*return*/, res.json({
                        token: token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            role: user.role || "user",
                        },
                    })];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: error_2.message || "Login failed" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
/**
 * Logout User
 */
var logout = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2 /*return*/, res.json({ message: "Logged out successfully" })];
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json({ message: error.message || "Logout failed" })];
        }
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
/**
 * Get All Users
 */
var getUsers = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.find().select("-password")];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.json(users)];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: error_3.message || "Fetching users failed" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
/**
 * Send OTP
 */
var sendOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, otp, expiresAt, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = req.body.email;
                if (!email)
                    return [2 /*return*/, res.status(400).json({ message: "Email is required" })];
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                expiresAt = new Date(Date.now() + 5 * 60 * 1000);
                user.otp = otp;
                user.otpExpires = expiresAt;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                // Send OTP via email
                return [4 /*yield*/, (0, SendEmails_1.default)(email, "Your OTP Code", "<h2>Verification Code</h2>\n       <p>Your OTP code is: <b>".concat(otp, "</b></p>\n       <p>This code will expire in 5 minutes.</p>"))];
            case 3:
                // Send OTP via email
                _a.sent();
                return [2 /*return*/, res.json({ message: "OTP sent successfully" })];
            case 4:
                error_4 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: error_4.message || "Failed to send OTP" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.sendOtp = sendOtp;
/**
 * Verify OTP
 */
var verifyOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, user, token, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp;
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = (_b.sent());
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())
                    return [2 /*return*/, res.status(400).json({ message: "Invalid or expired OTP" })];
                user.otp = undefined;
                user.otpExpires = undefined;
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                token = generateToken(user._id.toString());
                return [2 /*return*/, res.json({
                        message: "OTP verified successfully",
                        token: token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            role: user.role || "user",
                        },
                    })];
            case 3:
                error_5 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: error_5.message || "OTP verification failed" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyOtp = verifyOtp;
/**
 * Request Password Reset (via OTP)
 */
var requestPasswordReset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, otp, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = req.body.email;
                if (!email)
                    return [2 /*return*/, res.status(400).json({ message: "Email is required" })];
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                user.otp = otp;
                user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, SendEmails_1.default)(email, "Password Reset OTP", "<h2>Password Reset</h2>\n       <p>Your OTP code is: <b>".concat(otp, "</b></p>\n       <p>This code will expire in 10 minutes.</p>"))];
            case 3:
                _a.sent();
                return [2 /*return*/, res.json({ message: "Password reset OTP sent successfully" })];
            case 4:
                error_6 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: error_6.message || "Failed to request password reset" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.requestPasswordReset = requestPasswordReset;
/**
 * Reset Password using OTP
 */
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, newPassword, user, hashedPassword, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, otp = _a.otp, newPassword = _a.newPassword;
                if (!email || !otp || !newPassword)
                    return [2 /*return*/, res.status(400).json({ message: "Email, OTP, and new password are required" })];
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())
                    return [2 /*return*/, res.status(400).json({ message: "Invalid or expired OTP" })];
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, 10)];
            case 2:
                hashedPassword = _b.sent();
                user.password = hashedPassword;
                user.otp = undefined;
                user.otpExpires = undefined;
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, res.json({ message: "Password reset successfully" })];
            case 4:
                error_7 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: error_7.message || "Password reset failed" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
