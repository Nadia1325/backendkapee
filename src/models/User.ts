import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  createdAt: Date;
  otp?: string;
  otpExpires?: Date;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  otp: { type: String }, // store OTP
  otpExpires: { type: Date }, // expiry for OTP
});

export default mongoose.model<IUser>("User", userSchema);
