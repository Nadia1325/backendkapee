"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrder = void 0;
var validateOrder = function (req, res, next) {
    var _a = req.body, clientInfo = _a.clientInfo, cartItems = _a.cartItems, paymentMethod = _a.paymentMethod, totalAmount = _a.totalAmount;
    if (!(clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.fullName) || !(clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.email) || !(clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.address)) {
        return res.status(400).json({ error: "Client info is incomplete" });
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: "Cart cannot be empty" });
    }
    if (!paymentMethod) {
        return res.status(400).json({ error: "Payment method is required" });
    }
    if (!totalAmount || totalAmount <= 0) {
        return res.status(400).json({ error: "Invalid total amount" });
    }
    next();
};
exports.validateOrder = validateOrder;
