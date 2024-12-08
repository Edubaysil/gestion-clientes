// backend/models/Client.js
const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  esfera: { type: Number, required: true },
  cilindro: { type: Number, required: true },
  eje: { type: Number, required: true },
  dip: { type: Number, required: true },
  add: { type: Number, required: true },
});

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  edad: { type: Number, required: true },
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
  anotaciones: { type: String, maxlength: 300 },
});

module.exports = mongoose.model('Client', ClientSchema);