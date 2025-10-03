import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";

// Import routes
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/orderRoutes"; 
import cartRoutes from "./routes/cart.routes";
import subscribeRoutes from "./routes/subscribeRoutes";
import contactRouter from "./routes/ContactRoutes";
import otpRouter from "./routes/OTPRoutes";

const app: Application = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    message: "KAPEE Ecommerce API is running!", 
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Health check for monitoring services
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString() 
  });
});

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'KAPEE Ecommerce API Documentation'
}));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRouter);
app.use("/api/otp", otpRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/subscribe", subscribeRoutes);

// 404 handler for unmatched routes
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested route ${req.originalUrl} was not found on this server.`,
    availableEndpoints: [
      "/api/products",
      "/api/auth", 
      "/api/orders",
      "/api/contact",
      "/api/otp",
      "/api/cart",
      "/api/subscribe",
      "/api-docs"
    ]
  });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" 
      ? "Something went wrong!"
      : error.message
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
