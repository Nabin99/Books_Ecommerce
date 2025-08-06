// Initialize Stripe only if API key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here') {
	stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

const Order = require('../models/Order');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
	try {
		// Check if Stripe is configured
		if (!stripe) {
			return res.status(503).json({
				message: 'Payment service is not configured. Please contact administrator.'
			});
		}

		const { amount, orderId } = req.body;

		if (!amount || amount <= 0) {
			return res.status(400).json({ message: 'Invalid amount' });
		}

		// Create payment intent with Stripe
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // Convert to cents
			currency: 'usd',
			metadata: {
				orderId: orderId
			}
		});

		res.status(200).json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id
		});
	} catch (error) {
		console.error('Payment intent creation error:', error);
		res.status(500).json({ message: 'Error creating payment intent' });
	}
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
	try {
		// Check if Stripe is configured
		if (!stripe) {
			return res.status(503).json({
				message: 'Payment service is not configured. Please contact administrator.'
			});
		}

		const { paymentIntentId, orderId } = req.body;

		// Retrieve payment intent from Stripe
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

		if (paymentIntent.status === 'succeeded') {
			// Update order with payment status
			const updatedOrder = await Order.findByIdAndUpdate(
				orderId,
				{
					paymentStatus: 'Completed',
					stripePaymentIntentId: paymentIntentId,
					status: 'Pending' // Order is now confirmed and ready for processing
				},
				{ new: true }
			);

			res.status(200).json({
				message: 'Payment confirmed successfully',
				order: updatedOrder
			});
		} else {
			// Update order with failed payment status
			await Order.findByIdAndUpdate(
				orderId,
				{
					paymentStatus: 'Failed',
					stripePaymentIntentId: paymentIntentId
				}
			);

			res.status(400).json({
				message: 'Payment failed',
				status: paymentIntent.status
			});
		}
	} catch (error) {
		console.error('Payment confirmation error:', error);
		res.status(500).json({ message: 'Error confirming payment' });
	}
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
	try {
		const { orderId } = req.params;

		const order = await Order.findById(orderId);

		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		res.status(200).json({
			paymentStatus: order.paymentStatus,
			stripePaymentIntentId: order.stripePaymentIntentId
		});
	} catch (error) {
		console.error('Get payment status error:', error);
		res.status(500).json({ message: 'Error fetching payment status' });
	}
};

// Refund payment
exports.refundPayment = async (req, res) => {
	try {
		// Check if Stripe is configured
		if (!stripe) {
			return res.status(503).json({
				message: 'Payment service is not configured. Please contact administrator.'
			});
		}

		const { paymentIntentId, amount } = req.body;

		// Create refund
		const refund = await stripe.refunds.create({
			payment_intent: paymentIntentId,
			amount: amount ? Math.round(amount * 100) : undefined // Partial refund if amount specified
		});

		res.status(200).json({
			message: 'Refund processed successfully',
			refundId: refund.id,
			status: refund.status
		});
	} catch (error) {
		console.error('Refund error:', error);
		res.status(500).json({ message: 'Error processing refund' });
	}
}; 