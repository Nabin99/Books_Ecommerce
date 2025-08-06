const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
	return rateLimit({
		windowMs,
		max,
		message: {
			message,
			retryAfter: Math.ceil(windowMs / 1000)
		},
		standardHeaders: true,
		legacyHeaders: false,
		handler: (req, res) => {
			res.status(429).json({
				message,
				retryAfter: Math.ceil(windowMs / 1000)
			});
		}
	});
};

// Specific rate limiters
const authLimiter = createRateLimiter(
	15 * 60 * 1000, // 15 minutes
	5, // 5 attempts
	'Too many authentication attempts. Please try again later.'
);

const signupLimiter = createRateLimiter(
	60 * 60 * 1000, // 1 hour
	3, // 3 attempts
	'Too many signup attempts. Please try again later.'
);

const otpLimiter = createRateLimiter(
	15 * 60 * 1000, // 15 minutes
	3, // 3 attempts
	'Too many OTP requests. Please try again later.'
);

const passwordResetLimiter = createRateLimiter(
	60 * 60 * 1000, // 1 hour
	3, // 3 attempts
	'Too many password reset attempts. Please try again later.'
);

const generalLimiter = createRateLimiter(
	15 * 60 * 1000, // 15 minutes
	100, // 100 requests
	'Too many requests. Please try again later.'
);

module.exports = {
	authLimiter,
	signupLimiter,
	otpLimiter,
	passwordResetLimiter,
	generalLimiter
}; 