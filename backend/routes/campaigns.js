// backend/routes/campaigns.js
const express = require('express');
const router = express.Router();
const CampaignController = require('../controllers/CampaignController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, CampaignController.createCampaign);
router.get('/', protect, CampaignController.getCampaigns);
router.get('/active', protect, CampaignController.getActiveCampaigns); // Nueva ruta
router.get('/:id', protect, CampaignController.getCampaign);
router.put('/:id', protect, CampaignController.updateCampaign);
router.delete('/:id', protect, CampaignController.deleteCampaign);

module.exports = router;