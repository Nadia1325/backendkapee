import { Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import { AuthRequest } from "../middleware/auth";

// Helper: format cart for frontend
const formatCart = (cart: any) => {
  return {
    id: cart._id.toString(),
    user: cart.user.toString(),
    items: cart.items
      .filter((i: any) => i.productId)
      .map((i: any) => ({
        productId: i.productId._id.toString(),
        name: i.productId.name,
        price: i.productId.price,
        image: i.productId.image || "",
        quantity: i.quantity,
      })),
  };
};

// ==================== ADD TO CART ====================
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity = 1 } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: new mongoose.Types.ObjectId(userId),
        items: [{ productId: new mongoose.Types.ObjectId(productId), quantity: Number(quantity) }],
      });
    } else {
      cart.items = cart.items.filter((i) => i.productId);

      const existingItem = cart.items.find(
        (i) => i.productId && i.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity: Number(quantity),
        });
      }
    }

    const savedCart = await cart.save();
    await savedCart.populate("items.productId");
    return res.status(200).json(formatCart(savedCart));
  } catch (error: any) {
    console.error("Add to cart error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== UPDATE CART ITEM ====================
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId || !quantity || quantity < 1)
      return res.status(400).json({ message: "Invalid input" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId);

    const item = cart.items.find((i) => i.productId && i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = Number(quantity);

    const savedCart = await cart.save();
    await savedCart.populate("items.productId");
    return res.status(200).json(formatCart(savedCart));
  } catch (error: any) {
    console.error("Update cart error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== GET CART ====================
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cart = await Cart.findOne({ user: userId }).populate("items.productId");
    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter((i) => i.productId);
    return res.status(200).json(formatCart(cart));
  } catch (error: any) {
    console.error("Get cart error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== REMOVE ITEM ====================
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.productId && i.productId.toString() !== productId
    );

    const savedCart = await cart.save();
    await savedCart.populate("items.productId");
    return res.status(200).json(formatCart(savedCart));
  } catch (error: any) {
    console.error("Remove from cart error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
