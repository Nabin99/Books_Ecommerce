const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, getPaymentStatus, refundPayment } = require('../controllers/Payment');
const { verifyToken } = require('../middleware/VerifyToken');

// Create payment intent
router.post('/create-payment-intent', verifyToken, createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', verifyToken, confirmPayment);

// Get payment status
router.get('/status/:orderId', verifyToken, getPaymentStatus);

// Refund payment
router.post('/refund/:orderId', verifyToken, refundPayment);

module.exports = router; 