// backend/models/Tratamiento.js
const mongoose = require('mongoose');

const TratamientoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
});

module.exports = mongoose.model('Tratamiento', TratamientoSchema);