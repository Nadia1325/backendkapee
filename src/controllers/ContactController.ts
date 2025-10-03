import { Contact } from "../models/Contact";
import { Request, Response } from "express";
import mailerSender from "../utils/SendEmails";
import dotenv from "dotenv";
dotenv.config();
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ message: "Name, email, and message are required." });
      return;
    }
    // Save contact to DB
    const newContact = await Contact.create({ name, email, phone, message });
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await mailerSender(
        adminEmail,
        "New Contact Message",
        `
        <h1>New Contact Message</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>
        `
      );
    }
    await mailerSender(
      email,
      "Thank you for contacting us",
      `
      <h3>Hello ${name},</h3>
      <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
      <blockquote>Your Message: ${message}</blockquote>
      <p>Our team will get back to you as soon as possible.</p>
      </br>
      <p>Best regards,</p>
      <p><strong>Kapee Team</strong></p>
      `
    );
    res.status(201).json({
      message: "Contact message received successfully.",
      contact: newContact
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating contact message:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};