"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
var mongoose_1 = require("mongoose");
var contactSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);
