import dotenv from "dotenv";
import contactRouter from "./routes/ContactRoutes";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";

import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/orderRoutes"; 
import cartRoutes from "./routes/cart.routes";
import subscribeRoutes from "./routes/subscribeRoutes";
import router from "./routes/OTPRoutes";
import statsRoutes from "./routes/stats.routes";
import homeImageRoutes from "./routes/homeImage.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRouter);
app.use("/api/otp", router);
app.use("/api/auth", router);

app.use("/api/cart", cartRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/home-images", homeImageRoutes);

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

connectDB();

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
