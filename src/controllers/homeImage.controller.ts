import { Request, Response } from "express";
import multer from "multer";
import HomeImage from "../models/homeImage.model";
import { AuthRequest } from "../middleware/auth";

// Configure multer for image uploads
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  }
});

// Get all home images
export const getHomeImages = async (req: Request, res: Response) => {
  try {
    const images = await HomeImage.find().sort({ order: 1, createdAt: -1 });
    
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
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch home images", error: error.message });
  }
};

// Get active home images (for frontend)
export const getActiveHomeImages = async (req: Request, res: Response) => {
  try {
    const images = await HomeImage.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    const formattedImages = images.map(img => ({
      id: img._id,
      title: img.title,
      description: img.description,
      image: `data:${img.image.contentType};base64,${img.image.data.toString('base64')}`
    }));
    
    res.json(formattedImages);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch active home images", error: error.message });
  }
};

// Upload new home image
export const uploadHomeImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const { title, description, order = 0 } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const homeImage = new HomeImage({
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
  } catch (error: any) {
    res.status(500).json({ message: "Failed to upload image", error: error.message });
  }
};

// Update home image
export const updateHomeImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, isActive, order } = req.body;

    const homeImage = await HomeImage.findById(id);
    if (!homeImage) {
      return res.status(404).json({ message: "Home image not found" });
    }

    // Update fields
    if (title !== undefined) homeImage.title = title;
    if (description !== undefined) homeImage.description = description;
    if (isActive !== undefined) homeImage.isActive = isActive;
    if (order !== undefined) homeImage.order = parseInt(order);

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
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update image", error: error.message });
  }
};

// Delete home image
export const deleteHomeImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const homeImage = await HomeImage.findByIdAndDelete(id);
    if (!homeImage) {
      return res.status(404).json({ message: "Home image not found" });
    }

    res.json({ message: "Home image deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
};