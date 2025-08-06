import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createPaymentIntent, confirmPayment, getPaymentStatus, refundPayment } from './PaymentApi';

// Async thunks
export const createPaymentIntentAsync = createAsyncThunk(
	'payment/createPaymentIntent',
	async ({ amount, orderId }, { rejectWithValue }) => {
		try {
			const response = await createPaymentIntent(amount, orderId);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const confirmPaymentAsync = createAsyncThunk(
	'payment/confirmPayment',
	async ({ paymentIntentId, orderId }, { rejectWithValue }) => {
		try {
			const response = await confirmPayment(paymentIntentId, orderId);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const getPaymentStatusAsync = createAsyncThunk(
	'payment/getPaymentStatus',
	async (orderId, { rejectWithValue }) => {
		try {
			const response = await getPaymentStatus(orderId);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const refundPaymentAsync = createAsyncThunk(
	'payment/refundPayment',
	async (orderId, { rejectWithValue }) => {
		try {
			const response = await refundPayment(orderId);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

const initialState = {
	clientSecret: null,
	paymentIntentId: null,
	paymentStatus: null,
	loading: false,
	error: null,
	currentOrder: null
};

const paymentSlice = createSlice({
	name: 'payment',
	initialState,
	reducers: {
		clearPaymentState: (state) => {
			state.clientSecret = null;
			state.paymentIntentId = null;
			state.paymentStatus = null;
			state.error = null;
			state.currentOrder = null;
		},
		setPaymentError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
		clearPaymentError: (state) => {
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			// Create Payment Intent
			.addCase(createPaymentIntentAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createPaymentIntentAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.clientSecret = action.payload.clientSecret;
				state.paymentIntentId = action.payload.paymentIntentId;
			})
			.addCase(createPaymentIntentAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to create payment intent';
			})
			// Confirm Payment
			.addCase(confirmPaymentAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(confirmPaymentAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.paymentStatus = 'Completed';
				state.currentOrder = action.payload.order;
			})
			.addCase(confirmPaymentAsync.rejected, (state, action) => {
				state.loading = false;
				state.paymentStatus = 'Failed';
				state.error = action.payload?.message || 'Payment failed';
			})
			// Get Payment Status
			.addCase(getPaymentStatusAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getPaymentStatusAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.paymentStatus = action.payload.paymentStatus;
			})
			.addCase(getPaymentStatusAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to get payment status';
			})
			// Refund Payment
			.addCase(refundPaymentAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(refundPaymentAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.paymentStatus = 'Refunded';
				state.currentOrder = action.payload.order;
			})
			.addCase(refundPaymentAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to process refund';
			});
	}
});

export const { clearPaymentState, setPaymentError, clearPaymentError } = paymentSlice.actions;

// Selectors
export const selectPaymentState = (state) => state.payment;
export const selectClientSecret = (state) => state.payment.clientSecret;
export const selectPaymentIntentId = (state) => state.payment.paymentIntentId;
export const selectPaymentStatus = (state) => state.payment.paymentStatus;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectCurrentPaymentOrder = (state) => state.payment.currentOrder;

export default paymentSlice.reducer; 