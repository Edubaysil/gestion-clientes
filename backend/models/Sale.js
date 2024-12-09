// backend/models/Sale.js
const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['reserved', 'to deliver', 'delivered'], default: 'reserved' },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  luna: { type: mongoose.Schema.Types.ObjectId, ref: 'Lunas', required: true }, // Nuevo campo
  tratamientos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tratamiento' }], // Nuevo campo
});

module.exports = mongoose.model('Sale', SaleSchema);