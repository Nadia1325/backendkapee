"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.getCart = exports.updateCartItem = exports.addToCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Helper: format cart for frontend
const formatCart = (cart) => {
    return {
        id: cart._id.toString(),
        user: cart.user.toString(),
        items: cart.items
            .filter((i) => i.productId)
            .map((i) => {
            // Handle image - convert to consistent format
            let imageUrl = "";
            if (i.productId.image) {
                if (i.productId.image.data && Buffer.isBuffer(i.productId.image.data)) {
                    // Product has image object with Buffer data
                    imageUrl = `data:${i.productId.image.contentType || 'image/jpeg'};base64,${i.productId.image.data.toString('base64')}`;
                }
                else if (typeof i.productId.image === 'string') {
                    // Already a string (URL or base64)
                    imageUrl = i.productId.image;
                }
                else if (typeof i.productId.image === 'object' && i.productId.image !== null) {
                    // Handle object type images (like the Smart Phone)
                    if (i.productId.image.data) {
                        imageUrl = `data:${i.productId.image.contentType || 'image/jpeg'};base64,${i.productId.image.data.toString('base64')}`;
                    }
                    else {
                        // If it's an object but no data, try to extract any base64 or URL
                        const imageObj = i.productId.image;
                        if (imageObj.url)
                            imageUrl = imageObj.url;
                        else if (imageObj.base64)
                            imageUrl = imageObj.base64;
                    }
                }
            }
            return {
                productId: i.productId._id.toString(),
                name: i.productId.name,
                price: i.productId.price,
                image: imageUrl,
                quantity: i.quantity,
            };
        }),
    };
};
// ==================== ADD TO CART ====================
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId, quantity = 1 } = req.body;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!productId)
            return res.status(400).json({ message: "Product ID is required" });
        const product = await product_model_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        let cart = await cart_model_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new cart_model_1.default({
                user: new mongoose_1.default.Types.ObjectId(userId),
                items: [{ productId: new mongoose_1.default.Types.ObjectId(productId), quantity: Number(quantity) }],
            });
        }
        else {
            cart.items = cart.items.filter((i) => i.productId);
            const existingItem = cart.items.find((i) => i.productId && i.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += Number(quantity);
            }
            else {
                cart.items.push({
                    productId: new mongoose_1.default.Types.ObjectId(productId),
                    quantity: Number(quantity),
                });
            }
        }
        const savedCart = await cart.save();
        await savedCart.populate("items.productId");
        const formattedCart = formatCart(savedCart);
        return res.status(200).json(formattedCart);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.addToCart = addToCart;
// ==================== UPDATE CART ITEM ====================
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId, quantity } = req.body;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!productId || !quantity || quantity < 1)
            return res.status(400).json({ message: "Invalid input" });
        const cart = await cart_model_1.default.findOne({ user: userId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter((i) => i.productId);
        const item = cart.items.find((i) => i.productId && i.productId.toString() === productId);
        if (!item)
            return res.status(404).json({ message: "Product not in cart" });
        item.quantity = Number(quantity);
        const savedCart = await cart.save();
        await savedCart.populate("items.productId");
        return res.status(200).json(formatCart(savedCart));
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.updateCartItem = updateCartItem;
// ==================== GET CART ====================
const getCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const cart = await cart_model_1.default.findOne({ user: userId }).populate("items.productId");
        if (!cart)
            return res.json({ items: [] });
        cart.items = cart.items.filter((i) => i.productId);
        return res.status(200).json(formatCart(cart));
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getCart = getCart;
// ==================== REMOVE ITEM ====================
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.body;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!productId)
            return res.status(400).json({ message: "Product ID required" });
        const cart = await cart_model_1.default.findOne({ user: userId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter((i) => i.productId && i.productId.toString() !== productId);
        const savedCart = await cart.save();
        await savedCart.populate("items.productId");
        return res.status(200).json(formatCart(savedCart));
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.removeFromCart = removeFromCart;
