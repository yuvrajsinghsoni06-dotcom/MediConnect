-- ============================================================================
-- MediConnect Synthetic Seed Data 001
-- All data is completely synthetic and adheres to DGHS/WHO guidance.
-- Passwords: all demo users hashed with bcrypt for 'Password@123'
-- ============================================================================

USE `mediconnect_db`;

-- 1. SEED USERS
-- Password hash corresponds to 'Password@123' ($2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K)
INSERT INTO `users` (`user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`) VALUES
('USR-ADM-001', 'System Administrator', 'admin@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'admin', 'IT & Systems', TRUE),
('USR-BBS-001', 'Staff Nurse Rohit Verma', 'staff.rohit@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'blood_bank_staff', 'Blood Bank Phlebotomy', TRUE),
('USR-LAB-001', 'Technician Anita Rao', 'lab.anita@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'lab_technician', 'Serology & Screening Lab', TRUE),
('USR-TMO-001', 'Dr. Priya Nair (TMO)', 'dr.priya.tmo@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'clinical_reviewer', 'Transfusion Medicine Quality Office', TRUE),
('USR-DNR-001', 'Rahul Sharma', 'rahul.donor@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'donor', 'Community Donors', TRUE),
('USR-HSP-001', 'Coordinator Vikram Seth', 'coord.vikram@cityhospital.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'hospital_coordinator', 'Apollo Emergency Transfusion Dept', TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `password_hash`=VALUES(`password_hash`);

-- 2. SEED DONORS
INSERT INTO `donors` (`donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`) VALUES
('DNR-2026-001', 'USR-DNR-001', 'Rahul Sharma', 'O+', '1995-04-12', 'Male', '+91 98765 43210', 'rahul.donor@mediconnect.local', 'New Delhi', 'Delhi', 3, '2026-01-15'),
('DNR-2026-002', NULL, 'Pooja Verma', 'A+', '1998-08-22', 'Female', '+91 98111 22334', 'pooja.v@example.com', 'Mumbai', 'Maharashtra', 1, '2025-11-20'),
('DNR-2026-003', NULL, 'Amit Patel', 'B+', '1992-12-05', 'Male', '+91 99222 33445', 'amit.patel@example.com', 'Ahmedabad', 'Gujarat', 5, '2025-10-10'),
('DNR-2026-004', NULL, 'Sunita Rao', 'AB+', '2000-03-30', 'Female', '+91 97333 44556', 'sunita.rao@example.com', 'Bengaluru', 'Karnataka', 0, NULL)
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`);

-- 3. SEED SCREENING TEST CATALOGUE
INSERT INTO `screening_test_catalogue` (`test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`) VALUES
('HIV', 'HIV-1/2 4th Gen Ag/Ab Combo', 'TTI_Serology', 'Chemiluminescent Microparticle Immunoassay (CMIA)', TRUE, 'Non-Reactive'),
('HBSAG', 'Hepatitis B Surface Antigen (HBsAg)', 'TTI_Serology', 'Chemiluminescence (CLIA)', TRUE, 'Non-Reactive'),
('HCV', 'Hepatitis C Virus Antibody (Anti-HCV)', 'TTI_Serology', 'ELISA 3rd Generation', TRUE, 'Non-Reactive'),
('SYPHILIS', 'Treponema pallidum Hemagglutination (TPHA)', 'TTI_Serology', 'TPHA / RPR Syphilis Screen', TRUE, 'Non-Reactive'),
('MALARIA', 'Malaria Parasite Antigen (Pan/Pf)', 'TTI_Serology', 'Rapid Immunochromatographic Assay / Blood Film', TRUE, 'Non-Reactive'),
('ABO_RH', 'Blood Group & Rh(D) Confirmation', 'Immunohematology', 'Forward & Reverse Tube Agglutination', TRUE, 'Confirmed')
ON DUPLICATE KEY UPDATE `test_name`=VALUES(`test_name`);

-- 4. SEED DONOR ASSESSMENTS
INSERT INTO `donor_assessments` (`assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `evaluator_user_id`, `notes`) VALUES
('ASM-2026-001', 'DNR-2026-001', 72.5, 14.2, 120, 80, 72, 36.6, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'Regular voluntary donor. Clinically sound, cleared for whole blood donation.'),
('ASM-2026-002', 'DNR-2026-002', 56.0, 12.8, 118, 76, 75, 36.8, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'First-time voluntary donor. All vital screening within approved limits.'),
('ASM-2026-003', 'DNR-2026-003', 68.0, 11.2, 124, 82, 70, 36.5, TRUE, TRUE, TRUE, FALSE, 'Temporarily_Deferred', 'USR-BBS-001', 'Hemoglobin 11.2 g/dL is below mandatory DGHS threshold of 12.5 g/dL. Deferred for 90 days.')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- 5. SEED DEFERRAL FOR ASM-2026-003
INSERT INTO `donor_deferrals` (`deferral_id`, `donor_id`, `assessment_id`, `type`, `category`, `reason`, `start_date`, `end_date`, `authorized_by_user_id`) VALUES
('DEF-2026-001', 'DNR-2026-003', 'ASM-2026-003', 'Temporary', 'Low_Hemoglobin', 'Hemoglobin 11.2 g/dL below DGHS 12.5 g/dL threshold', '2026-01-15', '2026-04-15', 'USR-BBS-001')
ON DUPLICATE KEY UPDATE `reason`=VALUES(`reason`);

-- 6. SEED BLOOD DONATIONS
-- DON-2026-0619: Fully cleared and Released
-- DON-2026-0742: Quarantined under Bio-Lock (HCV Reactive)
-- DON-2026-0891: Quarantined pending tests
INSERT INTO `blood_donations` (`unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`) VALUES
('DON-2026-0619', 'DNR-2026-001', 'ASM-2026-001', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-10 10:15:00', '2026-02-14', 'Main Blood Centre - Phlebotomy Bay 1', 'Released', 'Fully screened negative and clinically authorized for release', 'USR-BBS-001'),
('DON-2026-0742', 'DNR-2026-002', 'ASM-2026-002', 'A+', 'Whole Blood', 'Triple', 450, '2026-01-12 11:30:00', '2026-02-16', 'Main Blood Centre - Phlebotomy Bay 2', 'Bio_Lock', 'BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (HCV)', 'USR-BBS-001'),
('DON-2026-0891', 'DNR-2026-001', 'ASM-2026-001', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-15 09:45:00', '2026-02-19', 'Main Blood Centre - Phlebotomy Bay 1', 'Quarantined', 'Mandatory post-collection safety quarantine pending laboratory screening', 'USR-BBS-001')
ON DUPLICATE KEY UPDATE `quarantine_status`=VALUES(`quarantine_status`);

-- 7. SEED BLOOD COMPONENTS FOR RELEASED UNIT DON-2026-0619
INSERT INTO `blood_components` (`component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES
('PRBC-2026-0619', 'DON-2026-0619', 'Packed Red Blood Cells', 280, '2-6°C', 'Cold Room B - Shelf 3', '2026-01-10 14:00:00', '2026-02-21 23:59:59', 'Released'),
('FFP-2026-0619', 'DON-2026-0619', 'Fresh Frozen Plasma', 200, '-30°C or colder', 'Deep Freezer D1 - Rack 2', '2026-01-10 14:30:00', '2027-01-10 23:59:59', 'Released'),
('PLT-2026-0619', 'DON-2026-0619', 'Platelet Concentrate', 55, '20-24°C with agitation', 'Platelet Agitator A - Tray 1', '2026-01-10 14:45:00', '2026-01-15 23:59:59', 'Released')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- 8. SEED LABORATORY RESULTS FOR ALL DONATIONS
-- For DON-2026-0619 (All 5 mandatory negative + ABO Confirmed)
INSERT INTO `laboratory_test_results` (`result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `technician_user_id`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES
('LAB-0619-HIV', 'DON-2026-0619', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'CMIA Non-reactive S/CO 0.08'),
('LAB-0619-HBS', 'DON-2026-0619', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'HBsAg Non-reactive 0.12 IU/mL'),
('LAB-0619-HCV', 'DON-2026-0619', 'HCV', 'Non-Reactive', 'LOT-HCV-2026B', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'ELISA optical density 0.04 (cutoff 0.20)'),
('LAB-0619-SYP', 'DON-2026-0619', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'TPHA Non-reactive'),
('LAB-0619-MAL', 'DON-2026-0619', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'Antigen rapid strip negative'),
-- For DON-2026-0742 (HCV Reactive -> Bio-Lock)
('LAB-0742-HIV', 'DON-2026-0742', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),
('LAB-0742-HBS', 'DON-2026-0742', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),
('LAB-0742-HCV', 'DON-2026-0742', 'HCV', 'Reactive', 'LOT-HCV-2026B', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'INITIAL REACTIVE ELISA (S/CO 3.42). Unit placed under Bio-Lock.'),
('LAB-0742-SYP', 'DON-2026-0742', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),
('LAB-0742-MAL', 'DON-2026-0742', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),
-- For DON-2026-0891 (Pending lab testing)
('LAB-0891-HIV', 'DON-2026-0891', 'HIV', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen received in serology batch B26-101'),
('LAB-0891-HBS', 'DON-2026-0891', 'HBSAG', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen received in serology batch B26-101'),
('LAB-0891-HCV', 'DON-2026-0891', 'HCV', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen received in serology batch B26-101'),
('LAB-0891-SYP', 'DON-2026-0891', 'SYPHILIS', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen received in serology batch B26-101'),
('LAB-0891-MAL', 'DON-2026-0891', 'MALARIA', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen received in serology batch B26-101')
ON DUPLICATE KEY UPDATE `result`=VALUES(`result`);

-- 9. SEED CLINICAL REVIEW FOR DON-2026-0619
INSERT INTO `clinical_reviews` (`review_id`, `unit_number`, `reviewer_user_id`, `decision`, `notes`) VALUES
('REV-2026-0619', 'DON-2026-0619', 'USR-TMO-001', 'Released', 'All 5 mandatory TTI screening tests verified non-reactive. ABO/Rh grouping double-checked. Temperature and storage integrity validated. Authorized for clinical release.')
ON DUPLICATE KEY UPDATE `decision`=VALUES(`decision`);

-- 10. SEED CONFIDENTIAL FOLLOW-UP FOR DON-2026-0742
INSERT INTO `confidential_follow_ups` (`case_id`, `donor_id`, `trigger_unit_number`, `trigger_test_code`, `initial_finding`, `communication_status`, `assigned_officer_user_id`, `confidential_counseling_notes`, `confirmatory_status`) VALUES
('CFU-2026-001', 'DNR-2026-002', 'DON-2026-0742', 'HCV', 'Reactive Hepatitis C antibody on routine screening (ELISA S/CO 3.42)', 'Counseling_Scheduled', 'USR-TMO-001', 'Donor contacted by Medical Officer via private phone call. In-person confidential pre-test/counseling appointment scheduled at blood centre clinic.', 'Referred_to_ICTS')
ON DUPLICATE KEY UPDATE `communication_status`=VALUES(`communication_status`);

-- 11. SEED CAMPAIGNS
INSERT INTO `campaigns` (`campaign_id`, `title`, `organizer`, `location`, `date`, `start_time`, `end_time`, `target_units`, `collected_units`, `status`, `description`) VALUES
('CMP-2026-01', 'AIIMS Blood Donation Drive', 'Rotary Club Delhi & AIIMS', 'AIIMS Main Auditorium, New Delhi', '2026-02-15', '09:00:00', '17:00:00', 150, 42, 'Upcoming', 'Annual community blood collection camp in collaboration with AIIMS Blood Centre.'),
('CMP-2026-02', 'Red Cross Youth Camp', 'Indian Red Cross Society', 'Town Hall Grounds, Connaught Place', '2026-02-28', '10:00:00', '16:00:00', 100, 0, 'Upcoming', 'Youth-oriented voluntary blood drive to support pediatric thalassemia transfusion units.')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 12. SEED EMERGENCY REQUESTS
INSERT INTO `emergency_requests` (`request_id`, `hospital_name`, `coordinator_user_id`, `blood_group`, `units_needed`, `urgency`, `contact_person`, `contact_phone`, `status`) VALUES
('EMG-2026-01', 'Apollo Hospital Trauma ICU', 'USR-HSP-001', 'O+', 4, 'Critical', 'Dr. Vikram Seth', '+91 98765 11223', 'In_Progress'),
('EMG-2026-02', 'Max Healthcare Cardiac OT', NULL, 'AB-', 2, 'Urgent', 'Nurse Supervisor Deepa', '+91 98111 44556', 'Open')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- 13. SEED AUDIT LOGS
INSERT INTO `audit_logs` (`log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `details`) VALUES
('LOG-2026-0001', 'DONATION_ACCESSIONED', 'DON-2026-0619', 'blood_donations', 'USR-BBS-001', 'blood_bank_staff', 'Donation unit collected and placed in Quarantined status pending screening'),
('LOG-2026-0002', 'LAB_RESULT_RECORDED', 'LAB-0619-HIV', 'laboratory_test_results', 'USR-LAB-001', 'lab_technician', 'HIV test result entered as Non-Reactive'),
('LOG-2026-0003', 'CLINICAL_DISPOSITION_APPROVED', 'DON-2026-0619', 'blood_donations', 'USR-TMO-001', 'clinical_reviewer', 'Unit DON-2026-0619 authorized for release. All mandatory 5 TTI tests verified Non-Reactive.'),
('LOG-2026-0004', 'QUARANTINE_BIO_LOCK_ENGAGED', 'DON-2026-0742', 'blood_donations', 'USR-LAB-001', 'lab_technician', 'Automatic Bio-Lock triggered on unit DON-2026-0742 following Reactive HCV result')
ON DUPLICATE KEY UPDATE `event_type`=VALUES(`event_type`);
