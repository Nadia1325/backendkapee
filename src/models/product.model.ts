import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  image?: {
    data: Buffer;
    contentType: string;
  };
  inStock: boolean;
  createdAt?: Date;  
  updatedAt?: Date;  
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: {
      data: Buffer,
      contentType: String,
    },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true } 
);

export default mongoose.model<IProduct>("Product", ProductSchema);
