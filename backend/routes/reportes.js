// backend/routes/reportes.js
const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, ReporteController.generateReport);
router.get('/:id', protect, ReporteController.getReport);

module.exports = router;