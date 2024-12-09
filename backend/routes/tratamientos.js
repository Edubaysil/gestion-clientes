// backend/routes/tratamientos.js
const express = require('express');
const router = express.Router();
const TratamientoController = require('../controllers/TratamientoController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, TratamientoController.createTratamiento);
router.get('/', protect, TratamientoController.getTratamientos);
router.get('/:id', protect, TratamientoController.getTratamiento);
router.put('/:id', protect, TratamientoController.updateTratamiento);
router.delete('/:id', protect, TratamientoController.deleteTratamiento);

module.exports = router;