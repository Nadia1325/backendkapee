"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var ContactRoutes_1 = __importDefault(require("./routes/ContactRoutes"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var db_1 = __importDefault(require("./config/db"));
var swagger_1 = require("./swagger");
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var product_routes_1 = __importDefault(require("./routes/product.routes"));
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
var cart_routes_1 = __importDefault(require("./routes/cart.routes"));
var subscribeRoutes_1 = __importDefault(require("./routes/subscribeRoutes"));
var OTPRoutes_1 = __importDefault(require("./routes/OTPRoutes"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger docs
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use("/api/products", product_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/contact", ContactRoutes_1.default);
app.use("/api/otp", OTPRoutes_1.default);
app.use("/api/auth", OTPRoutes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/subscribe", subscribeRoutes_1.default);
var PORT = process.env.PORT || 3000;
(0, db_1.default)();
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Server running on http://localhost:".concat(PORT));
});
