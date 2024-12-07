// backend/routes/sales.js
const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, SaleController.createSale);
router.get('/', protect, SaleController.getSales);
router.get('/:id', protect, SaleController.getSale);
router.put('/:id', protect, SaleController.updateSale);
router.delete('/:id', protect, SaleController.deleteSale);

module.exports = router;