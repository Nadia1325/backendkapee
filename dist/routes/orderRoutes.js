"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const validateOrder_1 = require("../middleware/validateOrder");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: Product ID
 *         title:
 *           type: string
 *           description: Product title
 *         price:
 *           type: number
 *           description: Price of the product
 *         quantity:
 *           type: integer
 *           description: Quantity ordered
 *         image:
 *           type: string
 *           description: Product image URL
 *       example:
 *         id: "12345"
 *         title: "Wireless Headphones"
 *         price: 99.99
 *         quantity: 2
 *         image: "https://example.com/image.jpg"
 *
 *     ClientInfo:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - address
 *       properties:
 *         fullName:
 *           type: string
 *           description: Full name of the client
 *         email:
 *           type: string
 *           description: Client email
 *         phone:
 *           type: string
 *           description: Client phone number
 *         address:
 *           type: string
 *           description: Client shipping address
 *       example:
 *         fullName: "John Doe"
 *         email: "johndoe@example.com"
 *         phone: "+1234567890"
 *         address: "123 Main St, City, Country"
 *
 *     Order:
 *       type: object
 *       required:
 *         - clientInfo
 *         - cartItems
 *         - paymentMethod
 *         - totalAmount
 *       properties:
 *         id:
 *           type: string
 *           description: Order ID
 *         clientInfo:
 *           $ref: '#/components/schemas/ClientInfo'
 *         cartItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, paypal, cash_on_delivery]
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, delivered]
 *           default: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "650f9b43e8f1a12c34d56789"
 *         clientInfo:
 *           fullName: "Jane Smith"
 *           email: "jane@example.com"
 *           phone: "+19876543210"
 *           address: "456 Another St, City, Country"
 *         cartItems:
 *           - id: "prod123"
 *             title: "Smartphone"
 *             price: 499.99
 *             quantity: 1
 *             image: "https://example.com/phone.jpg"
 *         paymentMethod: "paypal"
 *         totalAmount: 499.99
 *         status: "pending"
 *         createdAt: "2025-10-03T10:00:00Z"
 *         updatedAt: "2025-10-03T10:00:00Z"
 */
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order payload
 */
router.post("/", validateOrder_1.validateOrder, orderController_1.createOrder);
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", orderController_1.getOrders);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get("/:id", orderController_1.getOrderById);
/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.put("/:id", orderController_1.updateOrder);
/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete("/:id", orderController_1.deleteOrder);
exports.default = router;
