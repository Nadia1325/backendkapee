"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const User_1 = __importDefault(require("../models/User"));
const Order_1 = __importDefault(require("../models/Order"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get counts
        const [totalProducts, totalUsers, totalOrders, totalCarts, recentOrders, lowStockProducts] = await Promise.all([
            product_model_1.default.countDocuments(),
            User_1.default.countDocuments(),
            Order_1.default.countDocuments(),
            cart_model_1.default.countDocuments(),
            Order_1.default.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }), // Last 30 days
            product_model_1.default.countDocuments({ stock: { $lt: 10 } })
        ]);
        // Get total revenue
        const revenueResult = await Order_1.default.aggregate([
            { $match: { status: { $in: ['completed', 'shipped', 'delivered'] } } },
            { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        // Get recent activity
        const recentActivity = await Order_1.default.find()
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
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
// Helper: Get monthly orders for chart
const getMonthlyOrders = async () => {
    const result = await Order_1.default.aggregate([
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
    return result.map((item) => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        orders: item.count,
        revenue: item.revenue
    }));
};
// Helper: Get top selling products
const getTopProducts = async () => {
    const result = await Order_1.default.aggregate([
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
    return result.map((item) => ({
        id: item._id,
        name: item.product.name,
        totalSold: item.totalSold,
        revenue: item.revenue
    }));
};
// Helper: Get order status distribution
const getOrderStatusDistribution = async () => {
    const result = await Order_1.default.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    return result.map((item) => ({
        status: item._id,
        count: item.count
    }));
};
