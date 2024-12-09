// backend/models/Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  location: { type: String, required: true },
  coste_optometra: { type: Number, required: true },
  viaticos: { type: Number, required: true },
  origen: { type: String, enum: ['por convenio', 'por gestión'], required: true },
});

module.exports = mongoose.model('Campaign', CampaignSchema);