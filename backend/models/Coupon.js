const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		uppercase: true,
		trim: true
	},
	name: {
		type: String,
		required: true,
		maxlength: 100
	},
	description: {
		type: String,
		maxlength: 500
	},
	type: {
		type: String,
		enum: ['percentage', 'fixed', 'free_shipping'],
		required: true
	},
	value: {
		type: Number,
		required: true,
		min: 0
	},
	minimumOrderAmount: {
		type: Number,
		default: 0
	},
	maximumDiscount: {
		type: Number,
		default: null
	},
	validFrom: {
		type: Date,
		required: true
	},
	validUntil: {
		type: Date,
		required: true
	},
	usageLimit: {
		type: Number,
		default: null // null means unlimited
	},
	usedCount: {
		type: Number,
		default: 0
	},
	perUserLimit: {
		type: Number,
		default: 1
	},
	applicableCategories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}],
	applicableProducts: [{
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}],
	excludedProducts: [{
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}],
	applicableUsers: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	isActive: {
		type: Boolean,
		default: true
	},
	isFirstTimeUser: {
		type: Boolean,
		default: false
	},
	isNewUser: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
}, {
	timestamps: true,
	versionKey: false
});

// Indexes for better performance
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ usageLimit: 1, usedCount: 1 });

// Pre-save middleware to update updatedAt
couponSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

// Instance method to check if coupon is valid
couponSchema.methods.isValid = function () {
	const now = new Date();
	return (
		this.isActive &&
		now >= this.validFrom &&
		now <= this.validUntil &&
		(this.usageLimit === null || this.usedCount < this.usageLimit)
	);
};

// Instance method to check if user can use this coupon
couponSchema.methods.canUserUse = function (userId, userUsageCount = 0) {
	if (!this.isValid()) return false;

	// Check per user limit
	if (userUsageCount >= this.perUserLimit) return false;

	// Check if user is in applicable users list (if specified)
	if (this.applicableUsers.length > 0 && !this.applicableUsers.includes(userId)) {
		return false;
	}

	return true;
};

// Instance method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount, items = []) {
	if (!this.isValid()) return 0;

	let applicableAmount = orderAmount;

	// Check minimum order amount
	if (orderAmount < this.minimumOrderAmount) return 0;

	// Calculate discount based on type
	let discount = 0;

	switch (this.type) {
		case 'percentage':
			discount = (orderAmount * this.value) / 100;
			if (this.maximumDiscount) {
				discount = Math.min(discount, this.maximumDiscount);
			}
			break;
		case 'fixed':
			discount = this.value;
			break;
		case 'free_shipping':
			// This would be handled separately in shipping calculation
			discount = 0;
			break;
	}

	return Math.min(discount, orderAmount); // Can't discount more than order amount
};

// Static method to find valid coupon by code
couponSchema.statics.findValidByCode = function (code, userId = null) {
	const now = new Date();

	return this.findOne({
		code: code.toUpperCase(),
		isActive: true,
		validFrom: { $lte: now },
		validUntil: { $gte: now },
		$or: [
			{ usageLimit: null },
			{ $expr: { $lt: ['$usedCount', '$usageLimit'] } }
		]
	});
};

module.exports = mongoose.model('Coupon', couponSchema); 