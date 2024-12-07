// backend/routes/products.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, ProductController.createProduct);
router.get('/', protect, ProductController.getProducts);
router.get('/:id', protect, ProductController.getProduct);
router.put('/:id', protect, ProductController.updateProduct);
router.delete('/:id', protect, ProductController.deleteProduct);

module.exports = router;