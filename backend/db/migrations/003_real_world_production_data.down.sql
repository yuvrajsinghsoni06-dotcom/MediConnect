-- ============================================================================
-- MediConnect Database Rollback Script for Migration 003
-- Purpose: Reversibly prunes supplemental production-style records while
--          preserving original baseline seed accounts and initial data.
-- ============================================================================

USE `mediconnect_db`;

START TRANSACTION;

-- Delete supplemental audit logs
DELETE FROM `audit_logs` WHERE `log_id` IN ('LOG-2026-0005', 'LOG-2026-0006', 'LOG-2026-0007');

-- Delete supplemental confidential follow-ups
DELETE FROM `confidential_follow_ups` WHERE `case_id` = 'CFU-2026-002';

-- Delete supplemental clinical reviews
DELETE FROM `clinical_reviews` WHERE `review_id` IN ('REV-2026-1044', 'REV-2026-1310');

-- Delete supplemental laboratory test results
DELETE FROM `laboratory_test_results` WHERE `result_id` LIKE 'LAB-1044-%' 
   OR `result_id` LIKE 'LAB-1188-%' 
   OR `result_id` LIKE 'LAB-1310-%' 
   OR `result_id` LIKE 'LAB-1405-%';

-- Delete supplemental blood components
DELETE FROM `blood_components` WHERE `unit_number` IN ('DON-2026-1044', 'DON-2026-1310');

-- Delete supplemental blood donations
DELETE FROM `blood_donations` WHERE `unit_number` IN ('DON-2026-1044', 'DON-2026-1188', 'DON-2026-1250', 'DON-2026-1310', 'DON-2026-1405');

-- Delete supplemental donor deferrals
DELETE FROM `donor_deferrals` WHERE `deferral_id` = 'DEF-2026-002';

-- Delete supplemental donor assessments
DELETE FROM `donor_assessments` WHERE `assessment_id` IN ('ASM-2026-004', 'ASM-2026-005', 'ASM-2026-006', 'ASM-2026-007', 'ASM-2026-008', 'ASM-2026-009', 'ASM-2026-010');

-- Delete supplemental emergency requests
DELETE FROM `emergency_requests` WHERE `request_id` IN ('EMG-2026-03', 'EMG-2026-04', 'EMG-2026-05');

-- Delete supplemental campaigns
DELETE FROM `campaigns` WHERE `campaign_id` IN ('CMP-2026-03', 'CMP-2026-04', 'CMP-2026-05');

-- Delete supplemental donors
DELETE FROM `donors` WHERE `donor_id` IN ('DNR-2026-005', 'DNR-2026-006', 'DNR-2026-007', 'DNR-2026-008', 'DNR-2026-009', 'DNR-2026-010', 'DNR-2026-011', 'DNR-2026-012');

-- Delete supplemental users
DELETE FROM `users` WHERE `user_id` IN ('USR-BBS-002', 'USR-LAB-002', 'USR-TMO-002', 'USR-HSP-002');

COMMIT;
