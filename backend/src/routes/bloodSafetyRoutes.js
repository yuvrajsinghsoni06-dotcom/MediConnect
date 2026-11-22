import express from 'express';
import { z } from 'zod';
import {
  AssessmentsRepository,
  DonationsRepository,
  LabTestsRepository,
  ClinicalReviewsRepository,
  FollowUpsRepository,
  AuditLogsRepository,
  DonorsRepository,
  StatsRepository
} from '../repositories/index.js';
import {
  evaluateDonorVitals,
  verifyReleasePrerequisites,
  calculateQuarantineTransition
} from '../services/safetySafeguards.js';
import { authenticateToken, optionalAuthenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validator.js';

const router = express.Router();

// ============================================================================
// 0. SURVEILLANCE & SCREENING METRICS
// ============================================================================
router.get('/statistics', async (req, res, next) => {
  try {
    const stats = await StatsRepository.getSurveillanceStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 1. DONOR ASSESSMENTS
// ============================================================================

const assessmentSchema = z.object({
  donor_id: z.string().min(1),
  weight_kg: z.number().positive(),
  hemoglobin_g_dl: z.number().positive(),
  blood_pressure_sys: z.number().int().positive(),
  blood_pressure_dia: z.number().int().positive(),
  pulse_bpm: z.number().int().positive(),
  temperature_c: z.number().positive(),
  travel_history_cleared: z.boolean(),
  high_risk_cleared: z.boolean(),
  medication_cleared: z.boolean(),
  recent_fever_symptoms: z.boolean(),
  notes: z.string().optional()
});

router.get('/assessments', optionalAuthenticate, async (req, res, next) => {
  try {
    const list = await AssessmentsRepository.listAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/assessments',
  authenticateToken,
  requireRole('blood_bank_staff', 'admin'),
  validateBody(assessmentSchema),
  async (req, res, next) => {
    try {
      const actorUserId = req.user.userId;
      const actorRole = req.user.role;

      // Server-side authoritative vitals evaluation
      const evaluation = evaluateDonorVitals(req.body);
      const assessmentId = `ASM-2026-${Math.floor(100 + Math.random() * 900)}`;

      const assessmentData = {
        assessment_id: assessmentId,
        ...req.body,
        status: evaluation.status,
        deferral_reason: evaluation.flags.length > 0 ? evaluation.flags.join('; ') : null,
        evaluator_user_id: actorUserId
      };

      const saved = await AssessmentsRepository.create(assessmentData);

      await AuditLogsRepository.record({
        eventType: 'DONOR_ASSESSMENT_RECORDED',
        recordId: assessmentId,
        entityType: 'donor_assessments',
        actorUserId,
        actorRole,
        ipAddress: req.ip,
        details: {
          donor_id: req.body.donor_id,
          status: evaluation.status,
          flags: evaluation.flags
        }
      });

      res.status(201).json({
        success: true,
        data: saved,
        evaluation
      });
    } catch (err) {
      next(err);
    }
  }
);

// ============================================================================
// 2. BLOOD DONATIONS & ACCESSIONING
// ============================================================================

const donationSchema = z.object({
  donor_id: z.string().min(1),
  assessment_id: z.string().min(1),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  donation_type: z.string().default('Whole Blood'),
  bag_type: z.string().default('Triple'),
  volume_ml: z.number().int().default(450),
  location: z.string().default('Main Blood Centre - Phlebotomy Bay 1')
});

router.get('/donations', optionalAuthenticate, async (req, res, next) => {
  try {
    const role = req.user ? req.user.role : (req.query.role || 'admin');
    const userId = req.user ? req.user.userId : req.query.userId;
    const list = await DonationsRepository.listAll(role, userId);
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

router.get('/donations/:unitNumber', optionalAuthenticate, async (req, res, next) => {
  try {
    const unit = await DonationsRepository.findByUnit(req.params.unitNumber);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Donation unit not found' });
    }
    const labResults = await LabTestsRepository.listByUnit(req.params.unitNumber);
    res.json({ success: true, data: { ...unit, labResults } });
  } catch (err) {
    next(err);
  }
});

router.get('/donations/:unitNumber/prerequisites', async (req, res, next) => {
  try {
    const unit = await DonationsRepository.findByUnit(req.params.unitNumber);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Unit not found' });
    }
    const labResults = await LabTestsRepository.listByUnit(req.params.unitNumber);
    const evalResult = verifyReleasePrerequisites(unit, labResults);
    res.json({ success: true, data: evalResult });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/donations',
  authenticateToken,
  requireRole('blood_bank_staff', 'admin'),
  validateBody(donationSchema),
  async (req, res, next) => {
    try {
      const actorUserId = req.user.userId;
      const actorRole = req.user.role;

      const unitNumber = `DON-2026-${Math.floor(100 + Math.random() * 900)}`;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 35); // Whole blood 35 days shelf life

      const donationData = {
        unit_number: unitNumber,
        expiry_date: expiry.toISOString().split('T')[0],
        ...req.body
      };

      const created = await DonationsRepository.createCollectionTransaction(donationData, actorUserId);

      await AuditLogsRepository.record({
        eventType: 'DONATION_ACCESSIONED',
        recordId: unitNumber,
        entityType: 'blood_donations',
        actorUserId,
        actorRole,
        ipAddress: req.ip,
        details: {
          donor_id: req.body.donor_id,
          blood_group: req.body.blood_group,
          quarantine_status: 'Quarantined',
          mandatory_tests_queued: 5
        }
      });

      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/donations/:unitNumber/quarantine',
  authenticateToken,
  requireRole('blood_bank_staff', 'clinical_reviewer', 'admin'),
  async (req, res, next) => {
    try {
      const { status, reason } = req.body;
      if (!status || !reason) {
        return res.status(400).json({ success: false, message: 'status and reason are required' });
      }

      const actorUserId = req.user.userId;
      const actorRole = req.user.role;

      const updated = await DonationsRepository.updateQuarantineStatus(req.params.unitNumber, status, reason);

      await AuditLogsRepository.record({
        eventType: 'QUARANTINE_STATUS_UPDATED',
        recordId: req.params.unitNumber,
        entityType: 'blood_donations',
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

// ============================================================================
// 3. LABORATORY SCREENING
// ============================================================================

router.get('/lab-tests', async (req, res, next) => {
  try {
    const tests = await LabTestsRepository.listAll();
    res.json({ success: true, data: tests });
  } catch (err) {
    next(err);
  }
});

router.get('/lab-tests/unit/:unitNumber', async (req, res, next) => {
  try {
    const tests = await LabTestsRepository.listByUnit(req.params.unitNumber);
    res.json({ success: true, data: tests });
  } catch (err) {
    next(err);
  }
});

const updateLabTestSchema = z.object({
  result: z.enum(['Pending', 'Non-Reactive', 'Reactive', 'Inconclusive', 'Invalid']),
  test_kit_lot: z.string().optional(),
  notes: z.string().optional()
});

router.put(
  '/lab-tests/:resultId',
  authenticateToken,
  requireRole('lab_technician', 'admin'),
  validateBody(updateLabTestSchema),
  async (req, res, next) => {
    try {
      const actorUserId = req.user.userId;
      const actorRole = req.user.role;

      const updated = await LabTestsRepository.updateResult(req.params.resultId, req.body, actorUserId);

      await AuditLogsRepository.record({
        eventType: 'LAB_RESULT_RECORDED',
        recordId: req.params.resultId,
        entityType: 'laboratory_test_results',
        actorUserId,
        actorRole,
        ipAddress: req.ip,
        details: {
          result: req.body.result,
          test_kit_lot: req.body.test_kit_lot,
          unit_number: updated ? updated.unit_number : undefined
        }
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// ============================================================================
// 4. CLINICAL REVIEWS & DISPOSITION AUTHORIZATION
// ============================================================================

router.get('/clinical-reviews', async (req, res, next) => {
  try {
    const reviews = await ClinicalReviewsRepository.listAll();
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

const clinicalReviewSchema = z.object({
  unit_number: z.string().min(1),
  decision: z.enum(['Released', 'Quarantined', 'Discarded', 'Under_Investigation']),
  notes: z.string().min(1)
});

// Authoritative Clinical Review: STRICTLY restricted to Transfusion Medicine Officer (clinical_reviewer)
router.post(
  '/clinical-reviews',
  authenticateToken,
  requireRole('clinical_reviewer'),
  validateBody(clinicalReviewSchema),
  async (req, res, next) => {
    try {
      const actorUserId = req.user.userId;
      const actorRole = req.user.role;
      const { unit_number, decision, notes } = req.body;

      if (decision === 'Released') {
        // Authoritative transactional verification of all 5 mandatory negative tests
        const result = await ClinicalReviewsRepository.authorizeRelease(unit_number, actorUserId, notes);

        await AuditLogsRepository.record({
          eventType: 'CLINICAL_DISPOSITION_APPROVED',
          recordId: unit_number,
          entityType: 'blood_donations',
          actorUserId,
          actorRole,
          ipAddress: req.ip,
          details: { decision: 'Released', notes, reviewId: result.reviewId }
        });

        return res.json({ success: true, data: result });
      }

      // Non-release decisions (Quarantined, Discarded)
      await DonationsRepository.updateQuarantineStatus(unit_number, decision, notes);

      await AuditLogsRepository.record({
        eventType: 'CLINICAL_DISPOSITION_HOLD',
        recordId: unit_number,
        entityType: 'blood_donations',
        actorUserId,
        actorRole,
        ipAddress: req.ip,
        details: { decision, notes }
      });

      res.json({ success: true, message: `Unit marked as ${decision}` });
    } catch (err) {
      next(err);
    }
  }
);

// ============================================================================
// 5. CONFIDENTIAL FOLLOW-UPS & AUDIT LOGS
// ============================================================================

router.get(
  '/follow-ups',
  authenticateToken,
  requireRole('clinical_reviewer', 'admin'),
  async (req, res, next) => {
    try {
      const list = await FollowUpsRepository.listAll();
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/follow-ups/:caseId',
  authenticateToken,
  requireRole('clinical_reviewer', 'admin'),
  async (req, res, next) => {
    try {
      const updated = await FollowUpsRepository.updateCase(req.params.caseId, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/audit-logs',
  authenticateToken,
  requireRole('clinical_reviewer', 'admin', 'blood_bank_staff'),
  async (req, res, next) => {
    try {
      const list = await AuditLogsRepository.listAll();
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
