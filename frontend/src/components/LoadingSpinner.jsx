import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Loading..." }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '400px',
				gap: 3
			}}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<CircularProgress
					size={60}
					thickness={4}
					sx={{
						color: 'primary.main',
						'& .MuiCircularProgress-circle': {
							strokeLinecap: 'round',
						}
					}}
				/>
			</motion.div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<Typography
					variant="h6"
					sx={{
						color: 'text.secondary',
						fontWeight: 500,
						textAlign: 'center'
					}}
				>
					{message}
				</Typography>
			</motion.div>

			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.3, delay: 0.4 }}
			>
				<Box
					sx={{
						display: 'flex',
						gap: 0.5,
						mt: 2
					}}
				>
					{[0, 1, 2].map((index) => (
						<motion.div
							key={index}
							animate={{
								y: [0, -10, 0]
							}}
							transition={{
								duration: 1,
								repeat: Infinity,
								delay: index * 0.2
							}}
						>
							<Box
								sx={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									backgroundColor: 'primary.main',
									opacity: 0.7
								}}
							/>
						</motion.div>
					))}
				</Box>
			</motion.div>
		</Box>
	);
};

export default LoadingSpinner; 