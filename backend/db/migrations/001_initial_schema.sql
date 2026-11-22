-- ============================================================================
-- MediConnect Database Migration 001: Initial Schema
-- Standard: 3rd Normal Form (3NF), InnoDB, UTF8MB4
-- Safe Guard: Strict Foreign Keys, Check Constraints, Row Auditability
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `mediconnect_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `mediconnect_db`;

-- 1. USERS & RBAC TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'blood_bank_staff', 'lab_technician', 'clinical_reviewer', 'donor', 'hospital_coordinator') NOT NULL,
  `department` VARCHAR(100) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. DONORS REGISTRY TABLE
CREATE TABLE IF NOT EXISTS `donors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `donor_id` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` VARCHAR(50) NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `city` VARCHAR(80) NOT NULL,
  `state` VARCHAR(80) NOT NULL,
  `total_donations` INT NOT NULL DEFAULT 0,
  `last_donation_date` DATE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_donors_blood_group` (`blood_group`),
  INDEX `idx_donors_city` (`city`),
  CONSTRAINT `fk_donors_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. DONOR CLINICAL ASSESSMENTS TABLE (DGHS & WHO Standard)
CREATE TABLE IF NOT EXISTS `donor_assessments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessment_id` VARCHAR(50) NOT NULL UNIQUE,
  `donor_id` VARCHAR(50) NOT NULL,
  `weight_kg` DECIMAL(5,2) NOT NULL,
  `hemoglobin_g_dl` DECIMAL(4,1) NOT NULL,
  `blood_pressure_sys` INT NOT NULL,
  `blood_pressure_dia` INT NOT NULL,
  `pulse_bpm` INT NOT NULL,
  `temperature_c` DECIMAL(4,1) NOT NULL,
  `travel_history_cleared` BOOLEAN NOT NULL DEFAULT FALSE,
  `high_risk_cleared` BOOLEAN NOT NULL DEFAULT FALSE,
  `medication_cleared` BOOLEAN NOT NULL DEFAULT FALSE,
  `recent_fever_symptoms` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('Eligible', 'Temporarily_Deferred', 'Permanently_Deferred', 'Under_Review') NOT NULL,
  `deferral_reason` TEXT NULL,
  `evaluator_user_id` VARCHAR(50) NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_assessment_donor` (`donor_id`),
  INDEX `idx_assessment_status` (`status`),
  CONSTRAINT `fk_assessment_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_assessment_evaluator` FOREIGN KEY (`evaluator_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. DONOR DEFERRAL REGISTRY TABLE
CREATE TABLE IF NOT EXISTS `donor_deferrals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `deferral_id` VARCHAR(50) NOT NULL UNIQUE,
  `donor_id` VARCHAR(50) NOT NULL,
  `assessment_id` VARCHAR(50) NULL,
  `type` ENUM('Temporary', 'Permanent') NOT NULL,
  `category` ENUM('Low_Hemoglobin', 'Underweight', 'Hypertension', 'Travel_Risk', 'TTI_Positive', 'Medical_Condition', 'Other') NOT NULL,
  `reason` TEXT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `authorized_by_user_id` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_deferrals_donor` (`donor_id`),
  CONSTRAINT `fk_deferrals_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_deferrals_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `donor_assessments` (`assessment_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_deferrals_authorizer` FOREIGN KEY (`authorized_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BLOOD DONATION ACCESSIONING & INVENTORY TABLE
CREATE TABLE IF NOT EXISTS `blood_donations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `unit_number` VARCHAR(50) NOT NULL UNIQUE,
  `donor_id` VARCHAR(50) NOT NULL,
  `assessment_id` VARCHAR(50) NOT NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `donation_type` ENUM('Whole Blood', 'Platelets', 'Plasma', 'RBC') NOT NULL DEFAULT 'Whole Blood',
  `bag_type` ENUM('Single', 'Double', 'Triple', 'Quadruple') NOT NULL DEFAULT 'Triple',
  `volume_ml` INT NOT NULL DEFAULT 450,
  `donation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` DATE NOT NULL,
  `location` VARCHAR(120) NOT NULL,
  `quarantine_status` ENUM('Quarantined', 'Bio_Lock', 'Pending_Review', 'Released', 'Discarded', 'Expired') NOT NULL DEFAULT 'Quarantined',
  `quarantine_reason` VARCHAR(255) NOT NULL DEFAULT 'Mandatory post-collection safety quarantine pending laboratory screening',
  `phlebotomist_user_id` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_donations_unit` (`unit_number`),
  INDEX `idx_donations_quarantine` (`quarantine_status`),
  INDEX `idx_donations_group` (`blood_group`),
  CONSTRAINT `fk_donations_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_donations_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `donor_assessments` (`assessment_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_donations_phlebotomist` FOREIGN KEY (`phlebotomist_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BLOOD COMPONENTS DERIVATION TABLE
CREATE TABLE IF NOT EXISTS `blood_components` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `component_code` VARCHAR(50) NOT NULL UNIQUE,
  `unit_number` VARCHAR(50) NOT NULL,
  `component_type` ENUM('Packed Red Blood Cells', 'Fresh Frozen Plasma', 'Platelet Concentrate', 'Cryoprecipitate') NOT NULL,
  `volume_ml` INT NOT NULL,
  `storage_temperature_c` VARCHAR(20) NOT NULL,
  `storage_location` VARCHAR(80) NOT NULL,
  `preparation_timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` TIMESTAMP NOT NULL,
  `status` ENUM('Quarantined', 'Released', 'Transfused', 'Discarded', 'Expired') NOT NULL DEFAULT 'Quarantined',
  INDEX `idx_components_unit` (`unit_number`),
  CONSTRAINT `fk_components_donation` FOREIGN KEY (`unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SCREENING TEST MASTER CATALOGUE TABLE
CREATE TABLE IF NOT EXISTS `screening_test_catalogue` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `test_code` VARCHAR(30) NOT NULL UNIQUE,
  `test_name` VARCHAR(100) NOT NULL,
  `category` ENUM('TTI_Serology', 'TTI_NAT', 'Immunohematology', 'Hematology') NOT NULL,
  `methodology` VARCHAR(100) NOT NULL,
  `is_mandatory_for_release` BOOLEAN NOT NULL DEFAULT TRUE,
  `expected_negative_value` VARCHAR(50) NOT NULL DEFAULT 'Non-Reactive',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. LABORATORY SCREENING RESULTS TABLE
CREATE TABLE IF NOT EXISTS `laboratory_test_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `result_id` VARCHAR(50) NOT NULL UNIQUE,
  `unit_number` VARCHAR(50) NOT NULL,
  `test_code` VARCHAR(30) NOT NULL,
  `result` ENUM('Pending', 'Non-Reactive', 'Reactive', 'Inconclusive', 'Invalid') NOT NULL DEFAULT 'Pending',
  `test_kit_lot` VARCHAR(60) NULL,
  `kit_expiry_date` DATE NULL,
  `instrument_id` VARCHAR(60) NULL,
  `technician_user_id` VARCHAR(50) NOT NULL,
  `performed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by_user_id` VARCHAR(50) NULL,
  `reviewed_at` TIMESTAMP NULL,
  `notes` TEXT NULL,
  INDEX `idx_lab_results_unit` (`unit_number`),
  INDEX `idx_lab_results_test` (`test_code`),
  INDEX `idx_lab_results_outcome` (`result`),
  CONSTRAINT `fk_lab_donation` FOREIGN KEY (`unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_lab_test_cat` FOREIGN KEY (`test_code`) REFERENCES `screening_test_catalogue` (`test_code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_lab_technician` FOREIGN KEY (`technician_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_lab_reviewer` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. CLINICAL REVIEWS & DISPOSITION AUTHORIZATION TABLE
CREATE TABLE IF NOT EXISTS `clinical_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `review_id` VARCHAR(50) NOT NULL UNIQUE,
  `unit_number` VARCHAR(50) NOT NULL,
  `reviewer_user_id` VARCHAR(50) NOT NULL,
  `decision` ENUM('Released', 'Quarantined', 'Discarded', 'Under_Investigation') NOT NULL,
  `notes` TEXT NOT NULL,
  `reviewed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_reviews_unit` (`unit_number`),
  CONSTRAINT `fk_reviews_donation` FOREIGN KEY (`unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_reviewer` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. CONFIDENTIAL DONOR FOLLOW-UP TABLE (Strict PII Isolation)
CREATE TABLE IF NOT EXISTS `confidential_follow_ups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` VARCHAR(50) NOT NULL UNIQUE,
  `donor_id` VARCHAR(50) NOT NULL,
  `trigger_unit_number` VARCHAR(50) NOT NULL,
  `trigger_test_code` VARCHAR(30) NOT NULL,
  `initial_finding` VARCHAR(150) NOT NULL,
  `communication_status` ENUM('Pending', 'Contacted', 'Counseling_Scheduled', 'Referred', 'Completed') NOT NULL DEFAULT 'Pending',
  `assigned_officer_user_id` VARCHAR(50) NOT NULL,
  `confidential_counseling_notes` TEXT NULL,
  `confirmatory_status` ENUM('Pending', 'Referred_to_ICTS', 'Confirmed_Positive', 'Discordant', 'Closed') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_followup_donor` (`donor_id`),
  INDEX `idx_followup_status` (`communication_status`),
  CONSTRAINT `fk_followup_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_followup_unit` FOREIGN KEY (`trigger_unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_followup_officer` FOREIGN KEY (`assigned_officer_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. BLOOD DONATION CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `campaign_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `organizer` VARCHAR(120) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `target_units` INT NOT NULL DEFAULT 100,
  `collected_units` INT NOT NULL DEFAULT 0,
  `status` ENUM('Upcoming', 'Active', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. HOSPITAL EMERGENCY BLOOD REQUESTS TABLE
CREATE TABLE IF NOT EXISTS `emergency_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `request_id` VARCHAR(50) NOT NULL UNIQUE,
  `hospital_name` VARCHAR(150) NOT NULL,
  `coordinator_user_id` VARCHAR(50) NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `units_needed` INT NOT NULL,
  `urgency` ENUM('Critical', 'Urgent', 'Normal') NOT NULL DEFAULT 'Urgent',
  `contact_person` VARCHAR(100) NOT NULL,
  `contact_phone` VARCHAR(20) NOT NULL,
  `status` ENUM('Open', 'In_Progress', 'Fulfilled', 'Cancelled') NOT NULL DEFAULT 'Open',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_requests_urgency` (`urgency`),
  CONSTRAINT `fk_requests_coordinator` FOREIGN KEY (`coordinator_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. AUDIT TRAILS & SYSTEM EVENTS LOG TABLE
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `log_id` VARCHAR(50) NOT NULL UNIQUE,
  `event_type` VARCHAR(80) NOT NULL,
  `record_id` VARCHAR(50) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `actor_user_id` VARCHAR(50) NULL,
  `actor_role` VARCHAR(50) NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `details` TEXT NOT NULL,
  INDEX `idx_audit_record` (`record_id`),
  INDEX `idx_audit_actor` (`actor_user_id`),
  INDEX `idx_audit_timestamp` (`timestamp`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
