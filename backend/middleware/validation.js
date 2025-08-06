const { body, param, validationResult } = require('express-validator');

// Validation helper functions
const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const validatePassword = (password) => {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
	return passwordRegex.test(password);
};

const validateName = (name) => {
	return name && name.trim().length >= 2 && name.trim().length <= 50;
};

const validateOtp = (otp) => {
	return otp && /^\d{6}$/.test(otp);
};

const validateUserId = (userId) => {
	return userId && /^[0-9a-fA-F]{24}$/.test(userId);
};

// Validation chains
const signupValidation = [
	body('name')
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage('Name must be between 2 and 50 characters'),
	body('email')
		.isEmail()
		.normalizeEmail()
		.withMessage('Please provide a valid email address'),
	body('password')
		.isLength({ min: 8 })
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
];

const loginValidation = [
	body('email')
		.isEmail()
		.normalizeEmail()
		.withMessage('Please provide a valid email address'),
	body('password')
		.notEmpty()
		.withMessage('Password is required'),
];

const otpValidation = [
	body('userId')
		.isMongoId()
		.withMessage('Invalid user ID format'),
	body('otp')
		.isLength({ min: 6, max: 6 })
		.isNumeric()
		.withMessage('OTP must be a 6-digit number'),
];

const forgotPasswordValidation = [
	body('email')
		.isEmail()
		.normalizeEmail()
		.withMessage('Please provide a valid email address'),
];

const resetPasswordValidation = [
	body('userId')
		.isMongoId()
		.withMessage('Invalid user ID format'),
	body('token')
		.notEmpty()
		.withMessage('Token is required'),
	body('password')
		.isLength({ min: 8 })
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessages = errors.array().map(error => ({
			field: error.path,
			message: error.msg
		}));
		return res.status(400).json({
			message: 'Validation failed',
			errors: errorMessages
		});
	}
	next();
};

module.exports = {
	validateEmail,
	validatePassword,
	validateName,
	validateOtp,
	validateUserId,
	signupValidation,
	loginValidation,
	otpValidation,
	forgotPasswordValidation,
	resetPasswordValidation,
	handleValidationErrors
}; 