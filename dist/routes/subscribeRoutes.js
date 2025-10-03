"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscribeController_1 = require("../controllers/subscribeController");
const validateEmail_1 = require("../middleware/validateEmail");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Subscriber:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Subscriber ID
 *         email:
 *           type: string
 *           format: email
 *           description: Subscriber's email address
 *         subscribedAt:
 *           type: string
 *           format: date-time
 *           description: When the user subscribed
 *       example:
 *         email: "subscriber@example.com"
 */
/**
 * @swagger
 * /api/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Successfully subscribed
 *       400:
 *         description: Invalid email or already subscribed
 */
router.post("/", validateEmail_1.validateEmail, subscribeController_1.subscribe);
/**
 * @swagger
 * /api/subscribe:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Newsletter]
 *     responses:
 *       200:
 *         description: List of all subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 */
router.get("/", subscribeController_1.getSubscribers);
/**
 * @swagger
 * /api/subscribe/{id}:
 *   delete:
 *     summary: Delete a subscriber
 *     tags: [Newsletter]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscriber deleted successfully
 *       404:
 *         description: Subscriber not found
 */
router.delete("/:id", subscribeController_1.deleteSubscriber);
exports.default = router;
