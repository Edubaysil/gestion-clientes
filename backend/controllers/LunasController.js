// backend/controllers/LunasController.js
const Lunas = require('../models/Lunas');

exports.createLunas = async (req, res) => {
  try {
    const lunas = new Lunas(req.body);
    await lunas.save();
    res.status(201).send(lunas);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getLunas = async (req, res) => {
  try {
    const lunas = await Lunas.find();
    res.status(200).send(lunas);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getLuna = async (req, res) => {
  try {
    const luna = await Lunas.findById(req.params.id);
    if (!luna) {
      return res.status(404).send('Luna not found');
    }
    res.status(200).send(luna);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLuna = async (req, res) => {
  try {
    const luna = await Lunas.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!luna) {
      return res.status(404).send('Luna not found');
    }
    res.status(200).send(luna);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteLuna = async (req, res) => {
  try {
    const luna = await Lunas.findByIdAndDelete(req.params.id);
    if (!luna) {
      return res.status(404).send('Luna not found');
    }
    res.status(200).send('Luna deleted');
  } catch (error) {
    res.status(500).send(error);
  }
};