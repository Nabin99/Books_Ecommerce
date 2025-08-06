const express = require('express');
const router = express.Router();
const { create, getAll, getById, updateById, deleteById, getByCategory, getByBrand } = require('../controllers/Product');
const { verifyToken } = require('../middleware/VerifyToken');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAll);
router.get('/:id', getById);
router.get('/category/:categoryId', getByCategory);
router.get('/brand/:brandId', getByBrand);

// Protected routes (admin only)
router.post('/', verifyToken, upload.single('image'), create);
router.patch('/:id', verifyToken, upload.single('image'), updateById);
router.delete('/:id', verifyToken, deleteById);

module.exports = router;