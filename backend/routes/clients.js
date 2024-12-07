// backend/routes/clients.js
const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, ClientController.createClient);
router.get('/', protect, ClientController.getClients);
router.get('/:id', protect, ClientController.getClient);
router.put('/:id', protect, ClientController.updateClient);
router.delete('/:id', protect, ClientController.deleteClient);

module.exports = router;