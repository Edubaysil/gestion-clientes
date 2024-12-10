// backend/controllers/SaleController.js
const Sale = require('../models/Sale');
const Client = require('../models/Client');
const Product = require('../models/Product');
const Luna = require('../models/Lunas');
const Tratamiento = require('../models/Tratamiento');

exports.createSale = async (req, res) => {
  try {
    const { product, producto2, luna_izquierda, luna_derecha, tratamientos } = req.body;

    let total = 0;

    if (product) {
      const selectedProduct = await Product.findById(product);
      if (selectedProduct && selectedProduct.stock > 0) {
        total += selectedProduct.price;
        selectedProduct.stock -= 1;
        await selectedProduct.save();
      } else {
        return res.status(400).send({ message: 'Product out of stock' });
      }
    }

    if (producto2) {
      const selectedProduct2 = await Product.findById(producto2);
      if (selectedProduct2 && selectedProduct2.stock > 0) {
        total += selectedProduct2.price;
        selectedProduct2.stock -= 1;
        await selectedProduct2.save();
      } else {
        return res.status(400).send({ message: 'Product 2 out of stock' });
      }
    }

    if (luna_izquierda) {
      const selectedLunaIzquierda = await Luna.findById(luna_izquierda);
      if (selectedLunaIzquierda && selectedLunaIzquierda.stock > 0) {
        total += selectedLunaIzquierda.precio;
        selectedLunaIzquierda.stock -= 1;
        await selectedLunaIzquierda.save();
      } else {
        return res.status(400).send({ message: 'Luna izquierda out of stock' });
      }
    }

    if (luna_derecha) {
      const selectedLunaDerecha = await Luna.findById(luna_derecha);
      if (selectedLunaDerecha && selectedLunaDerecha.stock > 0) {
        total += selectedLunaDerecha.precio;
        selectedLunaDerecha.stock -= 1;
        await selectedLunaDerecha.save();
      } else {
        return res.status(400).send({ message: 'Luna derecha out of stock' });
      }
    }

    if (tratamientos && tratamientos.length > 0) {
      for (const tratamientoId of tratamientos) {
        const selectedTratamiento = await Tratamiento.findById(tratamientoId);
        if (selectedTratamiento) {
          total += selectedTratamiento.precio;
        }
      }
    }

    const sale = new Sale({ ...req.body, total });
    await sale.save();
    res.status(201).send(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(400).send({ message: 'Error creating sale', error });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('client product producto2 campaign luna_izquierda luna_derecha tratamientos');
    res.status(200).send(sales);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('client product producto2 campaign luna_izquierda luna_derecha tratamientos');
    if (!sale) {
      return res.status(404).send('Sale not found');
    }
    res.status(200).send(sale);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getClientsByCampaign = async (req, res) => {
  try {
    const clients = await Client.find({ campaign: req.params.campaignId });
    res.status(200).send(clients);
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