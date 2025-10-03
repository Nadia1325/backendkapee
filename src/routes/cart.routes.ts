import { Router } from "express";
import { addToCart, getCart, updateCartItem, removeFromCart } from "../controllers/cart.controller";
import { auth } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       401:
 *         description: Unauthorized
 */

router.post("/add", auth, addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */

router.get("/", auth, getCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/update", auth, updateCartItem);

/**
 * @swagger
 * /api/cart/remove:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 */

router.delete("/remove", auth, removeFromCart);

export default router;
