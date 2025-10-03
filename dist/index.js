"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables first
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = require("./swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Import routes
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const subscribeRoutes_1 = __importDefault(require("./routes/subscribeRoutes"));
const ContactRoutes_1 = __importDefault(require("./routes/ContactRoutes"));
const OTPRoutes_1 = __importDefault(require("./routes/OTPRoutes"));
const app = (0, express_1.default)();
// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "KAPEE Ecommerce API is running!",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});
// Health check for monitoring services
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});
// Swagger documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'KAPEE Ecommerce API Documentation'
}));
// API Routes
app.use("/api/products", product_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/contact", ContactRoutes_1.default);
app.use("/api/otp", OTPRoutes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/subscribe", subscribeRoutes_1.default);
// 404 handler for unmatched routes
app.use("*", (req, res) => {
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
app.use((error, req, res, next) => {
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
        await (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
