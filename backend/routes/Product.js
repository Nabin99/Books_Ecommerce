const express = require('express');
const router = express.Router();
const {
	create,
	getAll,
	getById,
	updateById,
	deleteById,
	getSuggestions,
	getRelated
} = require('../controllers/Product');
const { verifyToken } = require('../middleware/VerifyToken');
const upload = require('../middleware/upload');

// Public routes - specific routes first
router.get('/suggestions', getSuggestions);
router.get('/:id/related', getRelated);
router.get('/', getAll);
router.get('/:id', getById);

// Protected routes (admin only)
router.post('/', verifyToken, upload.single('image'), create);
router.patch('/:id', verifyToken, upload.single('image'), updateById);
router.delete('/:id', verifyToken, deleteById);

module.exports = router;