"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var path_1 = __importDefault(require("path"));
var options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "KAPEE Ecommerce API",
            version: "1.0.0",
            description: "API documentation for the KAPEE ecommerce backend",
        },
        servers: [
            {
                url: process.env.SERVER_URL || "http://localhost:" + (process.env.PORT || 5000),
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        path_1.default.join(__dirname, "./routes/*.ts"),
        path_1.default.join(__dirname, "./controllers/*.ts"),
        path_1.default.join(__dirname, "./models/*.ts"),
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
