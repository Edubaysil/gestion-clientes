// backend/models/Lunas.js
const mongoose = require('mongoose');

const LunasSchema = new mongoose.Schema({
  material: { type: String, required: true },
  graduacion: { type: String, required: true },
  color: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  descripcion: { type: String, required: true }, // Nuevo campo
});

module.exports = mongoose.model('Lunas', LunasSchema);