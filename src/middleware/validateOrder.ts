import { Request, Response, NextFunction } from "express";

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { clientInfo, cartItems, paymentMethod, totalAmount } = req.body;

  if (!clientInfo?.fullName || !clientInfo?.email || !clientInfo?.address) {
    return res.status(400).json({ error: "Client info is incomplete" });
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Cart cannot be empty" });
  }

  if (!paymentMethod) {
    return res.status(400).json({ error: "Payment method is required" });
  }

  if (!totalAmount || totalAmount <= 0) {
    return res.status(400).json({ error: "Invalid total amount" });
  }

  next();
};
