// backend/controllers/CampaignController.js
const Campaign = require('../models/Campaign');

exports.createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).send(campaign);
  } catch (error) {
    res.status(400).send({ message: 'Error creating campaign', error });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).send(campaigns);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching campaigns', error });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }
    res.status(200).send(campaign);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching campaign', error });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }
    res.status(200).send(campaign);
  } catch (error) {
    res.status(400).send({ message: 'Error updating campaign', error });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }
    res.status(200).send('Campaign deleted');
  } catch (error) {
    res.status(500).send({ message: 'Error deleting campaign', error });
  }
};