import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Alert,
	CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentStatusAsync, refundPaymentAsync, selectPaymentLoading, selectPaymentError } from '../PaymentSlice';

const PaymentManagement = ({ order }) => {
	const dispatch = useDispatch();
	const loading = useSelector(selectPaymentLoading);
	const error = useSelector(selectPaymentError);

	const [showRefundDialog, setShowRefundDialog] = useState(false);
	const [paymentStatus, setPaymentStatus] = useState(null);

	useEffect(() => {
		if (order?._id) {
			loadPaymentStatus();
		}
	}, [order]);

	const loadPaymentStatus = async () => {
		try {
			const result = await dispatch(getPaymentStatusAsync(order._id)).unwrap();
			setPaymentStatus(result.paymentStatus);
		} catch (error) {
			console.error('Failed to load payment status:', error);
		}
	};

	const handleRefund = async () => {
		try {
			await dispatch(refundPaymentAsync(order._id)).unwrap();
			setShowRefundDialog(false);
			loadPaymentStatus(); // Reload status
		} catch (error) {
			console.error('Failed to process refund:', error);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'Completed':
				return 'success';
			case 'Pending':
				return 'warning';
			case 'Failed':
				return 'error';
			case 'Refunded':
				return 'info';
			default:
				return 'default';
		}
	};

	const canRefund = paymentStatus === 'Completed' && order?.stripePaymentIntentId;

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Payment Information
			</Typography>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Paper sx={{ p: 2, mb: 2 }}>
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Payment Method</TableCell>
								<TableCell>Payment Status</TableCell>
								<TableCell>Order Status</TableCell>
								<TableCell>Total Amount</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>{order?.paymentMode}</TableCell>
								<TableCell>
									<Chip
										label={paymentStatus || 'Loading...'}
										color={getStatusColor(paymentStatus)}
										size="small"
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={order?.status}
										color={order?.status === 'Pending' ? 'warning' : 'success'}
										size="small"
									/>
								</TableCell>
								<TableCell>${order?.total?.toFixed(2)}</TableCell>
								<TableCell>
									{canRefund && (
										<Button
											variant="outlined"
											color="error"
											size="small"
											onClick={() => setShowRefundDialog(true)}
											disabled={loading}
										>
											{loading ? <CircularProgress size={16} /> : 'Refund'}
										</Button>
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{/* Refund Confirmation Dialog */}
			<Dialog open={showRefundDialog} onClose={() => setShowRefundDialog(false)}>
				<DialogTitle>Confirm Refund</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to refund this payment? This action cannot be undone.
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						Order ID: {order?._id}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Amount: ${order?.total?.toFixed(2)}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowRefundDialog(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleRefund}
						color="error"
						variant="contained"
						disabled={loading}
					>
						{loading ? <CircularProgress size={16} /> : 'Confirm Refund'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default PaymentManagement; 