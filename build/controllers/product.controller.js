"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
var product_model_1 = __importDefault(require("../models/product.model"));
// Create product with image
var createProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                product = new product_model_1.default({
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    inStock: (_a = req.body.inStock) !== null && _a !== void 0 ? _a : true,
                    image: req.file
                        ? {
                            data: req.file.buffer,
                            contentType: req.file.mimetype,
                        }
                        : undefined,
                });
                return [4 /*yield*/, product.save()];
            case 1:
                _c.sent();
                res.status(201).json(__assign(__assign({}, product.toObject()), { 
                    // Ensure the image is returned in a format the frontend can use immediately
                    image: ((_b = product.image) === null || _b === void 0 ? void 0 : _b.data)
                        ? "data:".concat(product.image.contentType, ";base64,").concat(product.image.data.toString("base64"))
                        : null }));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                res.status(400).json({ error: "Failed to create product", details: error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
// Get all products
var getProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, formatted, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, product_model_1.default.find()];
            case 1:
                products = _a.sent();
                formatted = products.map(function (p) {
                    var _a;
                    return ({
                        _id: p._id,
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        inStock: p.inStock,
                        createdAt: p.createdAt,
                        updatedAt: p.updatedAt,
                        image: ((_a = p.image) === null || _a === void 0 ? void 0 : _a.data)
                            ? "data:".concat(p.image.contentType, ";base64,").concat(p.image.data.toString("base64"))
                            : null,
                    });
                });
                res.json(formatted);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ error: "Failed to fetch products", details: error_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProducts = getProducts;
// Get single product
var getProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, formatted, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, product_model_1.default.findById(req.params.id)];
            case 1:
                product = _b.sent();
                if (!product)
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                formatted = {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    inStock: product.inStock,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    image: ((_a = product.image) === null || _a === void 0 ? void 0 : _a.data)
                        ? "data:".concat(product.image.contentType, ";base64,").concat(product.image.data.toString("base64"))
                        : null,
                };
                res.json(formatted);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                res.status(500).json({ error: "Failed to fetch product", details: error_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProduct = getProduct;
// Update product (with optional new image)
var updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, product, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                updateData = {
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    inStock: req.body.inStock,
                };
                if (req.file) {
                    updateData.image = {
                        data: req.file.buffer,
                        contentType: req.file.mimetype,
                    };
                }
                return [4 /*yield*/, product_model_1.default.findByIdAndUpdate(req.params.id, updateData, {
                        new: true,
                    })];
            case 1:
                product = _b.sent();
                if (!product)
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                res.json(__assign(__assign({}, product.toObject()), { image: ((_a = product.image) === null || _a === void 0 ? void 0 : _a.data)
                        ? "data:".concat(product.image.contentType, ";base64,").concat(product.image.data.toString("base64"))
                        : null }));
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                res.status(400).json({ error: "Failed to update product", details: error_4 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = updateProduct;
// Delete product
var deleteProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, product_model_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                product = _a.sent();
                if (!product)
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                res.json({ message: "Product deleted successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ error: "Failed to delete product", details: error_5 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
