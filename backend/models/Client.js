// backend/models/Client.js
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
});

module.exports = mongoose.model('Client', ClientSchema);