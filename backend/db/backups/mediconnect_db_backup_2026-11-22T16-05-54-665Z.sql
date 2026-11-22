-- MediConnect Database Backup
-- Generated: 2026-11-22T16:05:54.666Z

SET FOREIGN_KEY_CHECKS=0;

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','blood_bank_staff','lab_technician','clinical_reviewer','donor','hospital_coordinator') COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users` (10 rows)
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (1, 'USR-ADM-001', 'System Administrator', 'admin@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'admin', 'IT & Health Informatics', 1, '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (2, 'USR-BBS-001', 'Staff Nurse Rohit Verma', 'staff.rohit@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'blood_bank_staff', 'Blood Bank Phlebotomy & Accessioning', 1, '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (3, 'USR-LAB-001', 'Technician Anita Rao', 'lab.anita@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'lab_technician', 'Serology & Screening Lab', 1, '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (4, 'USR-TMO-001', 'Dr. Priya Nair (TMO)', 'dr.priya.tmo@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'clinical_reviewer', 'Transfusion Medicine Quality Office', 1, '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (5, 'USR-DNR-001', 'Rahul Sharma', 'rahul.donor@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'donor', 'Community Donors', 1, '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (6, 'USR-HSP-001', 'Coordinator Vikram Seth', 'coord.vikram@cityhospital.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'hospital_coordinator', 'Apollo Emergency Transfusion Dept', 1, '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (19, 'USR-BBS-002', 'Sister Sunita Deshmukh', 'sunita.d@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'blood_bank_staff', 'Mobile Collection Van Unit 2', 1, '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (20, 'USR-LAB-002', 'Sr. Technologist Rajesh Kulkarni', 'rajesh.lab@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'lab_technician', 'NAT & Immunohematology Lab', 1, '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (21, 'USR-TMO-002', 'Dr. Arishta Mukherjee (TMO)', 'dr.mukherjee@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'clinical_reviewer', 'Apex Blood Centre Medical Board', 1, '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`, `created_at`, `updated_at`) VALUES (22, 'USR-HSP-002', 'Nurse Supervisor Deepa Menon', 'deepa.menon@aiimsdelhi.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'hospital_coordinator', 'AIIMS Trauma ICU Blood Desk', 1, '2026-11-22 15:37:06', '2026-11-22 15:37:06');

-- Table structure for table `donors`
DROP TABLE IF EXISTS `donors`;
CREATE TABLE `donors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_donations` int NOT NULL DEFAULT '0',
  `last_donation_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `donor_id` (`donor_id`),
  KEY `idx_donors_blood_group` (`blood_group`),
  KEY `idx_donors_city` (`city`),
  KEY `fk_donors_user` (`user_id`),
  CONSTRAINT `fk_donors_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `donors` (12 rows)
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (1, 'DNR-2026-001', 'USR-DNR-001', 'Rahul Sharma', 'O+', '1995-04-11 18:30:00', 'Male', '+91 98765 43210', 'rahul.donor@mediconnect.local', 'New Delhi', 'Delhi', 4, '2026-01-14 18:30:00', '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (2, 'DNR-2026-002', NULL, 'Pooja Verma', 'A+', '1998-08-21 18:30:00', 'Female', '+91 98111 22334', 'pooja.v@example.com', 'Mumbai', 'Maharashtra', 2, '2026-01-11 18:30:00', '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (3, 'DNR-2026-003', NULL, 'Amit Patel', 'B+', '1992-12-04 18:30:00', 'Male', '+91 99222 33445', 'amit.patel@example.com', 'Ahmedabad', 'Gujarat', 6, '2025-10-09 18:30:00', '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (4, 'DNR-2026-004', NULL, 'Sunita Rao', 'AB+', '2000-03-29 18:30:00', 'Female', '+91 97333 44556', 'sunita.rao@example.com', 'Bengaluru', 'Karnataka', 1, '2026-01-17 18:30:00', '2026-11-22 13:46:15', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (13, 'DNR-2026-005', NULL, 'Vikramaditya Rao', 'O-', '1988-06-13 18:30:00', 'Male', '+91 98444 55667', 'vikram.rao@synthhealth.in', 'Hyderabad', 'Telangana', 15, '2026-01-19 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (14, 'DNR-2026-006', NULL, 'Arjun K. Sengupta', 'AB-', '1994-11-08 18:30:00', 'Male', '+91 98555 66778', 'arjun.sengupta@synthhealth.in', 'Kolkata', 'West Bengal', 5, '2025-11-03 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (15, 'DNR-2026-007', NULL, 'Meenakshi Sundaram', 'B-', '1996-02-17 18:30:00', 'Female', '+91 98666 77889', 'meenakshi.s@synthhealth.in', 'Chennai', 'Tamil Nadu', 3, '2025-11-30 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (16, 'DNR-2026-008', NULL, 'Kavita Chawla', 'A-', '1997-09-24 18:30:00', 'Female', '+91 98777 88990', 'kavita.chawla@synthhealth.in', 'New Delhi', 'Delhi', 4, '2026-01-21 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (17, 'DNR-2026-009', NULL, 'Tanmay Joshi', 'O+', '1991-07-18 18:30:00', 'Male', '+91 98888 99001', 'tanmay.joshi@synthhealth.in', 'Pune', 'Maharashtra', 8, '2026-01-23 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (18, 'DNR-2026-010', NULL, 'Farhan Akhtar Qureshi', 'B+', '1993-05-14 18:30:00', 'Male', '+91 98999 00112', 'farhan.qureshi@synthhealth.in', 'Lucknow', 'Uttar Pradesh', 7, '2026-01-24 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (19, 'DNR-2026-011', NULL, 'Ananya Bhattacharya', 'A+', '2001-10-03 18:30:00', 'Female', '+91 99000 11223', 'ananya.b@synthhealth.in', 'Kolkata', 'West Bengal', 2, '2026-01-25 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `donors` (`id`, `donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`, `created_at`, `updated_at`) VALUES (20, 'DNR-2026-012', NULL, 'Girish Venkatraman', 'O+', '1985-01-29 18:30:00', 'Male', '+91 99111 22334', 'girish.v@synthhealth.in', 'Bengaluru', 'Karnataka', 12, '2026-01-26 18:30:00', '2026-11-22 15:37:06', '2026-11-22 15:37:06');

-- Table structure for table `donor_assessments`
DROP TABLE IF EXISTS `donor_assessments`;
CREATE TABLE `donor_assessments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assessment_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight_kg` decimal(5,2) NOT NULL,
  `hemoglobin_g_dl` decimal(4,1) NOT NULL,
  `blood_pressure_sys` int NOT NULL,
  `blood_pressure_dia` int NOT NULL,
  `pulse_bpm` int NOT NULL,
  `temperature_c` decimal(4,1) NOT NULL,
  `travel_history_cleared` tinyint(1) NOT NULL DEFAULT '0',
  `high_risk_cleared` tinyint(1) NOT NULL DEFAULT '0',
  `medication_cleared` tinyint(1) NOT NULL DEFAULT '0',
  `recent_fever_symptoms` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('Eligible','Temporarily_Deferred','Permanently_Deferred','Under_Review') COLLATE utf8mb4_unicode_ci NOT NULL,
  `deferral_reason` text COLLATE utf8mb4_unicode_ci,
  `evaluator_user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assessment_id` (`assessment_id`),
  KEY `idx_assessment_donor` (`donor_id`),
  KEY `idx_assessment_status` (`status`),
  KEY `fk_assessment_evaluator` (`evaluator_user_id`),
  CONSTRAINT `fk_assessment_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_assessment_evaluator` FOREIGN KEY (`evaluator_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `donor_assessments` (10 rows)
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (1, 'ASM-2026-001', 'DNR-2026-001', '72.50', '14.2', 120, 80, 72, '36.6', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-001', 'Regular voluntary donor. Clinically sound, cleared for whole blood donation.', '2026-11-22 13:46:15');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (2, 'ASM-2026-002', 'DNR-2026-002', '56.00', '12.8', 118, 76, 75, '36.8', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-001', 'First-time voluntary donor. All vital screening within approved limits.', '2026-11-22 13:46:15');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (3, 'ASM-2026-003', 'DNR-2026-003', '68.00', '11.2', 124, 82, 70, '36.5', 1, 1, 1, 0, 'Temporarily_Deferred', NULL, 'USR-BBS-001', 'Hemoglobin 11.2 g/dL is below mandatory DGHS threshold of 12.5 g/dL. Deferred for 90 days.', '2026-11-22 13:46:15');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (10, 'ASM-2026-004', 'DNR-2026-004', '58.50', '13.1', 122, 78, 74, '36.7', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-001', 'Cleared for standard whole blood collection; vein inspection normal.', '2026-11-22 15:37:06');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (11, 'ASM-2026-005', 'DNR-2026-005', '81.00', '15.6', 126, 82, 68, '36.6', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-001', 'Universal O-Negative repeat donor. Excellent physical vitals; cleared for apheresis/whole blood.', '2026-11-22 15:37:06');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (12, 'ASM-2026-006', 'DNR-2026-006', '74.00', '14.0', 130, 84, 76, '36.8', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-002', 'Rare AB-Negative donor. Physical examination satisfactory; veins bilateral prominent.', '2026-11-22 15:37:06');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (13, 'ASM-2026-007', 'DNR-2026-007', '52.00', '12.0', 110, 70, 72, '36.5', 1, 1, 1, 0, 'Temporarily_Deferred', NULL, 'USR-BBS-002', 'Hemoglobin 12.0 g/dL below statutory cutoff (12.5 g/dL). Dietary counseling provided, deferred 90 days.', '2026-11-22 15:37:06');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (14, 'ASM-2026-008', 'DNR-2026-008', '54.50', '13.4', 116, 74, 70, '36.6', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-001', 'Rare A-Negative donor. Fit for whole blood donation.', '2026-11-22 15:37:06');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (15, 'ASM-2026-009', 'DNR-2026-009', '76.00', '14.8', 128, 80, 72, '36.7', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-001', 'Regular voluntary whole blood donor; clinically eligible.', '2026-11-22 15:37:06');
INSERT INTO `donor_assessments` (`id`, `assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `deferral_reason`, `evaluator_user_id`, `notes`, `created_at`) VALUES (16, 'ASM-2026-010', 'DNR-2026-010', '70.00', '14.5', 122, 78, 68, '36.5', 1, 1, 1, 0, 'Eligible', NULL, 'USR-BBS-002', 'Cleared for 450 mL whole blood collection in quadruple blood bag.', '2026-11-22 15:37:06');

-- Table structure for table `donor_deferrals`
DROP TABLE IF EXISTS `donor_deferrals`;
CREATE TABLE `donor_deferrals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deferral_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assessment_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('Temporary','Permanent') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Low_Hemoglobin','Underweight','Hypertension','Travel_Risk','TTI_Positive','Medical_Condition','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `authorized_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `deferral_id` (`deferral_id`),
  KEY `idx_deferrals_donor` (`donor_id`),
  KEY `fk_deferrals_assessment` (`assessment_id`),
  KEY `fk_deferrals_authorizer` (`authorized_by_user_id`),
  CONSTRAINT `fk_deferrals_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `donor_assessments` (`assessment_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_deferrals_authorizer` FOREIGN KEY (`authorized_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_deferrals_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `donor_deferrals` (2 rows)
INSERT INTO `donor_deferrals` (`id`, `deferral_id`, `donor_id`, `assessment_id`, `type`, `category`, `reason`, `start_date`, `end_date`, `authorized_by_user_id`, `created_at`) VALUES (1, 'DEF-2026-001', 'DNR-2026-003', 'ASM-2026-003', 'Temporary', 'Low_Hemoglobin', 'Hemoglobin 11.2 g/dL below DGHS 12.5 g/dL statutory threshold', '2026-01-14 18:30:00', '2026-04-14 18:30:00', 'USR-BBS-001', '2026-11-22 13:46:15');
INSERT INTO `donor_deferrals` (`id`, `deferral_id`, `donor_id`, `assessment_id`, `type`, `category`, `reason`, `start_date`, `end_date`, `authorized_by_user_id`, `created_at`) VALUES (4, 'DEF-2026-002', 'DNR-2026-007', 'ASM-2026-007', 'Temporary', 'Low_Hemoglobin', 'Hemoglobin 12.0 g/dL below statutory minimum (12.5 g/dL); iron therapy suggested', '2026-01-19 18:30:00', '2026-04-19 18:30:00', 'USR-BBS-002', '2026-11-22 15:37:06');

-- Table structure for table `blood_donations`
DROP TABLE IF EXISTS `blood_donations`;
CREATE TABLE `blood_donations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assessment_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') COLLATE utf8mb4_unicode_ci NOT NULL,
  `donation_type` enum('Whole Blood','Platelets','Plasma','RBC') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Whole Blood',
  `bag_type` enum('Single','Double','Triple','Quadruple') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Triple',
  `volume_ml` int NOT NULL DEFAULT '450',
  `donation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` date NOT NULL,
  `location` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quarantine_status` enum('Quarantined','Bio_Lock','Pending_Review','Released','Discarded','Expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Quarantined',
  `quarantine_reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Mandatory post-collection safety quarantine pending laboratory screening',
  `phlebotomist_user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_number` (`unit_number`),
  KEY `idx_donations_unit` (`unit_number`),
  KEY `idx_donations_quarantine` (`quarantine_status`),
  KEY `idx_donations_group` (`blood_group`),
  KEY `fk_donations_donor` (`donor_id`),
  KEY `fk_donations_assessment` (`assessment_id`),
  KEY `fk_donations_phlebotomist` (`phlebotomist_user_id`),
  CONSTRAINT `fk_donations_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `donor_assessments` (`assessment_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_donations_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_donations_phlebotomist` FOREIGN KEY (`phlebotomist_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `blood_donations` (8 rows)
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (1, 'DON-2026-0619', 'DNR-2026-001', 'ASM-2026-001', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-10 04:45:00', '2026-02-13 18:30:00', 'Main Blood Centre - Phlebotomy Bay 1', 'Released', 'Fully screened negative and clinically authorized for release', 'USR-BBS-001', '2026-11-22 13:46:15', '2026-11-22 13:46:15');
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (2, 'DON-2026-0742', 'DNR-2026-002', 'ASM-2026-002', 'A+', 'Whole Blood', 'Triple', 450, '2026-01-12 06:00:00', '2026-02-15 18:30:00', 'Main Blood Centre - Phlebotomy Bay 2', 'Bio_Lock', 'BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (HCV)', 'USR-BBS-001', '2026-11-22 13:46:15', '2026-11-22 13:46:15');
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (3, 'DON-2026-0891', 'DNR-2026-001', 'ASM-2026-001', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-15 04:15:00', '2026-02-18 18:30:00', 'Main Blood Centre - Phlebotomy Bay 1', 'Quarantined', 'Mandatory post-collection safety quarantine pending laboratory screening', 'USR-BBS-001', '2026-11-22 13:46:15', '2026-11-22 13:46:15');
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (10, 'DON-2026-1044', 'DNR-2026-005', 'ASM-2026-005', 'O-', 'Whole Blood', 'Quadruple', 450, '2026-01-20 08:30:00', '2026-02-23 18:30:00', 'Apex Trauma Blood Centre - Apheresis Suite', 'Released', 'Universal O-Negative cleared and released for emergency trauma reserve', 'USR-BBS-001', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (11, 'DON-2026-1188', 'DNR-2026-006', 'ASM-2026-006', 'AB-', 'Whole Blood', 'Triple', 450, '2026-01-22 05:00:00', '2026-02-25 18:30:00', 'Rotary Camp Mobile Van 1', 'Pending_Review', 'All 5 mandatory TTI tests Non-Reactive; pending final TMO clinical sign-off', 'USR-BBS-002', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (12, 'DON-2026-1250', 'DNR-2026-008', 'ASM-2026-008', 'A-', 'Whole Blood', 'Triple', 450, '2026-01-23 05:45:00', '2026-02-26 18:30:00', 'Main Blood Centre - Phlebotomy Bay 2', 'Quarantined', 'Mandatory post-collection safety quarantine pending laboratory screening', 'USR-BBS-001', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (13, 'DON-2026-1310', 'DNR-2026-009', 'ASM-2026-009', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-24 10:15:00', '2026-02-27 18:30:00', 'AIIMS Camp Collection Bay A', 'Released', 'Fully screened negative and clinically authorized for release', 'USR-BBS-001', '2026-11-22 15:37:06', '2026-11-22 15:37:06');
INSERT INTO `blood_donations` (`id`, `unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`, `created_at`, `updated_at`) VALUES (14, 'DON-2026-1405', 'DNR-2026-010', 'ASM-2026-010', 'B+', 'Whole Blood', 'Triple', 450, '2026-01-25 06:30:00', '2026-02-28 18:30:00', 'KEM Blood Centre - Station 3', 'Bio_Lock', 'BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (HBsAg)', 'USR-BBS-002', '2026-11-22 15:37:06', '2026-11-22 15:37:06');

-- Table structure for table `blood_components`
DROP TABLE IF EXISTS `blood_components`;
CREATE TABLE `blood_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `component_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `component_type` enum('Packed Red Blood Cells','Fresh Frozen Plasma','Platelet Concentrate','Cryoprecipitate') COLLATE utf8mb4_unicode_ci NOT NULL,
  `volume_ml` int NOT NULL,
  `storage_temperature_c` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage_location` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preparation_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` timestamp NOT NULL,
  `status` enum('Quarantined','Released','Transfused','Discarded','Expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Quarantined',
  PRIMARY KEY (`id`),
  UNIQUE KEY `component_code` (`component_code`),
  KEY `idx_components_unit` (`unit_number`),
  CONSTRAINT `fk_components_donation` FOREIGN KEY (`unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `blood_components` (10 rows)
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (4, 'PRBC-2026-0619', 'DON-2026-0619', 'Packed Red Blood Cells', 280, '2-6°C', 'Cold Room B - Shelf 3', '2026-01-10 08:30:00', '2026-02-21 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (5, 'FFP-2026-0619', 'DON-2026-0619', 'Fresh Frozen Plasma', 200, '-30°C or colder', 'Deep Freezer D1 - Rack 2', '2026-01-10 09:00:00', '2027-01-10 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (6, 'PLT-2026-0619', 'DON-2026-0619', 'Platelet Concentrate', 55, '20-24°C with agitation', 'Platelet Agitator A - Tray 1', '2026-01-10 09:15:00', '2026-01-15 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (10, 'PRBC-2026-1044', 'DON-2026-1044', 'Packed Red Blood Cells', 290, '2-6°C', 'Cold Room Emergency Reserve - Shelf 1', '2026-01-20 11:30:00', '2026-02-24 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (11, 'FFP-2026-1044', 'DON-2026-1044', 'Fresh Frozen Plasma', 210, '-30°C or colder', 'Deep Freezer D2 - Rack 1', '2026-01-20 11:50:00', '2027-01-20 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (12, 'PLT-2026-1044', 'DON-2026-1044', 'Platelet Concentrate', 60, '20-24°C with agitation', 'Platelet Agitator B - Tray 2', '2026-01-20 12:05:00', '2026-01-25 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (13, 'CRYO-2026-1044', 'DON-2026-1044', 'Cryoprecipitate', 20, '-30°C or colder', 'Deep Freezer CryoBox 1', '2026-01-20 12:30:00', '2027-01-20 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (14, 'PRBC-2026-1310', 'DON-2026-1310', 'Packed Red Blood Cells', 285, '2-6°C', 'Cold Room B - Shelf 4', '2026-01-24 12:30:00', '2026-02-28 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (15, 'FFP-2026-1310', 'DON-2026-1310', 'Fresh Frozen Plasma', 205, '-30°C or colder', 'Deep Freezer D1 - Rack 3', '2026-01-24 13:00:00', '2027-01-24 18:29:59', 'Released');
INSERT INTO `blood_components` (`id`, `component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES (16, 'PLT-2026-1310', 'DON-2026-1310', 'Platelet Concentrate', 58, '20-24°C with agitation', 'Platelet Agitator A - Tray 3', '2026-01-24 13:15:00', '2026-01-29 18:29:59', 'Released');

-- Table structure for table `screening_test_catalogue`
DROP TABLE IF EXISTS `screening_test_catalogue`;
CREATE TABLE `screening_test_catalogue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `test_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('TTI_Serology','TTI_NAT','Immunohematology','Hematology') COLLATE utf8mb4_unicode_ci NOT NULL,
  `methodology` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_mandatory_for_release` tinyint(1) NOT NULL DEFAULT '1',
  `expected_negative_value` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Non-Reactive',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `test_code` (`test_code`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `screening_test_catalogue` (6 rows)
INSERT INTO `screening_test_catalogue` (`id`, `test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`, `created_at`) VALUES (1, 'HIV', 'HIV-1/2 4th Gen Ag/Ab Combo', 'TTI_Serology', 'Chemiluminescent Microparticle Immunoassay (CMIA)', 1, 'Non-Reactive', '2026-11-22 13:46:15');
INSERT INTO `screening_test_catalogue` (`id`, `test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`, `created_at`) VALUES (2, 'HBSAG', 'Hepatitis B Surface Antigen (HBsAg)', 'TTI_Serology', 'Chemiluminescence Immunoassay (CLIA)', 1, 'Non-Reactive', '2026-11-22 13:46:15');
INSERT INTO `screening_test_catalogue` (`id`, `test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`, `created_at`) VALUES (3, 'HCV', 'Hepatitis C Virus Antibody (Anti-HCV)', 'TTI_Serology', '3rd Gen Microplate ELISA', 1, 'Non-Reactive', '2026-11-22 13:46:15');
INSERT INTO `screening_test_catalogue` (`id`, `test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`, `created_at`) VALUES (4, 'SYPHILIS', 'Treponema pallidum Hemagglutination (TPHA)', 'TTI_Serology', 'TPHA / RPR Syphilis Screen', 1, 'Non-Reactive', '2026-11-22 13:46:15');
INSERT INTO `screening_test_catalogue` (`id`, `test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`, `created_at`) VALUES (5, 'MALARIA', 'Malaria Parasite Antigen (Pan/Pf)', 'TTI_Serology', 'Rapid Immunochromatographic Strip & Blood Smear', 1, 'Non-Reactive', '2026-11-22 13:46:15');
INSERT INTO `screening_test_catalogue` (`id`, `test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`, `created_at`) VALUES (6, 'ABO_RH', 'Blood Group & Rh(D) Confirmation', 'Immunohematology', 'Forward & Reverse Tube Agglutination', 1, 'Confirmed', '2026-11-22 13:46:15');

-- Table structure for table `laboratory_test_results`
DROP TABLE IF EXISTS `laboratory_test_results`;
CREATE TABLE `laboratory_test_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `result_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `test_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `result` enum('Pending','Non-Reactive','Reactive','Inconclusive','Invalid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `test_kit_lot` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kit_expiry_date` date DEFAULT NULL,
  `instrument_id` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `technician_user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `performed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `result_id` (`result_id`),
  KEY `idx_lab_results_unit` (`unit_number`),
  KEY `idx_lab_results_test` (`test_code`),
  KEY `idx_lab_results_outcome` (`result`),
  KEY `fk_lab_technician` (`technician_user_id`),
  KEY `fk_lab_reviewer` (`reviewed_by_user_id`),
  CONSTRAINT `fk_lab_donation` FOREIGN KEY (`unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_lab_reviewer` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_lab_technician` FOREIGN KEY (`technician_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_lab_test_cat` FOREIGN KEY (`test_code`) REFERENCES `screening_test_catalogue` (`test_code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `laboratory_test_results` (35 rows)
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (1, 'LAB-0619-HIV', 'DON-2026-0619', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-11 04:30:00', 'CMIA Non-reactive S/CO 0.08');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (2, 'LAB-0619-HBS', 'DON-2026-0619', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-11 04:30:00', 'HBsAg Non-reactive 0.12 IU/mL');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (3, 'LAB-0619-HCV', 'DON-2026-0619', 'HCV', 'Non-Reactive', 'LOT-HCV-2026B', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-11 04:30:00', 'ELISA optical density 0.04 (cutoff 0.20)');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (4, 'LAB-0619-SYP', 'DON-2026-0619', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-11 04:30:00', 'TPHA Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (5, 'LAB-0619-MAL', 'DON-2026-0619', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-11 04:30:00', 'Antigen rapid strip negative; smear clear');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (6, 'LAB-0742-HIV', 'DON-2026-0742', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-13 08:30:00', 'Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (7, 'LAB-0742-HBS', 'DON-2026-0742', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-13 08:30:00', 'Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (8, 'LAB-0742-HCV', 'DON-2026-0742', 'HCV', 'Reactive', 'LOT-HCV-2026B', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-13 08:30:00', 'INITIAL REACTIVE ELISA (S/CO 3.42). Unit placed under Bio-Lock.');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (9, 'LAB-0742-SYP', 'DON-2026-0742', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-13 08:30:00', 'Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (10, 'LAB-0742-MAL', 'DON-2026-0742', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', 'USR-TMO-001', '2026-01-13 08:30:00', 'Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (11, 'LAB-0891-HIV', 'DON-2026-0891', 'HIV', 'Pending', NULL, NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', NULL, NULL, 'Specimen accessioned in serology batch B26-101');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (12, 'LAB-0891-HBS', 'DON-2026-0891', 'HBSAG', 'Pending', NULL, NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', NULL, NULL, 'Specimen accessioned in serology batch B26-101');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (13, 'LAB-0891-HCV', 'DON-2026-0891', 'HCV', 'Pending', NULL, NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', NULL, NULL, 'Specimen accessioned in serology batch B26-101');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (14, 'LAB-0891-SYP', 'DON-2026-0891', 'SYPHILIS', 'Pending', NULL, NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', NULL, NULL, 'Specimen accessioned in serology batch B26-101');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (15, 'LAB-0891-MAL', 'DON-2026-0891', 'MALARIA', 'Pending', NULL, NULL, NULL, 'USR-LAB-001', '2026-11-22 13:54:33', NULL, NULL, 'Specimen accessioned in serology batch B26-101');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (31, 'LAB-1044-HIV', 'DON-2026-1044', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-21 06:00:00', 'CMIA Non-reactive S/CO 0.05; ID-NAT negative');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (32, 'LAB-1044-HBS', 'DON-2026-1044', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-21 06:00:00', 'CLIA HBsAg 0.04 IU/mL; ID-NAT negative');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (33, 'LAB-1044-HCV', 'DON-2026-1044', 'HCV', 'Non-Reactive', 'LOT-HCV-2026B', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-21 06:00:00', 'ELISA OD 0.03 (Cutoff 0.20); ID-NAT negative');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (34, 'LAB-1044-SYP', 'DON-2026-1044', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-21 06:00:00', 'TPHA Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (35, 'LAB-1044-MAL', 'DON-2026-1044', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-21 06:00:00', 'Pan/Pf Rapid Strip negative; thin/thick film negative');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (36, 'LAB-1188-HIV', 'DON-2026-1188', 'HIV', 'Non-Reactive', 'LOT-HIV-2026B', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', NULL, NULL, 'CMIA S/CO 0.07 Non-Reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (37, 'LAB-1188-HBS', 'DON-2026-1188', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026D', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', NULL, NULL, 'CLIA 0.09 IU/mL Non-Reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (38, 'LAB-1188-HCV', 'DON-2026-1188', 'HCV', 'Non-Reactive', 'LOT-HCV-2026C', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', NULL, NULL, 'ELISA OD 0.05 Non-Reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (39, 'LAB-1188-SYP', 'DON-2026-1188', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026Y', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', NULL, NULL, 'TPHA Non-Reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (40, 'LAB-1188-MAL', 'DON-2026-1188', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026N', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', NULL, NULL, 'Antigen negative');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (41, 'LAB-1310-HIV', 'DON-2026-1310', 'HIV', 'Non-Reactive', 'LOT-HIV-2026B', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-25 04:30:00', 'CMIA Non-reactive S/CO 0.06');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (42, 'LAB-1310-HBS', 'DON-2026-1310', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026D', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-25 04:30:00', 'HBsAg Non-reactive 0.07 IU/mL');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (43, 'LAB-1310-HCV', 'DON-2026-1310', 'HCV', 'Non-Reactive', 'LOT-HCV-2026C', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-25 04:30:00', 'ELISA OD 0.04 Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (44, 'LAB-1310-SYP', 'DON-2026-1310', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026Y', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-25 04:30:00', 'TPHA Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (45, 'LAB-1310-MAL', 'DON-2026-1310', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026N', NULL, NULL, 'USR-LAB-001', '2026-11-22 15:37:06', 'USR-TMO-001', '2026-01-25 04:30:00', 'Pan/Pf Rapid Strip negative');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (46, 'LAB-1405-HIV', 'DON-2026-1405', 'HIV', 'Non-Reactive', 'LOT-HIV-2026B', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-002', '2026-01-26 08:30:00', 'Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (47, 'LAB-1405-HBS', 'DON-2026-1405', 'HBSAG', 'Reactive', 'LOT-HBS-2026D', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-002', '2026-01-26 08:30:00', 'INITIAL REACTIVE HBsAg (CLIA 4.20 IU/mL). Bio-Lock quarantine engaged.');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (48, 'LAB-1405-HCV', 'DON-2026-1405', 'HCV', 'Non-Reactive', 'LOT-HCV-2026C', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-002', '2026-01-26 08:30:00', 'Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (49, 'LAB-1405-SYP', 'DON-2026-1405', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026Y', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-002', '2026-01-26 08:30:00', 'Non-reactive');
INSERT INTO `laboratory_test_results` (`id`, `result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `kit_expiry_date`, `instrument_id`, `technician_user_id`, `performed_at`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES (50, 'LAB-1405-MAL', 'DON-2026-1405', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026N', NULL, NULL, 'USR-LAB-002', '2026-11-22 15:37:06', 'USR-TMO-002', '2026-01-26 08:30:00', 'Non-reactive');

-- Table structure for table `clinical_reviews`
DROP TABLE IF EXISTS `clinical_reviews`;
CREATE TABLE `clinical_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewer_user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `decision` enum('Released','Quarantined','Discarded','Under_Investigation') COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `review_id` (`review_id`),
  KEY `idx_reviews_unit` (`unit_number`),
  KEY `fk_reviews_reviewer` (`reviewer_user_id`),
  CONSTRAINT `fk_reviews_donation` FOREIGN KEY (`unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_reviewer` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `clinical_reviews` (3 rows)
INSERT INTO `clinical_reviews` (`id`, `review_id`, `unit_number`, `reviewer_user_id`, `decision`, `notes`, `reviewed_at`) VALUES (1, 'REV-2026-0619', 'DON-2026-0619', 'USR-TMO-001', 'Released', 'All 5 mandatory TTI screening tests verified non-reactive. ABO/Rh grouping double-checked. Temperature and storage integrity validated. Authorized for clinical release.', '2026-11-22 13:54:33');
INSERT INTO `clinical_reviews` (`id`, `review_id`, `unit_number`, `reviewer_user_id`, `decision`, `notes`, `reviewed_at`) VALUES (3, 'REV-2026-1044', 'DON-2026-1044', 'USR-TMO-001', 'Released', 'Universal O-Negative unit verified 100% Non-Reactive across serology panel and ID-NAT. Critical trauma release authorized.', '2026-11-22 15:37:06');
INSERT INTO `clinical_reviews` (`id`, `review_id`, `unit_number`, `reviewer_user_id`, `decision`, `notes`, `reviewed_at`) VALUES (4, 'REV-2026-1310', 'DON-2026-1310', 'USR-TMO-001', 'Released', 'Complete non-reactive panel verified. Cell and serum ABO/Rh concordant. Component split validated and approved for general inventory release.', '2026-11-22 15:37:06');

-- Table structure for table `emergency_requests`
DROP TABLE IF EXISTS `emergency_requests`;
CREATE TABLE `emergency_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hospital_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coordinator_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') COLLATE utf8mb4_unicode_ci NOT NULL,
  `units_needed` int NOT NULL,
  `urgency` enum('Critical','Urgent','Normal') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Urgent',
  `contact_person` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Open','In_Progress','Fulfilled','Cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Open',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`),
  KEY `idx_requests_urgency` (`urgency`),
  KEY `fk_requests_coordinator` (`coordinator_user_id`),
  CONSTRAINT `fk_requests_coordinator` FOREIGN KEY (`coordinator_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `emergency_requests` (5 rows)
INSERT INTO `emergency_requests` (`id`, `request_id`, `hospital_name`, `coordinator_user_id`, `blood_group`, `units_needed`, `urgency`, `contact_person`, `contact_phone`, `status`, `created_at`) VALUES (1, 'EMG-2026-01', 'Apollo Hospital Trauma ICU', 'USR-HSP-001', 'O+', 4, 'Critical', 'Dr. Vikram Seth', '+91 98765 11223', 'In_Progress', '2026-11-22 13:54:33');
INSERT INTO `emergency_requests` (`id`, `request_id`, `hospital_name`, `coordinator_user_id`, `blood_group`, `units_needed`, `urgency`, `contact_person`, `contact_phone`, `status`, `created_at`) VALUES (2, 'EMG-2026-02', 'Max Healthcare Cardiac OT', NULL, 'AB-', 2, 'Urgent', 'Nurse Supervisor Deepa', '+91 98111 44556', 'Open', '2026-11-22 13:54:33');
INSERT INTO `emergency_requests` (`id`, `request_id`, `hospital_name`, `coordinator_user_id`, `blood_group`, `units_needed`, `urgency`, `contact_person`, `contact_phone`, `status`, `created_at`) VALUES (5, 'EMG-2026-03', 'AIIMS Trauma Resuscitation Bay', 'USR-HSP-002', 'O-', 6, 'Critical', 'Dr. Alok Nath (Trauma Surgeon)', '+91 98222 55667', 'In_Progress', '2026-11-22 15:37:06');
INSERT INTO `emergency_requests` (`id`, `request_id`, `hospital_name`, `coordinator_user_id`, `blood_group`, `units_needed`, `urgency`, `contact_person`, `contact_phone`, `status`, `created_at`) VALUES (6, 'EMG-2026-04', 'King Edward Memorial Pediatric Thalassemia Unit', NULL, 'B+', 5, 'Urgent', 'Dr. S. K. Kadam', '+91 98333 66778', 'Open', '2026-11-22 15:37:06');
INSERT INTO `emergency_requests` (`id`, `request_id`, `hospital_name`, `coordinator_user_id`, `blood_group`, `units_needed`, `urgency`, `contact_person`, `contact_phone`, `status`, `created_at`) VALUES (7, 'EMG-2026-05', 'Fortis Memorial Obstetrics Acute Wing', NULL, 'A+', 3, 'Normal', 'Sister In-Charge Mary', '+91 98444 77889', 'Fulfilled', '2026-11-22 15:37:06');

-- Table structure for table `campaigns`
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organizer` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `target_units` int NOT NULL DEFAULT '100',
  `collected_units` int NOT NULL DEFAULT '0',
  `status` enum('Upcoming','Active','Completed','Cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Upcoming',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `campaign_id` (`campaign_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `campaigns` (5 rows)
INSERT INTO `campaigns` (`id`, `campaign_id`, `title`, `organizer`, `location`, `date`, `start_time`, `end_time`, `target_units`, `collected_units`, `status`, `description`, `created_at`) VALUES (1, 'CMP-2026-01', 'AIIMS Annual National Voluntary Blood Drive', 'Rotary Club Delhi & AIIMS', 'AIIMS Main Auditorium Complex, Ansari Nagar, New Delhi', '2026-02-14 18:30:00', '09:00:00', '17:00:00', 150, 185, 'Completed', 'Annual community blood collection camp in collaboration with AIIMS Blood Centre.', '2026-11-22 13:54:33');
INSERT INTO `campaigns` (`id`, `campaign_id`, `title`, `organizer`, `location`, `date`, `start_time`, `end_time`, `target_units`, `collected_units`, `status`, `description`, `created_at`) VALUES (2, 'CMP-2026-02', 'Indian Red Cross Youth Solidarity Blood Camp', 'Indian Red Cross Society', 'Town Hall Historical Grounds, Fort, Mumbai', '2026-02-27 18:30:00', '10:00:00', '16:00:00', 100, 142, 'Completed', 'Youth-oriented voluntary blood drive to support pediatric thalassemia transfusion units.', '2026-11-22 13:54:33');
INSERT INTO `campaigns` (`id`, `campaign_id`, `title`, `organizer`, `location`, `date`, `start_time`, `end_time`, `target_units`, `collected_units`, `status`, `description`, `created_at`) VALUES (5, 'CMP-2026-03', 'Bengaluru IT Corridor LifeSavers Drive', 'Whitefield Healthcare Coalition & Narayana Health', 'EcoWorld Convention Center, Outer Ring Road, Bengaluru', '2026-12-27 18:30:00', '10:00:00', '18:00:00', 200, 78, 'Active', 'Corporate community solidarity drive replenishing southern regional blood repository supplies.', '2026-11-22 15:37:06');
INSERT INTO `campaigns` (`id`, `campaign_id`, `title`, `organizer`, `location`, `date`, `start_time`, `end_time`, `target_units`, `collected_units`, `status`, `description`, `created_at`) VALUES (6, 'CMP-2026-04', 'Hyderabad Mega University Voluntary Blood Fest', 'National Service Scheme (NSS) & Osmania Blood Centre', 'University Assembly Pavilion, Amberpet, Hyderabad', '2027-01-11 18:30:00', '08:30:00', '15:30:00', 150, 0, 'Upcoming', 'Collegiate awareness campaign educating first-time donors on voluntary repeat donation and thalassemia prevention.', '2026-11-22 15:37:06');
INSERT INTO `campaigns` (`id`, `campaign_id`, `title`, `organizer`, `location`, `date`, `start_time`, `end_time`, `target_units`, `collected_units`, `status`, `description`, `created_at`) VALUES (7, 'CMP-2026-05', 'Apex Trauma Center Emergency Preparedness Drive', 'King Edward Memorial Hospital & Red Cross', 'KEM Hospital Gymnasium Grounds, Parel, Mumbai', '2027-01-19 18:30:00', '09:00:00', '17:00:00', 220, 0, 'Upcoming', 'Targeted whole blood collection drive preparing reserve inventory for state highway emergency response centers.', '2026-11-22 15:37:06');

-- Table structure for table `confidential_follow_ups`
DROP TABLE IF EXISTS `confidential_follow_ups`;
CREATE TABLE `confidential_follow_ups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `case_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trigger_unit_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trigger_test_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `initial_finding` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `communication_status` enum('Pending','Contacted','Counseling_Scheduled','Referred','Completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `assigned_officer_user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `confidential_counseling_notes` text COLLATE utf8mb4_unicode_ci,
  `confirmatory_status` enum('Pending','Referred_to_ICTS','Confirmed_Positive','Discordant','Closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `case_id` (`case_id`),
  KEY `idx_followup_donor` (`donor_id`),
  KEY `idx_followup_status` (`communication_status`),
  KEY `fk_followup_unit` (`trigger_unit_number`),
  KEY `fk_followup_officer` (`assigned_officer_user_id`),
  CONSTRAINT `fk_followup_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_followup_officer` FOREIGN KEY (`assigned_officer_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_followup_unit` FOREIGN KEY (`trigger_unit_number`) REFERENCES `blood_donations` (`unit_number`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `confidential_follow_ups` (2 rows)
INSERT INTO `confidential_follow_ups` (`id`, `case_id`, `donor_id`, `trigger_unit_number`, `trigger_test_code`, `initial_finding`, `communication_status`, `assigned_officer_user_id`, `confidential_counseling_notes`, `confirmatory_status`, `created_at`, `updated_at`) VALUES (1, 'CFU-2026-001', 'DNR-2026-002', 'DON-2026-0742', 'HCV', 'Reactive Hepatitis C antibody on routine screening (ELISA S/CO 3.42)', 'Counseling_Scheduled', 'USR-TMO-001', 'Donor contacted by Medical Officer via private phone call. In-person confidential pre-test/counseling appointment scheduled at blood centre clinic.', 'Referred_to_ICTS', '2026-11-22 13:54:33', '2026-11-22 13:54:33');
INSERT INTO `confidential_follow_ups` (`id`, `case_id`, `donor_id`, `trigger_unit_number`, `trigger_test_code`, `initial_finding`, `communication_status`, `assigned_officer_user_id`, `confidential_counseling_notes`, `confirmatory_status`, `created_at`, `updated_at`) VALUES (3, 'CFU-2026-002', 'DNR-2026-010', 'DON-2026-1405', 'HBSAG', 'Reactive HBsAg surface antigen on routine chemiluminescence (CLIA 4.20 IU/mL)', 'Contacted', 'USR-TMO-002', 'Confidential letter dispatched via registered post marked confidential. Telephonic verification confirmed donor attendance for repeat confirmatory testing.', 'Pending', '2026-11-22 15:37:06', '2026-11-22 15:37:06');

-- Table structure for table `audit_logs`
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `log_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `record_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actor_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `details` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `log_id` (`log_id`),
  KEY `idx_audit_record` (`record_id`),
  KEY `idx_audit_actor` (`actor_user_id`),
  KEY `idx_audit_timestamp` (`timestamp`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `audit_logs` (22 rows)
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (1, 'LOG-2026-0001', 'DONATION_ACCESSIONED', 'DON-2026-0619', 'blood_donations', 'USR-BBS-001', 'blood_bank_staff', NULL, '2026-11-22 13:54:33', 'Donation unit collected and placed in Quarantined status pending screening');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (2, 'LOG-2026-0002', 'LAB_RESULT_RECORDED', 'LAB-0619-HIV', 'laboratory_test_results', 'USR-LAB-001', 'lab_technician', NULL, '2026-11-22 13:54:33', 'HIV test result entered as Non-Reactive');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (3, 'LOG-2026-0003', 'CLINICAL_DISPOSITION_APPROVED', 'DON-2026-0619', 'blood_donations', 'USR-TMO-001', 'clinical_reviewer', NULL, '2026-11-22 13:54:33', 'Unit DON-2026-0619 authorized for release. All mandatory 5 TTI tests verified Non-Reactive.');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (4, 'LOG-2026-0004', 'QUARANTINE_BIO_LOCK_ENGAGED', 'DON-2026-0742', 'blood_donations', 'USR-LAB-001', 'lab_technician', NULL, '2026-11-22 13:54:33', 'Automatic Bio-Lock triggered on unit DON-2026-0742 following Reactive HCV result');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (12, 'LOG-MWRWXPA5-285', 'LOGIN_FAILED', 'USR-TMO-001', 'users', 'USR-TMO-001', 'clinical_reviewer', '::1', '2026-11-22 14:09:11', '{"email":"dr.priya.tmo@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (13, 'LOG-MWRWXSS0-694', 'LOGIN_FAILED', 'USR-TMO-001', 'users', 'USR-TMO-001', 'clinical_reviewer', '::1', '2026-11-22 14:09:16', '{"email":"dr.priya.tmo@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (14, 'LOG-MWRYNO7K-120', 'LOGIN_FAILED', 'USR-TMO-001', 'users', 'USR-TMO-001', 'clinical_reviewer', '::1', '2026-11-22 14:57:23', '{"email":"dr.priya.tmo@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (15, 'LOG-MWRYOVDX-838', 'LOGIN_FAILED', 'USR-ADM-001', 'users', 'USR-ADM-001', 'admin', '::1', '2026-11-22 14:58:18', '{"email":"admin@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (16, 'LOG-MWRYQB84-449', 'LOGIN_FAILED', 'USR-ADM-001', 'users', 'USR-ADM-001', 'admin', '::1', '2026-11-22 14:59:26', '{"email":"admin@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (17, 'LOG-MWRZ8NS5-711', 'USER_LOGIN', 'USR-ADM-001', 'users', 'USR-ADM-001', 'admin', '::1', '2026-11-22 15:13:42', '{"email":"admin@mediconnect.local","role":"admin"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (18, 'LOG-MWRZRKA2-304', 'LOGIN_FAILED', 'USR-LAB-001', 'users', 'USR-LAB-001', 'lab_technician', '::1', '2026-11-22 15:28:24', '{"email":"lab.anita@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (19, 'LOG-MWRZSAPR-61', 'LOGIN_FAILED', 'USR-LAB-001', 'users', 'USR-LAB-001', 'lab_technician', '::1', '2026-11-22 15:28:58', '{"email":"lab.anita@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (20, 'LOG-MWRZSBAC-725', 'LOGIN_FAILED', 'USR-LAB-001', 'users', 'USR-LAB-001', 'lab_technician', '::1', '2026-11-22 15:28:59', '{"email":"lab.anita@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (21, 'LOG-MWRZSBU7-130', 'LOGIN_FAILED', 'USR-LAB-001', 'users', 'USR-LAB-001', 'lab_technician', '::1', '2026-11-22 15:28:59', '{"email":"lab.anita@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (22, 'LOG-MWRZSC76-294', 'LOGIN_FAILED', 'USR-LAB-001', 'users', 'USR-LAB-001', 'lab_technician', '::1', '2026-11-22 15:29:00', '{"email":"lab.anita@mediconnect.local","reason":"Password mismatch"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (23, 'LOG-2026-0005', 'CLINICAL_DISPOSITION_APPROVED', 'DON-2026-1044', 'blood_donations', 'USR-TMO-001', 'clinical_reviewer', NULL, '2026-11-22 15:37:06', 'Universal O-Negative unit DON-2026-1044 released for emergency trauma reserve.');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (24, 'LOG-2026-0006', 'QUARANTINE_BIO_LOCK_ENGAGED', 'DON-2026-1405', 'blood_donations', 'USR-LAB-002', 'lab_technician', NULL, '2026-11-22 15:37:06', 'Automatic Bio-Lock triggered on unit DON-2026-1405 following Reactive HBsAg result');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (25, 'LOG-2026-0007', 'EMERGENCY_REQUEST_RECEIVED', 'EMG-2026-03', 'emergency_requests', 'USR-HSP-002', 'hospital_coordinator', NULL, '2026-11-22 15:37:06', 'Critical trauma request registered for 6 units O-Negative blood from AIIMS Trauma Resuscitation Bay');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (30, 'LOG-MWS03ZYL-773', 'LOGIN_FAILED', 'UNKNOWN_USER', 'users', NULL, 'anonymous', '::1', '2026-11-22 15:38:04', '{"attemptedEmail":"ryusakuna@gmail.com","reason":"User not found"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (31, 'LOG-MWS0423W-902', 'USER_LOGIN', 'USR-TMO-001', 'users', 'USR-TMO-001', 'clinical_reviewer', '::1', '2026-11-22 15:38:07', '{"email":"dr.priya.tmo@mediconnect.local","role":"clinical_reviewer"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (32, 'LOG-MWS04FTE-9', 'USER_LOGIN', 'USR-BBS-001', 'users', 'USR-BBS-001', 'blood_bank_staff', '::1', '2026-11-22 15:38:24', '{"email":"staff.rohit@mediconnect.local","role":"blood_bank_staff"}');
INSERT INTO `audit_logs` (`id`, `log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `ip_address`, `timestamp`, `details`) VALUES (33, 'LOG-MWS04OVM-442', 'USER_LOGIN', 'USR-HSP-001', 'users', 'USR-HSP-001', 'hospital_coordinator', '::1', '2026-11-22 15:38:36', '{"email":"coord.vikram@cityhospital.local","role":"hospital_coordinator"}');

SET FOREIGN_KEY_CHECKS=1;
