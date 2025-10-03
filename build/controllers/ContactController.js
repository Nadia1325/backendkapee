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
exports.createContact = void 0;
var Contact_1 = require("../models/Contact");
var SendEmails_1 = __importDefault(require("../utils/SendEmails"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var createContact = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, phone, message, newContact, adminEmail, error_1, err;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, name = _a.name, email = _a.email, phone = _a.phone, message = _a.message;
                if (!name || !email || !message) {
                    res.status(400).json({ message: "Name, email, and message are required." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Contact_1.Contact.create({ name: name, email: email, phone: phone, message: message })];
            case 1:
                newContact = _b.sent();
                adminEmail = process.env.ADMIN_EMAIL;
                if (!adminEmail) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, SendEmails_1.default)(adminEmail, "New Contact Message", "\n        <h1>New Contact Message</h1>\n        <p><strong>Name:</strong> ".concat(name, "</p>\n        <p><strong>Email:</strong> ").concat(email, "</p>\n        <p><strong>Phone:</strong> ").concat(phone || "N/A", "</p>\n        <p><strong>Message:</strong> ").concat(message, "</p>\n        "))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [4 /*yield*/, (0, SendEmails_1.default)(email, "Thank you for contacting us", "\n      <h3>Hello ".concat(name, ",</h3>\n      <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>\n      <blockquote>Your Message: ").concat(message, "</blockquote>\n      <p>Our team will get back to you as soon as possible.</p>\n      </br>\n      <p>Best regards,</p>\n      <p><strong>Kapee Team</strong></p>\n      "))];
            case 4:
                _b.sent();
                res.status(201).json({
                    message: "Contact message received successfully.",
                    contact: newContact
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                err = error_1;
                console.error("Error creating contact message:", err.message);
                res.status(500).json({ message: "Server error", error: err.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createContact = createContact;
