import { Router } from "express";
import { createContact } from "../controllers/ContactController";

const contactRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: Contact message ID
 *         name:
 *           type: string
 *           description: Sender's name
 *         email:
 *           type: string
 *           format: email
 *           description: Sender's email
 *         subject:
 *           type: string
 *           description: Message subject
 *         message:
 *           type: string
 *           description: Message content
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: "John Doe"
 *         email: "john@example.com"
 *         subject: "Product Inquiry"
 *         message: "I would like to know more about your products."
 */

/**
 * @swagger
 * /api/contact/create-contact:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
contactRouter.post("/create-contact", createContact);

// You can add more routes later, e.g., get all messages, delete, etc.
export default contactRouter;
