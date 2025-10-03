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
exports.removeFromCart = exports.getCart = exports.updateCartItem = exports.addToCart = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var cart_model_1 = __importDefault(require("../models/cart.model"));
var product_model_1 = __importDefault(require("../models/product.model"));
// Helper: format cart for frontend
var formatCart = function (cart) {
    return {
        id: cart._id.toString(),
        user: cart.user.toString(),
        items: cart.items
            .filter(function (i) { return i.productId; })
            .map(function (i) { return ({
            productId: i.productId._id.toString(),
            name: i.productId.name,
            price: i.productId.price,
            image: i.productId.image || "",
            quantity: i.quantity,
        }); }),
    };
};
// ==================== ADD TO CART ====================
var addToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, productId_1, _b, quantity, product, cart, existingItem, savedCart, error_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
                _a = req.body, productId_1 = _a.productId, _b = _a.quantity, quantity = _b === void 0 ? 1 : _b;
                if (!userId)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                if (!productId_1)
                    return [2 /*return*/, res.status(400).json({ message: "Product ID is required" })];
                return [4 /*yield*/, product_model_1.default.findById(productId_1)];
            case 1:
                product = _d.sent();
                if (!product)
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                return [4 /*yield*/, cart_model_1.default.findOne({ user: userId })];
            case 2:
                cart = _d.sent();
                if (!cart) {
                    cart = new cart_model_1.default({
                        user: new mongoose_1.default.Types.ObjectId(userId),
                        items: [{ productId: new mongoose_1.default.Types.ObjectId(productId_1), quantity: Number(quantity) }],
                    });
                }
                else {
                    cart.items = cart.items.filter(function (i) { return i.productId; });
                    existingItem = cart.items.find(function (i) { return i.productId && i.productId.toString() === productId_1; });
                    if (existingItem) {
                        existingItem.quantity += Number(quantity);
                    }
                    else {
                        cart.items.push({
                            productId: new mongoose_1.default.Types.ObjectId(productId_1),
                            quantity: Number(quantity),
                        });
                    }
                }
                return [4 /*yield*/, cart.save()];
            case 3:
                savedCart = _d.sent();
                return [4 /*yield*/, savedCart.populate("items.productId")];
            case 4:
                _d.sent();
                return [2 /*return*/, res.status(200).json(formatCart(savedCart))];
            case 5:
                error_1 = _d.sent();
                console.error("Add to cart error:", error_1.message);
                return [2 /*return*/, res.status(500).json({ message: "Server error", error: error_1.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addToCart = addToCart;
// ==================== UPDATE CART ITEM ====================
var updateCartItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, productId_2, quantity, cart, item, savedCart, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, productId_2 = _a.productId, quantity = _a.quantity;
                if (!userId)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                if (!productId_2 || !quantity || quantity < 1)
                    return [2 /*return*/, res.status(400).json({ message: "Invalid input" })];
                return [4 /*yield*/, cart_model_1.default.findOne({ user: userId })];
            case 1:
                cart = _c.sent();
                if (!cart)
                    return [2 /*return*/, res.status(404).json({ message: "Cart not found" })];
                cart.items = cart.items.filter(function (i) { return i.productId; });
                item = cart.items.find(function (i) { return i.productId && i.productId.toString() === productId_2; });
                if (!item)
                    return [2 /*return*/, res.status(404).json({ message: "Product not in cart" })];
                item.quantity = Number(quantity);
                return [4 /*yield*/, cart.save()];
            case 2:
                savedCart = _c.sent();
                return [4 /*yield*/, savedCart.populate("items.productId")];
            case 3:
                _c.sent();
                return [2 /*return*/, res.status(200).json(formatCart(savedCart))];
            case 4:
                error_2 = _c.sent();
                console.error("Update cart error:", error_2.message);
                return [2 /*return*/, res.status(500).json({ message: "Server error", error: error_2.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateCartItem = updateCartItem;
// ==================== GET CART ====================
var getCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, cart, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                return [4 /*yield*/, cart_model_1.default.findOne({ user: userId }).populate("items.productId")];
            case 1:
                cart = _b.sent();
                if (!cart)
                    return [2 /*return*/, res.json({ items: [] })];
                cart.items = cart.items.filter(function (i) { return i.productId; });
                return [2 /*return*/, res.status(200).json(formatCart(cart))];
            case 2:
                error_3 = _b.sent();
                console.error("Get cart error:", error_3.message);
                return [2 /*return*/, res.status(500).json({ message: "Server error", error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCart = getCart;
// ==================== REMOVE ITEM ====================
var removeFromCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, productId_3, cart, savedCart, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                productId_3 = req.body.productId;
                if (!userId)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                if (!productId_3)
                    return [2 /*return*/, res.status(400).json({ message: "Product ID required" })];
                return [4 /*yield*/, cart_model_1.default.findOne({ user: userId })];
            case 1:
                cart = _b.sent();
                if (!cart)
                    return [2 /*return*/, res.status(404).json({ message: "Cart not found" })];
                cart.items = cart.items.filter(function (i) { return i.productId && i.productId.toString() !== productId_3; });
                return [4 /*yield*/, cart.save()];
            case 2:
                savedCart = _b.sent();
                return [4 /*yield*/, savedCart.populate("items.productId")];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json(formatCart(savedCart))];
            case 4:
                error_4 = _b.sent();
                console.error("Remove from cart error:", error_4.message);
                return [2 /*return*/, res.status(500).json({ message: "Server error", error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.removeFromCart = removeFromCart;
