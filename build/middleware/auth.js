"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Auth Middleware
 */
var auth = function (req, res, next) {
    var _a;
    try {
        // 1️⃣ Get token from header or query param
        var token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "").trim();
        if (!token && req.query.token)
            token = String(req.query.token).trim();
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // 2️⃣ Verify token
        var secret = process.env.JWT_SECRET || "fallback_secret";
        var decoded = jsonwebtoken_1.default.verify(token, secret);
        // 3️⃣ Validate userId
        if (!decoded.userId) {
            return res.status(401).json({ message: "Invalid token: missing user ID" });
        }
        // 4️⃣ Attach userId to request
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};
exports.auth = auth;
