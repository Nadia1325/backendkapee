import mongoose, { Schema, Document } from "mongoose";

export interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
}

const CartSchema = new Schema<CartDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<CartDocument>("Cart", CartSchema);
