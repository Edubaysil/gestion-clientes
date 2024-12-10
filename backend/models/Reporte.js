// backend/models/Reporte.js
const mongoose = require('mongoose');

const ReporteSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }],
  sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true }],
  gastos: { type: Number, required: true },
  totalCampaña: { type: Number, required: true },
  ganancia: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reporte', ReporteSchema);