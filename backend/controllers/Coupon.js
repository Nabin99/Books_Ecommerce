const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// Create a new coupon (Admin only)
exports.create = async (req, res) => {
	try {
		const couponData = req.body;

		// Validate coupon data
		if (couponData.validFrom && couponData.validUntil) {
			if (new Date(couponData.validFrom) >= new Date(couponData.validUntil)) {
				return res.status(400).json({
					message: 'Valid until date must be after valid from date'
				});
			}
		}

		// Check if coupon code already exists
		const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
		if (existingCoupon) {
			return res.status(400).json({
				message: 'Coupon code already exists'
			});
		}

		const coupon = new Coupon(couponData);
		await coupon.save();

		res.status(201).json(coupon);
	} catch (error) {
		console.error('Coupon creation error:', error);
		res.status(500).json({
			message: 'Error creating coupon, please try again later'
		});
	}
};

// Get all coupons (Admin only)
exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit = 10, status } = req.query;
		const skip = (page - 1) * limit;

		let filter = {};
		if (status === 'active') {
			filter.isActive = true;
		} else if (status === 'inactive') {
			filter.isActive = false;
		}

		const [coupons, total] = await Promise.all([
			Coupon.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(parseInt(limit)),
			Coupon.countDocuments(filter)
		]);

		res.status(200).json({
			coupons,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				pages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		console.error('Coupon fetch error:', error);
		res.status(500).json({
			message: 'Error fetching coupons, please try again later'
		});
	}
};

// Get coupon by ID
exports.getById = async (req, res) => {
	try {
		const { id } = req.params;
		const coupon = await Coupon.findById(id);

		if (!coupon) {
			return res.status(404).json({ message: 'Coupon not found' });
		}

		res.status(200).json(coupon);
	} catch (error) {
		console.error('Coupon fetch error:', error);
		res.status(500).json({
			message: 'Error fetching coupon, please try again later'
		});
	}
};

// Update coupon (Admin only)
exports.updateById = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		// Validate dates if provided
		if (updateData.validFrom && updateData.validUntil) {
			if (new Date(updateData.validFrom) >= new Date(updateData.validUntil)) {
				return res.status(400).json({
					message: 'Valid until date must be after valid from date'
				});
			}
		}

		// Check if code already exists (if updating code)
		if (updateData.code) {
			const existingCoupon = await Coupon.findOne({
				code: updateData.code.toUpperCase(),
				_id: { $ne: id }
			});
			if (existingCoupon) {
				return res.status(400).json({
					message: 'Coupon code already exists'
				});
			}
		}

		const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });

		if (!coupon) {
			return res.status(404).json({ message: 'Coupon not found' });
		}

		res.status(200).json(coupon);
	} catch (error) {
		console.error('Coupon update error:', error);
		res.status(500).json({
			message: 'Error updating coupon, please try again later'
		});
	}
};

// Delete coupon (Admin only)
exports.deleteById = async (req, res) => {
	try {
		const { id } = req.params;
		const coupon = await Coupon.findByIdAndDelete(id);

		if (!coupon) {
			return res.status(404).json({ message: 'Coupon not found' });
		}

		res.status(200).json({ message: 'Coupon deleted successfully' });
	} catch (error) {
		console.error('Coupon delete error:', error);
		res.status(500).json({
			message: 'Error deleting coupon, please try again later'
		});
	}
};

// Validate and apply coupon
exports.validate = async (req, res) => {
	try {
		const { code, orderAmount, items = [] } = req.body;
		const userId = req.user._id;

		if (!code) {
			return res.status(400).json({ message: 'Coupon code is required' });
		}

		// Find the coupon
		const coupon = await Coupon.findValidByCode(code, userId);

		if (!coupon) {
			return res.status(404).json({
				message: 'Invalid or expired coupon code'
			});
		}

		// Check if user can use this coupon
		const userUsageCount = await getUserCouponUsageCount(userId, coupon._id);

		if (!coupon.canUserUse(userId, userUsageCount)) {
			return res.status(400).json({
				message: 'You cannot use this coupon'
			});
		}

		// Calculate discount
		const discount = coupon.calculateDiscount(orderAmount, items);

		// Check if discount is applicable
		if (discount <= 0) {
			return res.status(400).json({
				message: `Minimum order amount of $${coupon.minimumOrderAmount} required for this coupon`
			});
		}

		res.status(200).json({
			coupon: {
				_id: coupon._id,
				code: coupon.code,
				name: coupon.name,
				type: coupon.type,
				value: coupon.value,
				description: coupon.description
			},
			discount,
			finalAmount: orderAmount - discount
		});
	} catch (error) {
		console.error('Coupon validation error:', error);
		res.status(500).json({
			message: 'Error validating coupon, please try again later'
		});
	}
};

// Get available coupons for user
exports.getAvailable = async (req, res) => {
	try {
		const userId = req.user._id;
		const { orderAmount = 0 } = req.query;

		const now = new Date();

		const coupons = await Coupon.find({
			isActive: true,
			validFrom: { $lte: now },
			validUntil: { $gte: now },
			$or: [
				{ usageLimit: null },
				{ $expr: { $lt: ['$usedCount', '$usageLimit'] } }
			]
		}).sort({ value: -1 });

		// Filter coupons that user can use
		const availableCoupons = [];

		for (const coupon of coupons) {
			const userUsageCount = await getUserCouponUsageCount(userId, coupon._id);

			if (coupon.canUserUse(userId, userUsageCount) &&
				orderAmount >= coupon.minimumOrderAmount) {

				const discount = coupon.calculateDiscount(orderAmount);

				availableCoupons.push({
					...coupon.toObject(),
					userUsageCount,
					calculatedDiscount: discount
				});
			}
		}

		res.status(200).json(availableCoupons);
	} catch (error) {
		console.error('Available coupons error:', error);
		res.status(500).json({
			message: 'Error fetching available coupons, please try again later'
		});
	}
};

// Track coupon usage (called when order is placed)
exports.trackUsage = async (couponId, userId) => {
	try {
		const coupon = await Coupon.findById(couponId);
		if (!coupon) return false;

		// Increment usage count
		coupon.usedCount += 1;
		await coupon.save();

		// You might want to track individual user usage in a separate collection
		// For now, we'll just increment the global count

		return true;
	} catch (error) {
		console.error('Coupon usage tracking error:', error);
		return false;
	}
};

// Helper function to get user's usage count for a specific coupon
async function getUserCouponUsageCount(userId, couponId) {
	try {
		// This would typically query a separate collection tracking user coupon usage
		// For now, we'll return 0 (assuming user hasn't used this coupon)
		// In a real implementation, you'd have a UserCouponUsage model

		const usageCount = await Order.countDocuments({
			user: userId,
			'coupon.couponId': couponId,
			status: { $in: ['completed', 'processing'] }
		});

		return usageCount;
	} catch (error) {
		console.error('Error getting user coupon usage:', error);
		return 0;
	}
} 