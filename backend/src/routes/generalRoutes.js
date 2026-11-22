import express from 'express';
import { z } from 'zod';
import {
  DonorsRepository,
  CampaignsRepository,
  EmergencyRequestsRepository,
  PublicDirectoryRepository,
  StatsRepository,
  AuditLogsRepository
} from '../repositories/index.js';
import { authenticateToken, optionalAuthenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validator.js';

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

// ============================================================================
// Campaigns Management
// ============================================================================
router.get('/campaigns', async (req, res, next) => {
  try {
    const campaigns = await CampaignsRepository.listAll();
    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) {
    next(err);
  }
});

const campaignSchema = z.object({
  title: z.string().min(3),
  organizer: z.string().min(2),
  location: z.string().min(3),
  date: z.string().min(10),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  target_units: z.number().int().positive().optional(),
  collected_units: z.number().int().nonnegative().optional(),
  status: z.enum(['Upcoming', 'Active', 'Completed', 'Cancelled']).optional(),
  description: z.string().optional()
});

router.post(
  '/campaigns',
  authenticateToken,
  requireRole('blood_bank_staff', 'admin'),
  validateBody(campaignSchema),
  async (req, res, next) => {
    try {
      const created = await CampaignsRepository.create(req.body);

      await AuditLogsRepository.record({
        eventType: 'CAMPAIGN_CREATED',
        recordId: created.campaign_id,
        entityType: 'campaigns',
        actorUserId: req.user.userId,
        actorRole: req.user.role,
        ipAddress: req.ip,
        details: { title: created.title, location: created.location, date: created.date }
      });

      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/campaigns/:campaignId',
  authenticateToken,
  requireRole('blood_bank_staff', 'admin'),
  async (req, res, next) => {
    try {
      const updated = await CampaignsRepository.update(req.params.campaignId, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      await AuditLogsRepository.record({
        eventType: 'CAMPAIGN_UPDATED',
        recordId: req.params.campaignId,
        entityType: 'campaigns',
        actorUserId: req.user.userId,
        actorRole: req.user.role,
        ipAddress: req.ip,
        details: req.body
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// ============================================================================
// Emergency Blood Requests Management
// ============================================================================
router.get('/emergency-requests', async (req, res, next) => {
  try {
    const requests = await EmergencyRequestsRepository.listAll();
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    next(err);
  }
});

const emergencyRequestSchema = z.object({
  hospital_name: z.string().min(2),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  units_needed: z.number().int().positive(),
  urgency: z.enum(['Critical', 'Urgent', 'Normal']).default('Urgent'),
  contact_person: z.string().min(2),
  contact_phone: z.string().min(7)
});

router.post(
  '/emergency-requests',
  optionalAuthenticate,
  validateBody(emergencyRequestSchema),
  async (req, res, next) => {
    try {
      const coordinatorUserId = req.user ? req.user.userId : null;
      const created = await EmergencyRequestsRepository.create({
        ...req.body,
        coordinator_user_id: coordinatorUserId
      });

      await AuditLogsRepository.record({
        eventType: 'EMERGENCY_REQUEST_SUBMITTED',
        recordId: created.request_id,
        entityType: 'emergency_requests',
        actorUserId: coordinatorUserId,
        actorRole: req.user ? req.user.role : 'anonymous',
        ipAddress: req.ip,
        details: {
          hospital_name: created.hospital_name,
          blood_group: created.blood_group,
          units_needed: created.units_needed,
          urgency: created.urgency
        }
      });

      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/emergency-requests/:requestId/status',
  authenticateToken,
  requireRole('hospital_coordinator', 'blood_bank_staff', 'admin'),
  async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!['Open', 'In_Progress', 'Fulfilled', 'Cancelled'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const updated = await EmergencyRequestsRepository.updateStatus(req.params.requestId, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Emergency request not found' });
      }

      await AuditLogsRepository.record({
        eventType: 'EMERGENCY_REQUEST_STATUS_UPDATED',
        recordId: req.params.requestId,
        entityType: 'emergency_requests',
        actorUserId: req.user.userId,
        actorRole: req.user.role,
        ipAddress: req.ip,
        details: { status }
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

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
