// backend/models/Client.js
const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  esfera: { type: Number, required: false },
  cilindro: { type: Number, required: false },
  eje: { type: Number, required: false },
  dip: { type: Number, required: false },
  add: { type: Number, required: false },
});

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false }, // Eliminar la validación de unicidad
  phone: { type: String, required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  edad: { type: Number, required: true },
  direccion: { type: String, required: false }, // Nuevo campo
  medida_lejos: {
    ojo_derecho: { type: MeasurementSchema, required: false },
    ojo_izquierdo: { type: MeasurementSchema, required: false },
  },
  medida_cerca: {
    ojo_derecho: { type: MeasurementSchema, required: false },
    ojo_izquierdo: { type: MeasurementSchema, required: false },
  },
  miopia: { type: Boolean, default: false },
  astigmatismo: { type: Boolean, default: false },
  hipermetropia: { type: Boolean, default: false },
  presbicia: { type: Boolean, default: false },
  anotaciones: { type: String, maxlength: 300, required: false },
});

module.exports = mongoose.model('Client', ClientSchema);