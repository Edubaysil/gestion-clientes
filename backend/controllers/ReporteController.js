// backend/controllers/ReporteController.js
const Campaign = require('../models/Campaign');
const Client = require('../models/Client');
const Sale = require('../models/Sale');
const Reporte = require('../models/Reporte');

exports.generateReport = async (req, res) => {
  try {
    const campaignId = req.body.campaignId;
    const campaign = await Campaign.findById(campaignId).select('-status');
    const clients = await Client.find({ campaign: campaignId });
    const sales = await Sale.find({ campaign: campaignId }).populate('client product producto2 luna_izquierda luna_derecha tratamientos');

    const gastos = campaign.coste_optometra + campaign.viaticos;
    const totalCampaña = sales.reduce((total, sale) => total + sale.total, 0);
    const ganancia = totalCampaña - gastos;

    const reporte = new Reporte({
      campaign: campaignId,
      clients: clients.map(client => client._id),
      sales: sales.map(sale => sale._id),
      gastos,
      totalCampaña,
      ganancia
    });

    await reporte.save();

    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).send({ message: 'Error generating report', error });
  }
};

exports.getReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const reporte = await Reporte.findById(reportId).populate('campaign clients sales');
    if (!reporte) {
      return res.status(404).send('Report not found');
    }
    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching report', error });
  }
};

exports.getCampaignData = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId).select('-status');
    const clients = await Client.find({ campaign: campaignId });
    const sales = await Sale.find({ campaign: campaignId }).populate('client product producto2 luna_izquierda luna_derecha tratamientos');

    const gastos = campaign.coste_optometra + campaign.viaticos;
    const totalCampaña = sales.reduce((total, sale) => total + sale.total, 0);
    const ganancia = totalCampaña - gastos;

    res.status(200).json({ campaign, clients, sales, gastos, totalCampaña, ganancia });
  } catch (error) {
    res.status(500).send({ message: 'Error fetching campaign data', error });
  }
};