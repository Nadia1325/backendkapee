// router/otpRouter.ts
import { Router, Request, Response } from "express";
import { generateOTP } from "../utils/OTPGenerator";
import { sendOTP } from "../utils/SendEmails";

const router = Router();

/**
 * @swagger
 * /api/otp/send-otp:
 *   post:
 *     summary: Send OTP to email
 *     tags: [OTP]
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
 *                 description: Email address to send OTP to
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 otp:
 *                   type: string
 *                   description: Generated OTP (for demo purposes)
 *       400:
 *         description: Email is required
 *       500:
 *         description: Failed to send OTP or server error
 */
router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOTP(6);

    // Send email
    const sent = await sendOTP(email, otp);

    if (!sent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    // Store OTP temporarily (in memory for now, later in Redis/DB)
    // For demo: return OTP in response
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
