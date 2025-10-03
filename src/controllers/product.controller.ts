import { Response } from "express";
import Product from "../models/product.model";
import { Request } from "express";
import { IProduct } from "../models/product.model";
// Extend Request type for multer
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Create product with image
export const createProduct = async (req: MulterRequest, res: Response) => {
  try {
    const product = new Product({
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
        ? `data:${product.image.contentType};base64,${product.image.data.toString(
            "base64"
          )}`
        : null,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to create product", details: error });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products", details: error });
  }
};

// Get single product
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product", details: error });
  }
};

// Update product (with optional new image)
export const updateProduct = async (req: MulterRequest, res: Response) => {
  try {
    const updateData: Partial<IProduct> = {
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

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      ...product.toObject(),
      image: product.image?.data
        ? `data:${product.image.contentType};base64,${product.image.data.toString(
            "base64"
          )}`
        : null,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to update product", details: error });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product", details: error });
  }
};