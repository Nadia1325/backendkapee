import { Request, Response, NextFunction } from "express";

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  next();
};
