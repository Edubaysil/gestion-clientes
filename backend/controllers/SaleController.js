// backend/controllers/SaleController.js
const Sale = require('../models/Sale');

exports.createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).send(sale);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('client product campaign');
    res.status(200).send(sales);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('client product campaign');
    if (!sale) {
      return res.status(404).send('Sale not found');
    }
    res.status(200).send(sale);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) {
      return res.status(404).send('Sale not found');
    }
    res.status(200).send(sale);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).send('Sale not found');
    }
    res.status(200).send('Sale deleted');
  } catch (error) {
    res.status(500).send(error);
  }
};