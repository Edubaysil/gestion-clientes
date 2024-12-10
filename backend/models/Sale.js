// backend/models/Sale.js
const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  producto2: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }, // Campo opcional
  status: { type: String, enum: ['reserved', 'to deliver', 'delivered'], default: 'reserved' },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  luna_izquierda: { type: mongoose.Schema.Types.ObjectId, ref: 'Lunas', required: true },
  luna_derecha: { type: mongoose.Schema.Types.ObjectId, ref: 'Lunas', required: true },
  tratamientos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tratamiento', required: false }], // Campo opcional
  total: { type: Number, required: true },
});

module.exports = mongoose.model('Sale', SaleSchema);