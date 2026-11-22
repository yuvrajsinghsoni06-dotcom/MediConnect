import express from 'express';
import { z } from 'zod';
import { ComponentsRepository, AuditLogsRepository } from '../repositories/index.js';
import { authenticateToken } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validator.js';

const router = express.Router();

// 1. Inventory Summary & Metrics (Accessible to Staff, Clinical Reviewers, Admins, Hospital Coordinators)
router.get(
  '/summary',
  authenticateToken,
  requireRole('blood_bank_staff', 'clinical_reviewer', 'admin', 'hospital_coordinator'),
  async (req, res, next) => {
    try {
      const summary = await ComponentsRepository.getInventorySummary();
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }
);

// 2. List Components with Filtering
router.get(
  '/components',
  authenticateToken,
  requireRole('blood_bank_staff', 'clinical_reviewer', 'admin', 'hospital_coordinator'),
  async (req, res, next) => {
    try {
      const { status, component_type, blood_group } = req.query;
      const components = await ComponentsRepository.listAll({
        status,
        component_type,
        blood_group
      });
      res.json({ success: true, count: components.length, data: components });
    } catch (err) {
      next(err);
    }
  }
);

// 3. Single Component Detail
router.get(
  '/components/:code',
  authenticateToken,
  requireRole('blood_bank_staff', 'clinical_reviewer', 'admin', 'hospital_coordinator'),
  async (req, res, next) => {
    try {
      const component = await ComponentsRepository.findByCode(req.params.code);
      if (!component) {
        return res.status(404).json({ success: false, message: 'Blood component record not found' });
      }
      res.json({ success: true, data: component });
    } catch (err) {
      next(err);
    }
  }
);

// 4. Derive Component from Donation Unit (Staff / Admin)
const createComponentSchema = z.object({
  component_code: z.string().optional(),
  unit_number: z.string().min(1),
  component_type: z.enum(['Packed Red Blood Cells', 'Fresh Frozen Plasma', 'Platelet Concentrate', 'Cryoprecipitate']),
  volume_ml: z.number().int().positive(),
  storage_temperature_c: z.string().min(1),
  storage_location: z.string().min(1),
  expiry_date: z.string().min(1),
  status: z.enum(['Quarantined', 'Released', 'Transfused', 'Discarded', 'Expired']).optional()
});

router.post(
  '/components',
  authenticateToken,
  requireRole('blood_bank_staff', 'admin'),
  validateBody(createComponentSchema),
  async (req, res, next) => {
    try {
      const actorUserId = req.user.userId;
      const actorRole = req.user.role;

      const created = await ComponentsRepository.create(req.body);

      await AuditLogsRepository.record({
        eventType: 'COMPONENT_DERIVED',
        recordId: created.component_code,
        entityType: 'blood_components',
        actorUserId,
        actorRole,
        ipAddress: req.ip,
        details: {
          unit_number: req.body.unit_number,
          component_type: req.body.component_type,
          volume_ml: req.body.volume_ml,
          status: created.status
        }
      });

      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

// 5. Update Component Status (Transfuse, Discard, Quarantine, Release)
const updateStatusSchema = z.object({
  status: z.enum(['Quarantined', 'Released', 'Transfused', 'Discarded', 'Expired']),
  reason: z.string().optional()
});

router.put(
  '/components/:code/status',
  authenticateToken,
  requireRole('blood_bank_staff', 'clinical_reviewer', 'admin'),
  validateBody(updateStatusSchema),
  async (req, res, next) => {
    try {
      const actorUserId = req.user.userId;
      const actorRole = req.user.role;
      const { status, reason } = req.body;

      const updated = await ComponentsRepository.updateStatus(req.params.code, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Component not found' });
      }

      await AuditLogsRepository.record({
        eventType: 'COMPONENT_STATUS_UPDATED',
        recordId: req.params.code,
        entityType: 'blood_components',
        actorUserId,
        actorRole,
        ipAddress: req.ip,
        details: { status, reason }
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
