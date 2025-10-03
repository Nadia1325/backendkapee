import { Request, Response } from "express";
import Subscriber from "../models/Subscriber";


export const subscribe = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const newSubscriber = await Subscriber.create({ email });
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
  }
};

export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
  }
};


export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    res.json({ success: true, message: "Subscriber deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
  }
};
