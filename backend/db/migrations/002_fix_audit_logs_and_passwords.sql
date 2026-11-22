-- ============================================================================
-- MediConnect Database Migration 002: Fix Audit Logs Foreign Key & Passwords
-- Standard: Non-destructive, backward-compatible, preserves all rows
-- ============================================================================

USE `mediconnect_db`;

-- Step 1: Make actor_user_id NULLable in audit_logs so unauthenticated security events
-- (e.g., failed logins with unknown email addresses) do not violate fk_audit_actor.
-- Authenticated events continue to store the valid user_id with foreign-key enforcement.

ALTER TABLE `audit_logs` 
  DROP FOREIGN KEY `fk_audit_actor`;

ALTER TABLE `audit_logs` 
  MODIFY COLUMN `actor_user_id` VARCHAR(50) NULL;

ALTER TABLE `audit_logs` 
  ADD CONSTRAINT `fk_audit_actor` 
  FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) 
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 2: Update seeded demo accounts with verified bcrypt hash for 'Password@123'
-- ($2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K)
-- Explicitly targets demo accounts; preserves any custom or non-demo accounts.
UPDATE `users`
SET `password_hash` = '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K'
WHERE `email` IN (
  'admin@mediconnect.local',
  'staff.rohit@mediconnect.local',
  'lab.anita@mediconnect.local',
  'dr.priya.tmo@mediconnect.local',
  'rahul.donor@mediconnect.local',
  'coord.vikram@cityhospital.local',
  'inactive.user@mediconnect.local'
);
