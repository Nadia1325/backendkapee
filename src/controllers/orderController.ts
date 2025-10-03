import { Request, Response } from "express";
import Order, { IOrder } from "../models/Order";


const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: IOrder = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};


export const getOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};


export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};


export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};
