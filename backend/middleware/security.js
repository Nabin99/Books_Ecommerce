const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');

// CORS configuration
const corsOptions = {
	origin: function (origin, callback) {
		const allowedOrigins = [
			process.env.FRONTEND_URL || 'http://localhost:3000',
			process.env.ORIGIN || 'http://localhost:3000'
		];

		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	optionsSuccessStatus: 200
};

// Helmet configuration for security headers
const helmetConfig = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "https:"],
			connectSrc: ["'self'"],
			fontSrc: ["'self'"],
			objectSrc: ["'none'"],
			mediaSrc: ["'self'"],
			frameSrc: ["'none'"],
		},
	},
	crossOriginEmbedderPolicy: false,
	crossOriginResourcePolicy: { policy: "cross-origin" }
});

// HPP (HTTP Parameter Pollution) configuration
const hppConfig = hpp({
	whitelist: [
		'filter',
		'sort',
		'page',
		'limit',
		'fields'
	]
});

// XSS protection
const xssConfig = xss();

// Additional security middleware
const securityHeaders = (req, res, next) => {
	// Remove X-Powered-By header
	res.removeHeader('X-Powered-By');

	// Add custom security headers
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

	next();
};

// Request sanitization
const sanitizeRequest = (req, res, next) => {
	// Sanitize body
	if (req.body) {
		Object.keys(req.body).forEach(key => {
			if (typeof req.body[key] === 'string') {
				req.body[key] = req.body[key].trim();
			}
		});
	}

	// Sanitize query parameters
	if (req.query) {
		Object.keys(req.query).forEach(key => {
			if (typeof req.query[key] === 'string') {
				req.query[key] = req.query[key].trim();
			}
		});
	}

	next();
};

module.exports = {
	corsOptions,
	helmetConfig,
	hppConfig,
	xssConfig,
	securityHeaders,
	sanitizeRequest
}; 