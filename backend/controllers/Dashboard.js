const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res) => {
	try {
		// Get total orders
		const totalOrders = await Order.countDocuments();

		// Get total users
		const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });

		// Get total revenue
		const revenueData = await Order.aggregate([
			{ $match: { paymentStatus: 'Completed' } },
			{ $group: { _id: null, totalRevenue: { $sum: '$total' } } }
		]);
		const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

		// Get total products
		const totalProducts = await Product.countDocuments();

		// Get recent orders
		const recentOrders = await Order.find()
			.populate('user', 'name email')
			.sort({ createdAt: -1 })
			.limit(5)
			.select('_id user total status createdAt');

		// Get order status distribution
		const orderStatusData = await Order.aggregate([
			{ $group: { _id: '$status', count: { $sum: 1 } } }
		]);

		// Get top selling products
		const topProducts = await Order.aggregate([
			{ $unwind: '$item' },
			{ $group: { _id: '$item.product', salesCount: { $sum: '$item.quantity' } } },
			{ $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
			{ $unwind: '$product' },
			{ $project: { name: '$product.title', salesCount: 1 } },
			{ $sort: { salesCount: -1 } },
			{ $limit: 5 }
		]);

		// Get monthly revenue for the last 6 months
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const monthlyRevenue = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: sixMonthsAgo },
					paymentStatus: 'Completed'
				}
			},
			{
				$group: {
					_id: {
						year: { $year: '$createdAt' },
						month: { $month: '$createdAt' }
					},
					revenue: { $sum: '$total' }
				}
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } }
		]);

		// Format monthly revenue data
		const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
			month: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
			revenue: item.revenue
		}));

		// Format recent orders
		const formattedRecentOrders = recentOrders.map(order => ({
			id: order._id,
			customer: order.user?.name || 'Unknown',
			amount: order.total,
			status: order.status,
			date: order.createdAt.toISOString().split('T')[0]
		}));

		// Format order status data
		const formattedOrderStatusData = orderStatusData.map(item => ({
			status: item._id,
			count: item.count
		}));

		res.status(200).json({
			totalOrders,
			totalUsers,
			totalRevenue,
			totalProducts,
			recentOrders: formattedRecentOrders,
			orderStatusData: formattedOrderStatusData,
			topProducts,
			monthlyRevenue: formattedMonthlyRevenue
		});

	} catch (error) {
		console.error('Dashboard stats error:', error);
		res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
	}
}; 