const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { sendMail } = require("../utils/Emails");
const { generateOTP } = require("../utils/GenerateOtp");
const Otp = require("../models/OTP");
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");
const PasswordResetToken = require("../models/PasswordResetToken");

// Validation helper functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
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

// Rate limiting helper (simple in-memory store - consider Redis for production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const checkRateLimit = (identifier, action) => {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    const attempts = rateLimitStore.get(key) || [];

    // Remove expired attempts
    const validAttempts = attempts.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (validAttempts.length >= MAX_ATTEMPTS) {
        return false;
    }

    validAttempts.push(now);
    rateLimitStore.set(key, validAttempts);
    return true;
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
                field: !name ? 'name' : !email ? 'email' : 'password'
            });
        }

        if (!validateName(name)) {
            return res.status(400).json({
                message: "Name must be between 2 and 50 characters",
                field: 'name'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
                field: 'email'
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
                field: 'password'
            });
        }

        // Rate limiting
        if (!checkRateLimit(email, 'signup')) {
            return res.status(429).json({
                message: "Too many signup attempts. Please try again later."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists",
                field: 'email'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

        // Create new user
        const userData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        };

        const createdUser = new User(userData);
        await createdUser.save();

        // Generate token
        const secureInfo = sanitizeUser(createdUser);
        const token = generateToken(secureInfo);

        // Set cookie
        const cookieExpiration = parseInt(process.env.COOKIE_EXPIRATION_DAYS || 7) * 24 * 60 * 60 * 1000;
        res.cookie('token', token, {
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            maxAge: cookieExpiration,
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true' ? true : false,
            path: '/'
        });

        res.status(201).json({
            message: "User created successfully",
            user: sanitizeUser(createdUser)
        });

    } catch (error) {
        console.error('Signup error:', error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User with this email already exists",
                field: 'email'
            });
        }

        res.status(500).json({
            message: "An error occurred during signup. Please try again later."
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                field: !email ? 'email' : 'password'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
                field: 'email'
            });
        }

        // Rate limiting
        if (!checkRateLimit(email, 'login')) {
            return res.status(429).json({
                message: "Too many login attempts. Please try again later."
            });
        }

        // Find user
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password",
                field: 'credentials'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                field: 'credentials'
            });
        }

        // Generate token
        const secureInfo = sanitizeUser(existingUser);
        const token = generateToken(secureInfo);

        // Set cookie
        const cookieExpiration = parseInt(process.env.COOKIE_EXPIRATION_DAYS || 7) * 24 * 60 * 60 * 1000;
        res.cookie('token', token, {
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            maxAge: cookieExpiration,
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true' ? true : false,
            path: '/'
        });

        res.status(200).json({
            message: "Login successful",
            user: sanitizeUser(existingUser)
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "An error occurred during login. Please try again later."
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        // Input validation
        if (!userId || !otp) {
            return res.status(400).json({
                message: "User ID and OTP are required",
                field: !userId ? 'userId' : 'otp'
            });
        }

        if (!validateUserId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format",
                field: 'userId'
            });
        }

        if (!validateOtp(otp)) {
            return res.status(400).json({
                message: "OTP must be a 6-digit number",
                field: 'otp'
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Find OTP
        const otpRecord = await Otp.findOne({ user: userId });
        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found or already used"
            });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await Otp.findByIdAndDelete(otpRecord._id);
            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        // Verify OTP
        const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOtpValid) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // Delete OTP and verify user
        await Otp.findByIdAndDelete(otpRecord._id);
        const verifiedUser = await User.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true }
        );

        res.status(200).json({
            message: "Email verified successfully",
            user: sanitizeUser(verifiedUser)
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            message: "An error occurred during OTP verification"
        });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { user: userId } = req.body;

        // Input validation
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                field: 'user'
            });
        }

        if (!validateUserId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format",
                field: 'user'
            });
        }

        // Rate limiting
        if (!checkRateLimit(userId, 'resendOtp')) {
            return res.status(429).json({
                message: "Too many OTP resend attempts. Please try again later."
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Delete existing OTPs
        await Otp.deleteMany({ user: userId });

        // Generate new OTP
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiration = Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME || 600000); // 10 minutes default

        const newOtp = new Otp({
            user: userId,
            otp: hashedOtp,
            expiresAt: new Date(otpExpiration)
        });
        await newOtp.save();

        // Log OTP for development (remove in production)
        console.log('🔐 OTP for user', user.email, ':', otp);

        // Send email
        try {
            await sendMail(
                user.email,
                "OTP Verification for Your Account",
                `Your One-Time Password (OTP) for account verification is: <b>${otp}</b>.<br/>This OTP will expire in 10 minutes. Do not share this OTP with anyone for security reasons.`
            );
        } catch (emailError) {
            console.log('📧 Email sending failed, but OTP is available in console:', otp);
        }

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            message: "An error occurred while sending OTP. Please try again later."
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Input validation
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                field: 'email'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
                field: 'email'
            });
        }

        // Rate limiting
        if (!checkRateLimit(email, 'forgotPassword')) {
            return res.status(429).json({
                message: "Too many password reset attempts. Please try again later."
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({
                message: "If the email exists, a password reset link has been sent."
            });
        }

        // Delete existing reset tokens
        await PasswordResetToken.deleteMany({ user: user._id });

        // Generate reset token
        const passwordResetToken = generateToken(sanitizeUser(user), true);
        const hashedToken = await bcrypt.hash(passwordResetToken, 10);
        const tokenExpiration = Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME || 600000); // 10 minutes default

        const newToken = new PasswordResetToken({
            user: user._id,
            token: hashedToken,
            expiresAt: new Date(tokenExpiration)
        });
        await newToken.save();

        // Send email
        const resetLink = `${process.env.ORIGIN}/reset-password/${user._id}/${passwordResetToken}`;
        await sendMail(
            user.email,
            'Password Reset Request',
            `<p>Dear ${user.name},</p>
            <p>We received a request to reset the password for your account. If you initiated this request, please use the following link to reset your password:</p>
            <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
            <p>This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,<br/>The Team</p>`
        );

        res.status(200).json({
            message: "If the email exists, a password reset link has been sent."
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            message: "An error occurred while processing your request. Please try again later."
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { userId, token, password } = req.body;

        // Input validation
        if (!userId || !token || !password) {
            return res.status(400).json({
                message: "User ID, token, and new password are required",
                field: !userId ? 'userId' : !token ? 'token' : 'password'
            });
        }

        if (!validateUserId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format",
                field: 'userId'
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
                field: 'password'
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Invalid reset link"
            });
        }

        // Find reset token
        const resetToken = await PasswordResetToken.findOne({ user: userId });
        if (!resetToken) {
            return res.status(400).json({
                message: "Invalid or expired reset link"
            });
        }

        // Check if token is expired
        if (resetToken.expiresAt < new Date()) {
            await PasswordResetToken.findByIdAndDelete(resetToken._id);
            return res.status(400).json({
                message: "Reset link has expired"
            });
        }

        // Verify token
        const isTokenValid = await bcrypt.compare(token, resetToken.token);
        if (!isTokenValid) {
            return res.status(400).json({
                message: "Invalid reset link"
            });
        }

        // Update password and delete token
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        await PasswordResetToken.findByIdAndDelete(resetToken._id);

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            message: "An error occurred while resetting the password. Please try again later."
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true' ? true : false,
            path: '/'
        });

        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: "An error occurred during logout"
        });
    }
};

exports.checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Authentication successful",
            user: sanitizeUser(user)
        });
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({
            message: "An error occurred while checking authentication"
        });
    }
};