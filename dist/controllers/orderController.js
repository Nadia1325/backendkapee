"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
const createOrder = async (req, res) => {
    try {
        const order = new Order_1.default(req.body);
        await order.save();
        res.status(201).json({ message: "Order placed successfully", order });
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.createOrder = createOrder;
const getOrders = async (_req, res) => {
    try {
        const orders = await Order_1.default.find().sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.getOrderById = getOrderById;
const updateOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findByIdAndDelete(req.params.id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json({ message: "Order deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.deleteOrder = deleteOrder;
