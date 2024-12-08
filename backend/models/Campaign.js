// backend/models/Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  location: { type: String, required: true },
  coste_optometra: { type: Number, required: true },
  viaticos: { type: Number, required: true },
});

module.exports = mongoose.model('Campaign', CampaignSchema);