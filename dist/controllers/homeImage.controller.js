"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomeImage = exports.updateHomeImage = exports.uploadHomeImage = exports.getActiveHomeImages = exports.getHomeImages = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const homeImage_model_1 = __importDefault(require("../models/homeImage.model"));
// Configure multer for image uploads
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});
// Get all home images
const getHomeImages = async (req, res) => {
    try {
        const images = await homeImage_model_1.default.find().sort({ order: 1, createdAt: -1 });
        const formattedImages = images.map(img => ({
            id: img._id,
            title: img.title,
            description: img.description,
            image: `data:${img.image.contentType};base64,${img.image.data.toString('base64')}`,
            isActive: img.isActive,
            order: img.order,
            createdAt: img.createdAt,
            updatedAt: img.updatedAt
        }));
        res.json(formattedImages);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch home images", error: error.message });
    }
};
exports.getHomeImages = getHomeImages;
// Get active home images (for frontend)
const getActiveHomeImages = async (req, res) => {
    try {
        const images = await homeImage_model_1.default.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        const formattedImages = images.map(img => ({
            id: img._id,
            title: img.title,
            description: img.description,
            image: `data:${img.image.contentType};base64,${img.image.data.toString('base64')}`
        }));
        res.json(formattedImages);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch active home images", error: error.message });
    }
};
exports.getActiveHomeImages = getActiveHomeImages;
// Upload new home image
const uploadHomeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }
        const { title, description, order = 0 } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }
        const homeImage = new homeImage_model_1.default({
            title,
            description,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            order: parseInt(order)
        });
        await homeImage.save();
        const formattedImage = {
            id: homeImage._id,
            title: homeImage.title,
            description: homeImage.description,
            image: `data:${homeImage.image.contentType};base64,${homeImage.image.data.toString('base64')}`,
            isActive: homeImage.isActive,
            order: homeImage.order,
            createdAt: homeImage.createdAt,
            updatedAt: homeImage.updatedAt
        };
        res.status(201).json(formattedImage);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to upload image", error: error.message });
    }
};
exports.uploadHomeImage = uploadHomeImage;
// Update home image
const updateHomeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, isActive, order } = req.body;
        const homeImage = await homeImage_model_1.default.findById(id);
        if (!homeImage) {
            return res.status(404).json({ message: "Home image not found" });
        }
        // Update fields
        if (title !== undefined)
            homeImage.title = title;
        if (description !== undefined)
            homeImage.description = description;
        if (isActive !== undefined)
            homeImage.isActive = isActive;
        if (order !== undefined)
            homeImage.order = parseInt(order);
        // Update image if new file provided
        if (req.file) {
            homeImage.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
        await homeImage.save();
        const formattedImage = {
            id: homeImage._id,
            title: homeImage.title,
            description: homeImage.description,
            image: `data:${homeImage.image.contentType};base64,${homeImage.image.data.toString('base64')}`,
            isActive: homeImage.isActive,
            order: homeImage.order,
            createdAt: homeImage.createdAt,
            updatedAt: homeImage.updatedAt
        };
        res.json(formattedImage);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update image", error: error.message });
    }
};
exports.updateHomeImage = updateHomeImage;
// Delete home image
const deleteHomeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const homeImage = await homeImage_model_1.default.findByIdAndDelete(id);
        if (!homeImage) {
            return res.status(404).json({ message: "Home image not found" });
        }
        res.json({ message: "Home image deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete image", error: error.message });
    }
};
exports.deleteHomeImage = deleteHomeImage;
