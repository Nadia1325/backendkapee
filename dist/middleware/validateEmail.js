"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    next();
};
exports.validateEmail = validateEmail;
