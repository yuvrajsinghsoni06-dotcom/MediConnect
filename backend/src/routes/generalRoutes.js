import express from 'express';
import {
  DonorsRepository,
  CampaignsRepository,
  EmergencyRequestsRepository,
  PublicDirectoryRepository,
  StatsRepository
} from '../repositories/index.js';

const router = express.Router();

// Public Donor Discovery (Sanitized - PII strictly excluded)
router.get('/donors', async (req, res, next) => {
  try {
    const { bloodGroup, city } = req.query;
    const donors = await DonorsRepository.listPublic({ bloodGroup, city });
    res.json({
      success: true,
      meta: {
        privacyNotice: 'Personal contact details and DOB are protected under healthcare privacy rules. Only aggregated city and availability status are displayed.',
        count: donors.length
      },
      data: donors
    });
  } catch (err) {
    next(err);
  }
});

router.get('/donors/:id', async (req, res, next) => {
  try {
    const donor = await DonorsRepository.findPublicById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
    res.json({ success: true, data: donor });
  } catch (err) {
    next(err);
  }
});

// Official Public Blood Centre Directory (e-RaktKosh / MOHFW Aligned)
router.get('/public-centres', async (req, res, next) => {
  try {
    const centres = await PublicDirectoryRepository.listVerifiedCentres();
    res.json({
      success: true,
      source: 'e-RaktKosh Portal (Ministry of Health & Family Welfare, Govt. of India)',
      data: centres
    });
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

// Live Platform Impact Statistics
router.get('/platform-stats', async (req, res, next) => {
  try {
    const stats = await StatsRepository.getPlatformStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

export default router;
