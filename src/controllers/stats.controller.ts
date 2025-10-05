import { Response } from "express";
import Product from "../models/product.model";
import User from "../models/User";
import Order from "../models/Order";
import Cart from "../models/cart.model";
import { AuthRequest } from "../middleware/auth";

// Get dashboard statistics
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get counts
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalCarts,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Cart.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }), // Last 30 days
      Product.countDocuments({ stock: { $lt: 10 } })
    ]);

    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'shipped', 'delivered'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent activity
    const recentActivity = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('total status createdAt user');

    const stats = {
      overview: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalCarts,
        totalRevenue: totalRevenue || 0,
        recentOrders,
        lowStockProducts
      },
      charts: {
        // Monthly orders for the last 12 months
        monthlyOrders: await getMonthlyOrders(),
        // Top selling products
        topProducts: await getTopProducts(),
        // Order status distribution
        orderStatus: await getOrderStatusDistribution()
      },
      recentActivity
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

// Helper: Get monthly orders for chart
const getMonthlyOrders = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: '$total' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return result.map((item: any) => ({
    month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
    orders: item.count,
    revenue: item.revenue
  }));
};

// Helper: Get top selling products
const getTopProducts = async () => {
  const result = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);

  return result.map((item: any) => ({
    id: item._id,
    name: item.product.name,
    totalSold: item.totalSold,
    revenue: item.revenue
  }));
};

// Helper: Get order status distribution
const getOrderStatusDistribution = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return result.map((item: any) => ({
    status: item._id,
    count: item.count
  }));
};