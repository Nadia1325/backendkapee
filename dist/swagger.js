"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "KAPEE Ecommerce API",
            version: "1.0.0",
            description: "Comprehensive API documentation for the KAPEE ecommerce platform. This API provides endpoints for managing products, users, orders, cart, contact messages, newsletter subscriptions, and authentication.",
            contact: {
                name: "KAPEE Support",
                email: "elisadushimtech@gmail.com"
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT"
            }
        },
        servers: [
            {
                url: process.env.SERVER_URL || "http://localhost:" + (process.env.PORT || 5000),
                description: "Development server"
            },
            {
                url: "https://your-render-app.onrender.com",
                description: "Production server on Render"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: Bearer <token>"
                },
            },
            schemas: {
                Product: {
                    type: "object",
                    required: ["name", "price", "description"],
                    properties: {
                        _id: {
                            type: "string",
                            description: "Product ID"
                        },
                        name: {
                            type: "string",
                            description: "Product name"
                        },
                        price: {
                            type: "number",
                            description: "Product price"
                        },
                        description: {
                            type: "string",
                            description: "Product description"
                        },
                        image: {
                            type: "string",
                            description: "Product image URL or base64"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                User: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        _id: {
                            type: "string",
                            description: "User ID"
                        },
                        name: {
                            type: "string",
                            description: "User's full name"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User's email address"
                        },
                        password: {
                            type: "string",
                            description: "User's password (hashed)"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Error message"
                        },
                        error: {
                            type: "string",
                            description: "Error details"
                        }
                    }
                }
            }
        },
        security: [],
        tags: [
            {
                name: "Products",
                description: "Product management operations"
            },
            {
                name: "Authentication",
                description: "User authentication and authorization"
            },
            {
                name: "Cart",
                description: "Shopping cart operations"
            },
            {
                name: "Orders",
                description: "Order management"
            },
            {
                name: "Contact",
                description: "Contact form messages"
            },
            {
                name: "Newsletter",
                description: "Newsletter subscription management"
            },
            {
                name: "OTP",
                description: "One-time password operations"
            }
        ]
    },
    apis: [
        path_1.default.join(__dirname, "./routes/*.ts"),
        path_1.default.join(__dirname, "./controllers/*.ts"),
        path_1.default.join(__dirname, "./models/*.ts"),
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
