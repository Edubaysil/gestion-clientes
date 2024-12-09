// backend/controllers/TratamientoController.js
const Tratamiento = require('../models/Tratamiento');

exports.createTratamiento = async (req, res) => {
  try {
    const tratamiento = new Tratamiento(req.body);
    await tratamiento.save();
    res.status(201).send(tratamiento);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTratamientos = async (req, res) => {
  try {
    const tratamientos = await Tratamiento.find();
    res.status(200).send(tratamientos);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getTratamiento = async (req, res) => {
  try {
    const tratamiento = await Tratamiento.findById(req.params.id);
    if (!tratamiento) {
      return res.status(404).send('Tratamiento not found');
    }
    res.status(200).send(tratamiento);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateTratamiento = async (req, res) => {
  try {
    const tratamiento = await Tratamiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tratamiento) {
      return res.status(404).send('Tratamiento not found');
    }
    res.status(200).send(tratamiento);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteTratamiento = async (req, res) => {
  try {
    const tratamiento = await Tratamiento.findByIdAndDelete(req.params.id);
    if (!tratamiento) {
      return res.status(404).send('Tratamiento not found');
    }
    res.status(200).send('Tratamiento deleted');
  } catch (error) {
    res.status(500).send(error);
  }
};