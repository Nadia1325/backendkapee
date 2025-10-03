import { Schema, model, Document } from "mongoose";

export interface ICartItem {
  productId: string; // Corrected: Renamed 'id' to 'productId'
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IClientInfo {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
}

export interface IOrder extends Document {
  clientInfo: IClientInfo;
  cartItems: ICartItem[];
  paymentMethod: "credit_card" | "paypal" | "cash_on_delivery";
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    clientInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String, required: true },
    },
    cartItems: [
      {
        productId: { type: String, required: true }, // Corrected: Renamed 'id' to 'productId'
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "cash_on_delivery"],
      required: true,
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IOrder>("Order", orderSchema);