"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Auth Middleware
 */
const auth = (req, res, next) => {
    try {
        // 1️⃣ Get token from header or query param
        let token = req.header("Authorization")?.replace("Bearer ", "").trim();
        if (!token && req.query.token)
            token = String(req.query.token).trim();
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // 2️⃣ Verify token
        const secret = process.env.JWT_SECRET || "fallback_secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
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
