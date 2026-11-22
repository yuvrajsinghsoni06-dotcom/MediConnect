import express from 'express';
import { DonorsRepository, CampaignsRepository, EmergencyRequestsRepository } from '../repositories/index.js';

const router = express.Router();

// Donors
router.get('/donors', async (req, res, next) => {
  try {
    const { bloodGroup, city } = req.query;
    const donors = await DonorsRepository.listAll({ bloodGroup, city });
    res.json({ success: true, data: donors });
  } catch (err) {
    next(err);
  }
});

router.get('/donors/:id', async (req, res, next) => {
  try {
    const donor = await DonorsRepository.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
    res.json({ success: true, data: donor });
  } catch (err) {
    next(err);
  }
});

// Campaigns
router.get('/campaigns', async (req, res, next) => {
  try {
    const campaigns = await CampaignsRepository.listAll();
    res.json({ success: true, data: campaigns });
  } catch (err) {
    next(err);
  }
});

// Emergency requests
router.get('/emergency-requests', async (req, res, next) => {
  try {
    const requests = await EmergencyRequestsRepository.listAll();
    res.json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
});

export default router;
