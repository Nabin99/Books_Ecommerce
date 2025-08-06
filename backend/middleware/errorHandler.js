const errorHandler = (err, req, res, next) => {
	console.error('Error:', err);

	// MongoDB duplicate key error
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		return res.status(409).json({
			message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
			field: field
		});
	}

	// MongoDB validation error
	if (err.name === 'ValidationError') {
		const errors = Object.values(err.errors).map(error => ({
			field: error.path,
			message: error.message
		}));
		return res.status(400).json({
			message: 'Validation failed',
			errors: errors
		});
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			message: 'Invalid token'
		});
	}

	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			message: 'Token expired'
		});
	}

	// Cast error (invalid ObjectId)
	if (err.name === 'CastError') {
		return res.status(400).json({
			message: 'Invalid ID format'
		});
	}

	// Default error
	res.status(err.status || 500).json({
		message: err.message || 'Internal server error'
	});
};

// Async error wrapper
const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

// Custom error class
class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = {
	errorHandler,
	asyncHandler,
	AppError
}; 