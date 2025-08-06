const express = require('express');
const { getDashboardStats } = require('../controllers/Dashboard');
const { verifyToken } = require('../middleware/VerifyToken');

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/stats', verifyToken, getDashboardStats);

module.exports = router; 