import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
	Box,
	Button,
	Typography,
	Alert,
	CircularProgress,
	Paper,
	Stack
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
	confirmPaymentAsync,
	selectPaymentLoading,
	selectPaymentError,
	clearPaymentError
} from '../PaymentSlice';

const CARD_ELEMENT_OPTIONS = {
	style: {
		base: {
			fontSize: '16px',
			color: '#424770',
			'::placeholder': {
				color: '#aab7c4',
			},
		},
		invalid: {
			color: '#9e2146',
		},
	},
};

const StripePayment = ({ clientSecret, orderId, onPaymentSuccess, onPaymentError }) => {
	const stripe = useStripe();
	const elements = useElements();
	const dispatch = useDispatch();

	const loading = useSelector(selectPaymentLoading);
	const error = useSelector(selectPaymentError);

	const [processing, setProcessing] = useState(false);
	const [localError, setLocalError] = useState(null);

	useEffect(() => {
		if (error) {
			setLocalError(error);
			dispatch(clearPaymentError());
		}
	}, [error, dispatch]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setProcessing(true);
		setLocalError(null);

		const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
			},
		});

		if (stripeError) {
			setLocalError(stripeError.message);
			setProcessing(false);
			if (onPaymentError) {
				onPaymentError(stripeError.message);
			}
		} else if (paymentIntent.status === 'succeeded') {
			// Confirm payment with our backend
			try {
				await dispatch(confirmPaymentAsync({
					paymentIntentId: paymentIntent.id,
					orderId: orderId
				})).unwrap();

				setProcessing(false);
				if (onPaymentSuccess) {
					onPaymentSuccess(paymentIntent);
				}
			} catch (confirmError) {
				setLocalError(confirmError.message || 'Payment confirmation failed');
				setProcessing(false);
				if (onPaymentError) {
					onPaymentError(confirmError.message || 'Payment confirmation failed');
				}
			}
		}
	};

	return (
		<Paper elevation={2} sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
			<Stack spacing={3}>
				<Typography variant="h6" component="h2">
					Payment Details
				</Typography>

				{localError && (
					<Alert severity="error" onClose={() => setLocalError(null)}>
						{localError}
					</Alert>
				)}

				<Box component="form" onSubmit={handleSubmit}>
					<Stack spacing={2}>
						<Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
							<CardElement options={CARD_ELEMENT_OPTIONS} />
						</Box>

						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={!stripe || processing || loading}
							sx={{ mt: 2 }}
						>
							{processing || loading ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								`Pay Now`
							)}
						</Button>
					</Stack>
				</Box>

				<Typography variant="body2" color="text.secondary" textAlign="center">
					Your payment information is secure and encrypted
				</Typography>
			</Stack>
		</Paper>
	);
};

export default StripePayment; 