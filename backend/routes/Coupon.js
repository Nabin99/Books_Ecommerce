const express = require('express');
const router = express.Router();
const couponController = require('../controllers/Coupon');
const { verifyToken } = require('../middleware/VerifyToken');

// Public routes (no authentication required)
// None for coupons - all require authentication

// User routes (require authentication)
router.post('/validate', verifyToken, couponController.validate);
router.get('/available', verifyToken, couponController.getAvailable);

// Admin routes (require authentication + admin role)
router.post('/', verifyToken, couponController.create);
router.get('/', verifyToken, couponController.getAll);
router.get('/:id', verifyToken, couponController.getById);
router.patch('/:id', verifyToken, couponController.updateById);
router.delete('/:id', verifyToken, couponController.deleteById);

module.exports = router; 