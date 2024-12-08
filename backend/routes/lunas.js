// backend/routes/lunas.js
const express = require('express');
const router = express.Router();
const LunasController = require('../controllers/LunasController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, LunasController.createLunas);
router.get('/', protect, LunasController.getLunas);
router.get('/:id', protect, LunasController.getLuna);
router.put('/:id', protect, LunasController.updateLuna);
router.delete('/:id', protect, LunasController.deleteLuna);

module.exports = router;