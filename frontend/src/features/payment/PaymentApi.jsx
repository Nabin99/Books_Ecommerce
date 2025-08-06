import { axiosi } from '../../config/axios';

export const createPaymentIntent = async (amount, orderId) => {
	try {
		const response = await axiosi.post('/payments/create-payment-intent', {
			amount,
			orderId
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: 'Error creating payment intent' };
	}
};

export const confirmPayment = async (paymentIntentId, orderId) => {
	try {
		const response = await axiosi.post('/payments/confirm-payment', {
			paymentIntentId,
			orderId
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: 'Error confirming payment' };
	}
};

export const getPaymentStatus = async (orderId) => {
	try {
		const response = await axiosi.get(`/payments/status/${orderId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: 'Error fetching payment status' };
	}
};

export const refundPayment = async (orderId) => {
	try {
		const response = await axiosi.post(`/payments/refund/${orderId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: 'Error processing refund' };
	}
}; 