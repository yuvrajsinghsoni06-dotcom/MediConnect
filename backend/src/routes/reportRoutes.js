import express from 'express';
import { ReportsRepository } from '../repositories/index.js';
import { authenticateToken } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

const router = express.Router();

// Analytics & Reports Summary
router.get(
  '/summary',
  authenticateToken,
  requireRole('admin', 'clinical_reviewer', 'blood_bank_staff'),
  async (req, res, next) => {
    try {
      const summary = await ReportsRepository.getAnalyticsSummary();
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }
);

// CSV Export for Regulatory Surveillance & Reports
router.get(
  '/export',
  authenticateToken,
  requireRole('admin', 'clinical_reviewer', 'blood_bank_staff'),
  async (req, res, next) => {
    try {
      const summary = await ReportsRepository.getAnalyticsSummary();
      
      let csv = 'Report: MediConnect Blood Surveillance & Operational Analytics\n';
      csv += `Generated At: ${summary.generatedAt}\n\n`;

      csv += '--- Monthly Donations Breakdown ---\n';
      csv += 'Month,Blood Group,Donations Count,Total Volume (ml)\n';
      (summary.monthlyDonations || []).forEach(row => {
        csv += `${row.month},${row.blood_group},${row.count},${row.total_volume_ml}\n`;
      });

      csv += '\n--- Laboratory Screening Outcomes ---\n';
      csv += 'Test Code,Result,Count\n';
      (summary.labOutcomes || []).forEach(row => {
        csv += `${row.test_code},${row.result},${row.count}\n`;
      });

      csv += '\n--- Donor Deferrals by Category ---\n';
      csv += 'Category,Type,Count\n';
      (summary.deferralsByCategory || []).forEach(row => {
        csv += `${row.category},${row.type},${row.count}\n`;
      });

      csv += '\n--- Emergency Requests Fulfillment ---\n';
      csv += 'Urgency,Status,Requests Count,Units Needed\n';
      (summary.emergencyStats || []).forEach(row => {
        csv += `${row.urgency},${row.status},${row.count},${row.total_units_needed}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=mediconnect_analytics_${Date.now()}.csv`);
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
