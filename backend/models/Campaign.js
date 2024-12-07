// backend/models/Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('Campaign', CampaignSchema);