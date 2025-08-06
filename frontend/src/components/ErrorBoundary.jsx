import React from 'react';
import { Box, Typography, Button, Container, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		});

		// Log error to console in development
		if (process.env.NODE_ENV === 'development') {
			console.error('Error caught by boundary:', error, errorInfo);
		}
	}

	handleRefresh = () => {
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<Container maxWidth="md">
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							minHeight: '100vh',
							py: 4
						}}
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<Paper
								elevation={0}
								sx={{
									p: 6,
									borderRadius: 4,
									background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
									border: '1px solid rgba(0, 0, 0, 0.08)',
									textAlign: 'center',
									maxWidth: 500
								}}
							>
								<motion.div
									initial={{ y: -20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.5, delay: 0.2 }}
								>
									<ErrorOutlineIcon
										sx={{
											fontSize: 80,
											color: 'error.main',
											mb: 3
										}}
									/>
								</motion.div>

								<motion.div
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.5, delay: 0.4 }}
								>
									<Typography
										variant="h4"
										sx={{
											fontWeight: 700,
											mb: 2,
											color: 'text.primary'
										}}
									>
										Oops! Something went wrong
									</Typography>

									<Typography
										variant="body1"
										sx={{
											color: 'text.secondary',
											mb: 4,
											lineHeight: 1.6
										}}
									>
										We're sorry, but something unexpected happened.
										Please try refreshing the page or contact support if the problem persists.
									</Typography>

									<Stack direction="row" spacing={2} justifyContent="center">
										<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
											<Button
												variant="contained"
												startIcon={<RefreshIcon />}
												onClick={this.handleRefresh}
												sx={{
													borderRadius: 2,
													px: 4,
													py: 1.5,
													textTransform: 'none',
													fontWeight: 600
												}}
											>
												Refresh Page
											</Button>
										</motion.div>

										<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
											<Button
												variant="outlined"
												onClick={() => window.history.back()}
												sx={{
													borderRadius: 2,
													px: 4,
													py: 1.5,
													textTransform: 'none',
													fontWeight: 600
												}}
											>
												Go Back
											</Button>
										</motion.div>
									</Stack>

									{process.env.NODE_ENV === 'development' && this.state.error && (
										<Box
											sx={{
												mt: 4,
												p: 2,
												backgroundColor: 'rgba(0, 0, 0, 0.05)',
												borderRadius: 2,
												textAlign: 'left'
											}}
										>
											<Typography
												variant="caption"
												sx={{
													color: 'text.secondary',
													fontFamily: 'monospace',
													fontSize: '0.75rem'
												}}
											>
												Error: {this.state.error.toString()}
											</Typography>
										</Box>
									)}
								</motion.div>
							</Paper>
						</motion.div>
					</Box>
				</Container>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary; 