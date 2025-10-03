"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
// Create product with image
const createProduct = async (req, res) => {
    try {
        const product = new product_model_1.default({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            inStock: req.body.inStock ?? true,
            image: req.file
                ? {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                }
                : undefined,
        });
        await product.save();
        res.status(201).json({
            ...product.toObject(),
            // Ensure the image is returned in a format the frontend can use immediately
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : null,
        });
    }
    catch (error) {
        res.status(400).json({ error: "Failed to create product", details: error });
    }
};
exports.createProduct = createProduct;
// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await product_model_1.default.find();
        const formatted = products.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            description: p.description,
            inStock: p.inStock,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            image: p.image?.data
                ? `data:${p.image.contentType};base64,${p.image.data.toString("base64")}`
                : null,
        }));
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch products", details: error });
    }
};
exports.getProducts = getProducts;
// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await product_model_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        const formatted = {
            _id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            inStock: product.inStock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : null,
        };
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch product", details: error });
    }
};
exports.getProduct = getProduct;
// Update product (with optional new image)
const updateProduct = async (req, res) => {
    try {
        const updateData = {
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
        const product = await product_model_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({
            ...product.toObject(),
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : null,
        });
    }
    catch (error) {
        res.status(400).json({ error: "Failed to update product", details: error });
    }
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await product_model_1.default.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete product", details: error });
    }
};
exports.deleteProduct = deleteProduct;
