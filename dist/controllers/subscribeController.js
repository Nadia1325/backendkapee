"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriber = exports.getSubscribers = exports.subscribe = void 0;
const Subscriber_1 = __importDefault(require("../models/Subscriber"));
const subscribe = async (req, res) => {
    const { email } = req.body;
    try {
        const newSubscriber = await Subscriber_1.default.create({ email });
        res.status(201).json(newSubscriber);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
};
exports.subscribe = subscribe;
const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber_1.default.find().sort({ createdAt: -1 });
        res.json(subscribers);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
};
exports.getSubscribers = getSubscribers;
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const subscriber = await Subscriber_1.default.findByIdAndDelete(id);
        if (!subscriber) {
            return res.status(404).json({ error: "Subscriber not found" });
        }
        res.json({ success: true, message: "Subscriber deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
};
exports.deleteSubscriber = deleteSubscriber;
