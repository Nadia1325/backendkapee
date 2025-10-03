"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
var validateEmail = function (req, res, next) {
    var email = req.body.email;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    next();
};
exports.validateEmail = validateEmail;
