-- ============================================================================
-- MediConnect Database Migration 003: Real-World Operational Data
-- Standards: DGHS (India), NBTC, MoHFW (e-RaktKosh), WHO Blood Transfusion Safety
-- Safety: Fully transactional, no table drops, no truncates, strict FK order,
--         preserves all existing demo users and passwords.
-- ============================================================================

USE `mediconnect_db`;

START TRANSACTION;

-- ----------------------------------------------------------------------------
-- 1. USERS & HEALTHCARE STAFF (Preserves USR-ADM-001 to USR-HSP-001)
-- All users hashed with bcrypt for 'Password@123'
-- ($2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K)
-- ----------------------------------------------------------------------------
INSERT INTO `users` (`user_id`, `name`, `email`, `password_hash`, `role`, `department`, `is_active`) VALUES
('USR-ADM-001', 'System Administrator', 'admin@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'admin', 'IT & Health Informatics', TRUE),
('USR-BBS-001', 'Staff Nurse Rohit Verma', 'staff.rohit@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'blood_bank_staff', 'Blood Bank Phlebotomy & Accessioning', TRUE),
('USR-LAB-001', 'Technician Anita Rao', 'lab.anita@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'lab_technician', 'Serology & Screening Lab', TRUE),
('USR-TMO-001', 'Dr. Priya Nair (TMO)', 'dr.priya.tmo@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'clinical_reviewer', 'Transfusion Medicine Quality Office', TRUE),
('USR-DNR-001', 'Rahul Sharma', 'rahul.donor@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'donor', 'Community Donors', TRUE),
('USR-HSP-001', 'Coordinator Vikram Seth', 'coord.vikram@cityhospital.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'hospital_coordinator', 'Apollo Emergency Transfusion Dept', TRUE),
-- Additional operational personnel
('USR-BBS-002', 'Sister Sunita Deshmukh', 'sunita.d@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'blood_bank_staff', 'Mobile Collection Van Unit 2', TRUE),
('USR-LAB-002', 'Sr. Technologist Rajesh Kulkarni', 'rajesh.lab@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'lab_technician', 'NAT & Immunohematology Lab', TRUE),
('USR-TMO-002', 'Dr. Arishta Mukherjee (TMO)', 'dr.mukherjee@mediconnect.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'clinical_reviewer', 'Apex Blood Centre Medical Board', TRUE),
('USR-HSP-002', 'Nurse Supervisor Deepa Menon', 'deepa.menon@aiimsdelhi.local', '$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K', 'hospital_coordinator', 'AIIMS Trauma ICU Blood Desk', TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `department`=VALUES(`department`), `is_active`=VALUES(`is_active`);

-- ----------------------------------------------------------------------------
-- 2. SCREENING TEST CATALOGUE (Statutory 5 + Immunohematology)
-- ----------------------------------------------------------------------------
INSERT INTO `screening_test_catalogue` (`test_code`, `test_name`, `category`, `methodology`, `is_mandatory_for_release`, `expected_negative_value`) VALUES
('HIV', 'HIV-1/2 4th Gen Ag/Ab Combo', 'TTI_Serology', 'Chemiluminescent Microparticle Immunoassay (CMIA)', TRUE, 'Non-Reactive'),
('HBSAG', 'Hepatitis B Surface Antigen (HBsAg)', 'TTI_Serology', 'Chemiluminescence Immunoassay (CLIA)', TRUE, 'Non-Reactive'),
('HCV', 'Hepatitis C Virus Antibody (Anti-HCV)', 'TTI_Serology', '3rd Gen Microplate ELISA', TRUE, 'Non-Reactive'),
('SYPHILIS', 'Treponema pallidum Hemagglutination (TPHA)', 'TTI_Serology', 'TPHA / RPR Syphilis Screen', TRUE, 'Non-Reactive'),
('MALARIA', 'Malaria Parasite Antigen (Pan/Pf)', 'TTI_Serology', 'Rapid Immunochromatographic Strip & Blood Smear', TRUE, 'Non-Reactive'),
('ABO_RH', 'Blood Group & Rh(D) Confirmation', 'Immunohematology', 'Forward & Reverse Tube Agglutination', TRUE, 'Confirmed')
ON DUPLICATE KEY UPDATE `test_name`=VALUES(`test_name`), `methodology`=VALUES(`methodology`);

-- ----------------------------------------------------------------------------
-- 3. CAMPAIGNS (Voluntary Blood Drives across Major Metropolitan Zones)
-- ----------------------------------------------------------------------------
INSERT INTO `campaigns` (`campaign_id`, `title`, `organizer`, `location`, `date`, `start_time`, `end_time`, `target_units`, `collected_units`, `status`, `description`) VALUES
('CMP-2026-01', 'AIIMS Annual National Voluntary Blood Drive', 'Rotary Club of Delhi Central & AIIMS BTS', 'AIIMS Main Auditorium Complex, Ansari Nagar, New Delhi', '2026-12-10', '09:00:00', '17:00:00', 250, 185, 'Completed', 'National voluntary donation camp supporting pediatric hemato-oncology and emergency trauma resuscitation units.'),
('CMP-2026-02', 'Indian Red Cross Youth Solidarity Blood Camp', 'Indian Red Cross Society, Maharashtra State Branch', 'Town Hall Historical Grounds, Fort, Mumbai', '2026-12-18', '09:30:00', '16:30:00', 180, 142, 'Completed', 'Youth-oriented voluntary blood drive to support municipal thalassemia transfusion daycare clinics.'),
('CMP-2026-03', 'Bengaluru IT Corridor LifeSavers Drive', 'Whitefield Healthcare Coalition & Narayana Health', 'EcoWorld Convention Center, Outer Ring Road, Bengaluru', '2026-12-28', '10:00:00', '18:00:00', 200, 78, 'Active', 'Corporate community solidarity drive replenishing southern regional blood repository supplies.'),
('CMP-2026-04', 'Hyderabad Mega University Voluntary Blood Fest', 'National Service Scheme (NSS) & Osmania Blood Centre', 'University Assembly Pavilion, Amberpet, Hyderabad', '2027-01-12', '08:30:00', '15:30:00', 150, 0, 'Upcoming', 'Collegiate awareness campaign educating first-time donors on voluntary repeat donation and thalassemia prevention.'),
('CMP-2026-05', 'Apex Trauma Center Emergency Preparedness Drive', 'King Edward Memorial Hospital & Red Cross', 'KEM Hospital Gymnasium Grounds, Parel, Mumbai', '2027-01-20', '09:00:00', '17:00:00', 220, 0, 'Upcoming', 'Targeted whole blood collection drive preparing reserve inventory for state highway emergency response centers.')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `location`=VALUES(`location`), `collected_units`=VALUES(`collected_units`), `status`=VALUES(`status`);

-- ----------------------------------------------------------------------------
-- 4. DONORS (Privacy-Preserving Fictional Identities across India)
-- Demographically representative ABO/Rh distribution
-- ----------------------------------------------------------------------------
INSERT INTO `donors` (`donor_id`, `user_id`, `full_name`, `blood_group`, `date_of_birth`, `gender`, `phone`, `email`, `city`, `state`, `total_donations`, `last_donation_date`) VALUES
('DNR-2026-001', 'USR-DNR-001', 'Rahul Sharma', 'O+', '1995-04-12', 'Male', '+91 98765 43210', 'rahul.donor@mediconnect.local', 'New Delhi', 'Delhi', 4, '2026-01-15'),
('DNR-2026-002', NULL, 'Pooja Verma', 'A+', '1998-08-22', 'Female', '+91 98111 22334', 'pooja.verma@synthhealth.in', 'Mumbai', 'Maharashtra', 2, '2026-01-12'),
('DNR-2026-003', NULL, 'Amit Patel', 'B+', '1992-12-05', 'Male', '+91 99222 33445', 'amit.patel@synthhealth.in', 'Ahmedabad', 'Gujarat', 6, '2025-10-10'),
('DNR-2026-004', NULL, 'Sunita Rao', 'AB+', '2000-03-30', 'Female', '+91 97333 44556', 'sunita.rao@synthhealth.in', 'Bengaluru', 'Karnataka', 1, '2026-01-18'),
('DNR-2026-005', NULL, 'Vikramaditya Rao', 'O-', '1988-06-14', 'Male', '+91 98444 55667', 'vikram.rao@synthhealth.in', 'Hyderabad', 'Telangana', 15, '2026-01-20'),
('DNR-2026-006', NULL, 'Arjun K. Sengupta', 'AB-', '1994-11-09', 'Male', '+91 98555 66778', 'arjun.sengupta@synthhealth.in', 'Kolkata', 'West Bengal', 5, '2025-11-04'),
('DNR-2026-007', NULL, 'Meenakshi Sundaram', 'B-', '1996-02-18', 'Female', '+91 98666 77889', 'meenakshi.s@synthhealth.in', 'Chennai', 'Tamil Nadu', 3, '2025-12-01'),
('DNR-2026-008', NULL, 'Kavita Chawla', 'A-', '1997-09-25', 'Female', '+91 98777 88990', 'kavita.chawla@synthhealth.in', 'New Delhi', 'Delhi', 4, '2026-01-22'),
('DNR-2026-009', NULL, 'Tanmay Joshi', 'O+', '1991-07-19', 'Male', '+91 98888 99001', 'tanmay.joshi@synthhealth.in', 'Pune', 'Maharashtra', 8, '2026-01-24'),
('DNR-2026-010', NULL, 'Farhan Akhtar Qureshi', 'B+', '1993-05-15', 'Male', '+91 98999 00112', 'farhan.qureshi@synthhealth.in', 'Lucknow', 'Uttar Pradesh', 7, '2026-01-25'),
('DNR-2026-011', NULL, 'Ananya Bhattacharya', 'A+', '2001-10-04', 'Female', '+91 99000 11223', 'ananya.b@synthhealth.in', 'Kolkata', 'West Bengal', 2, '2026-01-26'),
('DNR-2026-012', NULL, 'Girish Venkatraman', 'O+', '1985-01-30', 'Male', '+91 99111 22334', 'girish.v@synthhealth.in', 'Bengaluru', 'Karnataka', 12, '2026-01-27')
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`), `city`=VALUES(`city`), `total_donations`=VALUES(`total_donations`), `last_donation_date`=VALUES(`last_donation_date`);

-- ----------------------------------------------------------------------------
-- 5. EMERGENCY REQUESTS (Hospital Emergency Blood Matching)
-- ----------------------------------------------------------------------------
INSERT INTO `emergency_requests` (`request_id`, `hospital_name`, `coordinator_user_id`, `blood_group`, `units_needed`, `urgency`, `contact_person`, `contact_phone`, `status`) VALUES
('EMG-2026-01', 'Apollo Hospitals Emergency Trauma ICU', 'USR-HSP-001', 'O+', 4, 'Critical', 'Dr. Vikram Seth', '+91 98765 11223', 'In_Progress'),
('EMG-2026-02', 'Max Super Speciality Cardiac OT', NULL, 'AB-', 2, 'Urgent', 'Nurse Supervisor Deepa', '+91 98111 44556', 'Open'),
('EMG-2026-03', 'AIIMS Trauma Resuscitation Bay', 'USR-HSP-002', 'O-', 6, 'Critical', 'Dr. Alok Nath (Trauma Surgeon)', '+91 98222 55667', 'In_Progress'),
('EMG-2026-04', 'King Edward Memorial Pediatric Thalassemia Unit', NULL, 'B+', 5, 'Urgent', 'Dr. S. K. Kadam', '+91 98333 66778', 'Open'),
('EMG-2026-05', 'Fortis Memorial Obstetrics Acute Wing', NULL, 'A+', 3, 'Normal', 'Sister In-Charge Mary', '+91 98444 77889', 'Fulfilled')
ON DUPLICATE KEY UPDATE `units_needed`=VALUES(`units_needed`), `urgency`=VALUES(`urgency`), `status`=VALUES(`status`);

-- ----------------------------------------------------------------------------
-- 6. DONOR ASSESSMENTS (DGHS Clinical Vitals Screening)
-- ----------------------------------------------------------------------------
INSERT INTO `donor_assessments` (`assessment_id`, `donor_id`, `weight_kg`, `hemoglobin_g_dl`, `blood_pressure_sys`, `blood_pressure_dia`, `pulse_bpm`, `temperature_c`, `travel_history_cleared`, `high_risk_cleared`, `medication_cleared`, `recent_fever_symptoms`, `status`, `evaluator_user_id`, `notes`) VALUES
('ASM-2026-001', 'DNR-2026-001', 72.5, 14.2, 120, 80, 72, 36.6, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'Regular voluntary donor. Clinically sound, cleared for whole blood donation.'),
('ASM-2026-002', 'DNR-2026-002', 56.0, 12.8, 118, 76, 75, 36.8, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'First-time voluntary donor. All vital screening within approved limits.'),
('ASM-2026-003', 'DNR-2026-003', 68.0, 11.2, 124, 82, 70, 36.5, TRUE, TRUE, TRUE, FALSE, 'Temporarily_Deferred', 'USR-BBS-001', 'Hemoglobin 11.2 g/dL is below mandatory DGHS threshold of 12.5 g/dL. Deferred for 90 days.'),
('ASM-2026-004', 'DNR-2026-004', 58.5, 13.1, 122, 78, 74, 36.7, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'Cleared for standard whole blood collection; vein inspection normal.'),
('ASM-2026-005', 'DNR-2026-005', 81.0, 15.6, 126, 82, 68, 36.6, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'Universal O-Negative repeat donor. Excellent physical vitals; cleared for apheresis/whole blood.'),
('ASM-2026-006', 'DNR-2026-006', 74.0, 14.0, 130, 84, 76, 36.8, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-002', 'Rare AB-Negative donor. Physical examination satisfactory; veins bilateral prominent.'),
('ASM-2026-007', 'DNR-2026-007', 52.0, 12.0, 110, 70, 72, 36.5, TRUE, TRUE, TRUE, FALSE, 'Temporarily_Deferred', 'USR-BBS-002', 'Hemoglobin 12.0 g/dL below statutory cutoff (12.5 g/dL). Dietary counseling provided, deferred 90 days.'),
('ASM-2026-008', 'DNR-2026-008', 54.5, 13.4, 116, 74, 70, 36.6, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'Rare A-Negative donor. Fit for whole blood donation.'),
('ASM-2026-009', 'DNR-2026-009', 76.0, 14.8, 128, 80, 72, 36.7, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-001', 'Regular voluntary whole blood donor; clinically eligible.'),
('ASM-2026-010', 'DNR-2026-010', 70.0, 14.5, 122, 78, 68, 36.5, TRUE, TRUE, TRUE, FALSE, 'Eligible', 'USR-BBS-002', 'Cleared for 450 mL whole blood collection in quadruple blood bag.')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`), `notes`=VALUES(`notes`);

-- ----------------------------------------------------------------------------
-- 7. DONOR DEFERRALS (Documented Temporary & Permanent Deferral Registry)
-- ----------------------------------------------------------------------------
INSERT INTO `donor_deferrals` (`deferral_id`, `donor_id`, `assessment_id`, `type`, `category`, `reason`, `start_date`, `end_date`, `authorized_by_user_id`) VALUES
('DEF-2026-001', 'DNR-2026-003', 'ASM-2026-003', 'Temporary', 'Low_Hemoglobin', 'Hemoglobin 11.2 g/dL below DGHS 12.5 g/dL statutory threshold', '2026-01-15', '2026-04-15', 'USR-BBS-001'),
('DEF-2026-002', 'DNR-2026-007', 'ASM-2026-007', 'Temporary', 'Low_Hemoglobin', 'Hemoglobin 12.0 g/dL below statutory minimum (12.5 g/dL); iron therapy suggested', '2026-01-20', '2026-04-20', 'USR-BBS-002')
ON DUPLICATE KEY UPDATE `reason`=VALUES(`reason`), `end_date`=VALUES(`end_date`);

-- ----------------------------------------------------------------------------
-- 8. BLOOD DONATIONS (Accessioning & Quarantine Lifecycle)
-- ----------------------------------------------------------------------------
INSERT INTO `blood_donations` (`unit_number`, `donor_id`, `assessment_id`, `blood_group`, `donation_type`, `bag_type`, `volume_ml`, `donation_date`, `expiry_date`, `location`, `quarantine_status`, `quarantine_reason`, `phlebotomist_user_id`) VALUES
-- Unit 1: Cleared and Released into grid
('DON-2026-0619', 'DNR-2026-001', 'ASM-2026-001', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-10 10:15:00', '2026-02-14', 'Main Blood Centre - Phlebotomy Bay 1', 'Released', 'Fully screened negative and clinically authorized for release', 'USR-BBS-001'),
-- Unit 2: Bio-Lock quarantine due to Reactive HCV serology
('DON-2026-0742', 'DNR-2026-002', 'ASM-2026-002', 'A+', 'Whole Blood', 'Triple', 450, '2026-01-12 11:30:00', '2026-02-16', 'Main Blood Centre - Phlebotomy Bay 2', 'Bio_Lock', 'BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (HCV)', 'USR-BBS-001'),
-- Unit 3: Recently collected, awaiting serology results
('DON-2026-0891', 'DNR-2026-001', 'ASM-2026-001', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-15 09:45:00', '2026-02-19', 'Main Blood Centre - Phlebotomy Bay 1', 'Quarantined', 'Mandatory post-collection safety quarantine pending laboratory screening', 'USR-BBS-001'),
-- Unit 4: Rare O-Negative unit, fully screened & released
('DON-2026-1044', 'DNR-2026-005', 'ASM-2026-005', 'O-', 'Whole Blood', 'Quadruple', 450, '2026-01-20 14:00:00', '2026-02-24', 'Apex Trauma Blood Centre - Apheresis Suite', 'Released', 'Universal O-Negative cleared and released for emergency trauma reserve', 'USR-BBS-001'),
-- Unit 5: Rare AB-Negative unit, Pending TMO Review
('DON-2026-1188', 'DNR-2026-006', 'ASM-2026-006', 'AB-', 'Whole Blood', 'Triple', 450, '2026-01-22 10:30:00', '2026-02-26', 'Rotary Camp Mobile Van 1', 'Pending_Review', 'All 5 mandatory TTI tests Non-Reactive; pending final TMO clinical sign-off', 'USR-BBS-002'),
-- Unit 6: A-Negative unit, Quarantined pending tests
('DON-2026-1250', 'DNR-2026-008', 'ASM-2026-008', 'A-', 'Whole Blood', 'Triple', 450, '2026-01-23 11:15:00', '2026-02-27', 'Main Blood Centre - Phlebotomy Bay 2', 'Quarantined', 'Mandatory post-collection safety quarantine pending laboratory screening', 'USR-BBS-001'),
-- Unit 7: O-Positive unit, fully screened & released
('DON-2026-1310', 'DNR-2026-009', 'ASM-2026-009', 'O+', 'Whole Blood', 'Triple', 450, '2026-01-24 15:45:00', '2026-02-28', 'AIIMS Camp Collection Bay A', 'Released', 'Fully screened negative and clinically authorized for release', 'USR-BBS-001'),
-- Unit 8: B-Positive unit, Bio-Lock due to Reactive HBsAg
('DON-2026-1405', 'DNR-2026-010', 'ASM-2026-010', 'B+', 'Whole Blood', 'Triple', 450, '2026-01-25 12:00:00', '2026-03-01', 'KEM Blood Centre - Station 3', 'Bio_Lock', 'BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (HBsAg)', 'USR-BBS-002')
ON DUPLICATE KEY UPDATE `quarantine_status`=VALUES(`quarantine_status`), `quarantine_reason`=VALUES(`quarantine_reason`);

-- ----------------------------------------------------------------------------
-- 9. BLOOD COMPONENTS (Fractionated PRBC, FFP, Platelets, Cryo)
-- ----------------------------------------------------------------------------
INSERT INTO `blood_components` (`component_code`, `unit_number`, `component_type`, `volume_ml`, `storage_temperature_c`, `storage_location`, `preparation_timestamp`, `expiry_date`, `status`) VALUES
-- Components for Released Unit DON-2026-0619
('PRBC-2026-0619', 'DON-2026-0619', 'Packed Red Blood Cells', 280, '2-6°C', 'Cold Room B - Shelf 3', '2026-01-10 14:00:00', '2026-02-14 23:59:59', 'Released'),
('FFP-2026-0619', 'DON-2026-0619', 'Fresh Frozen Plasma', 200, '-30°C or colder', 'Deep Freezer D1 - Rack 2', '2026-01-10 14:30:00', '2027-01-10 23:59:59', 'Released'),
('PLT-2026-0619', 'DON-2026-0619', 'Platelet Concentrate', 55, '20-24°C with agitation', 'Platelet Agitator A - Tray 1', '2026-01-10 14:45:00', '2026-01-15 23:59:59', 'Released'),
-- Components for Released Universal Donor DON-2026-1044 (O-Negative)
('PRBC-2026-1044', 'DON-2026-1044', 'Packed Red Blood Cells', 290, '2-6°C', 'Cold Room Emergency Reserve - Shelf 1', '2026-01-20 17:00:00', '2026-02-24 23:59:59', 'Released'),
('FFP-2026-1044', 'DON-2026-1044', 'Fresh Frozen Plasma', 210, '-30°C or colder', 'Deep Freezer D2 - Rack 1', '2026-01-20 17:20:00', '2027-01-20 23:59:59', 'Released'),
('PLT-2026-1044', 'DON-2026-1044', 'Platelet Concentrate', 60, '20-24°C with agitation', 'Platelet Agitator B - Tray 2', '2026-01-20 17:35:00', '2026-01-25 23:59:59', 'Released'),
('CRYO-2026-1044', 'DON-2026-1044', 'Cryoprecipitate', 20, '-30°C or colder', 'Deep Freezer CryoBox 1', '2026-01-20 18:00:00', '2027-01-20 23:59:59', 'Released'),
-- Components for Released Unit DON-2026-1310 (O-Positive)
('PRBC-2026-1310', 'DON-2026-1310', 'Packed Red Blood Cells', 285, '2-6°C', 'Cold Room B - Shelf 4', '2026-01-24 18:00:00', '2026-02-28 23:59:59', 'Released'),
('FFP-2026-1310', 'DON-2026-1310', 'Fresh Frozen Plasma', 205, '-30°C or colder', 'Deep Freezer D1 - Rack 3', '2026-01-24 18:30:00', '2027-01-24 23:59:59', 'Released'),
('PLT-2026-1310', 'DON-2026-1310', 'Platelet Concentrate', 58, '20-24°C with agitation', 'Platelet Agitator A - Tray 3', '2026-01-24 18:45:00', '2026-01-29 23:59:59', 'Released')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`), `storage_location`=VALUES(`storage_location`);

-- ----------------------------------------------------------------------------
-- 10. LABORATORY SCREENING RESULTS (Mandatory 5-Panel TTI Results)
-- ----------------------------------------------------------------------------
INSERT INTO `laboratory_test_results` (`result_id`, `unit_number`, `test_code`, `result`, `test_kit_lot`, `technician_user_id`, `reviewed_by_user_id`, `reviewed_at`, `notes`) VALUES
-- DON-2026-0619 (All 5 Non-Reactive)
('LAB-0619-HIV', 'DON-2026-0619', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'CMIA Non-reactive S/CO 0.08'),
('LAB-0619-HBS', 'DON-2026-0619', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'HBsAg Non-reactive 0.12 IU/mL'),
('LAB-0619-HCV', 'DON-2026-0619', 'HCV', 'Non-Reactive', 'LOT-HCV-2026B', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'ELISA optical density 0.04 (cutoff 0.20)'),
('LAB-0619-SYP', 'DON-2026-0619', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'TPHA Non-reactive'),
('LAB-0619-MAL', 'DON-2026-0619', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', 'USR-LAB-001', 'USR-TMO-001', '2026-01-11 10:00:00', 'Antigen rapid strip negative; smear clear'),

-- DON-2026-0742 (HCV Reactive -> Bio-Lock)
('LAB-0742-HIV', 'DON-2026-0742', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),
('LAB-0742-HBS', 'DON-2026-0742', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),
('LAB-0742-HCV', 'DON-2026-0742', 'HCV', 'Reactive', 'LOT-HCV-2026B', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'INITIAL REACTIVE ELISA (S/CO 3.42). Unit placed under Bio-Lock.'),
('LAB-0742-SYP', 'DON-2026-0742', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),
('LAB-0742-MAL', 'DON-2026-0742', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', 'USR-LAB-001', 'USR-TMO-001', '2026-01-13 14:00:00', 'Non-reactive'),

-- DON-2026-0891 (Pending Lab Tests)
('LAB-0891-HIV', 'DON-2026-0891', 'HIV', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen accessioned in serology batch B26-101'),
('LAB-0891-HBS', 'DON-2026-0891', 'HBSAG', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen accessioned in serology batch B26-101'),
('LAB-0891-HCV', 'DON-2026-0891', 'HCV', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen accessioned in serology batch B26-101'),
('LAB-0891-SYP', 'DON-2026-0891', 'SYPHILIS', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen accessioned in serology batch B26-101'),
('LAB-0891-MAL', 'DON-2026-0891', 'MALARIA', 'Pending', NULL, 'USR-LAB-001', NULL, NULL, 'Specimen accessioned in serology batch B26-101'),

-- DON-2026-1044 (Universal O-Negative, All 5 Non-Reactive + NAT Cleared)
('LAB-1044-HIV', 'DON-2026-1044', 'HIV', 'Non-Reactive', 'LOT-HIV-2026A', 'USR-LAB-002', 'USR-TMO-001', '2026-01-21 11:30:00', 'CMIA Non-reactive S/CO 0.05; ID-NAT negative'),
('LAB-1044-HBS', 'DON-2026-1044', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026C', 'USR-LAB-002', 'USR-TMO-001', '2026-01-21 11:30:00', 'CLIA HBsAg 0.04 IU/mL; ID-NAT negative'),
('LAB-1044-HCV', 'DON-2026-1044', 'HCV', 'Non-Reactive', 'LOT-HCV-2026B', 'USR-LAB-002', 'USR-TMO-001', '2026-01-21 11:30:00', 'ELISA OD 0.03 (Cutoff 0.20); ID-NAT negative'),
('LAB-1044-SYP', 'DON-2026-1044', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026X', 'USR-LAB-002', 'USR-TMO-001', '2026-01-21 11:30:00', 'TPHA Non-reactive'),
('LAB-1044-MAL', 'DON-2026-1044', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026M', 'USR-LAB-002', 'USR-TMO-001', '2026-01-21 11:30:00', 'Pan/Pf Rapid Strip negative; thin/thick film negative'),

-- DON-2026-1188 (Rare AB-Negative, All 5 Non-Reactive, Pending Review)
('LAB-1188-HIV', 'DON-2026-1188', 'HIV', 'Non-Reactive', 'LOT-HIV-2026B', 'USR-LAB-001', NULL, NULL, 'CMIA S/CO 0.07 Non-Reactive'),
('LAB-1188-HBS', 'DON-2026-1188', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026D', 'USR-LAB-001', NULL, NULL, 'CLIA 0.09 IU/mL Non-Reactive'),
('LAB-1188-HCV', 'DON-2026-1188', 'HCV', 'Non-Reactive', 'LOT-HCV-2026C', 'USR-LAB-001', NULL, NULL, 'ELISA OD 0.05 Non-Reactive'),
('LAB-1188-SYP', 'DON-2026-1188', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026Y', 'USR-LAB-001', NULL, NULL, 'TPHA Non-Reactive'),
('LAB-1188-MAL', 'DON-2026-1188', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026N', 'USR-LAB-001', NULL, NULL, 'Antigen negative'),

-- DON-2026-1310 (O-Positive, All 5 Non-Reactive)
('LAB-1310-HIV', 'DON-2026-1310', 'HIV', 'Non-Reactive', 'LOT-HIV-2026B', 'USR-LAB-001', 'USR-TMO-001', '2026-01-25 10:00:00', 'CMIA Non-reactive S/CO 0.06'),
('LAB-1310-HBS', 'DON-2026-1310', 'HBSAG', 'Non-Reactive', 'LOT-HBS-2026D', 'USR-LAB-001', 'USR-TMO-001', '2026-01-25 10:00:00', 'HBsAg Non-reactive 0.07 IU/mL'),
('LAB-1310-HCV', 'DON-2026-1310', 'HCV', 'Non-Reactive', 'LOT-HCV-2026C', 'USR-LAB-001', 'USR-TMO-001', '2026-01-25 10:00:00', 'ELISA OD 0.04 Non-reactive'),
('LAB-1310-SYP', 'DON-2026-1310', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026Y', 'USR-LAB-001', 'USR-TMO-001', '2026-01-25 10:00:00', 'TPHA Non-reactive'),
('LAB-1310-MAL', 'DON-2026-1310', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026N', 'USR-LAB-001', 'USR-TMO-001', '2026-01-25 10:00:00', 'Pan/Pf Rapid Strip negative'),

-- DON-2026-1405 (B-Positive, HBsAg Reactive -> Bio-Lock)
('LAB-1405-HIV', 'DON-2026-1405', 'HIV', 'Non-Reactive', 'LOT-HIV-2026B', 'USR-LAB-002', 'USR-TMO-002', '2026-01-26 14:00:00', 'Non-reactive'),
('LAB-1405-HBS', 'DON-2026-1405', 'HBSAG', 'Reactive', 'LOT-HBS-2026D', 'USR-LAB-002', 'USR-TMO-002', '2026-01-26 14:00:00', 'INITIAL REACTIVE HBsAg (CLIA 4.20 IU/mL). Bio-Lock quarantine engaged.'),
('LAB-1405-HCV', 'DON-2026-1405', 'HCV', 'Non-Reactive', 'LOT-HCV-2026C', 'USR-LAB-002', 'USR-TMO-002', '2026-01-26 14:00:00', 'Non-reactive'),
('LAB-1405-SYP', 'DON-2026-1405', 'SYPHILIS', 'Non-Reactive', 'LOT-TPH-2026Y', 'USR-LAB-002', 'USR-TMO-002', '2026-01-26 14:00:00', 'Non-reactive'),
('LAB-1405-MAL', 'DON-2026-1405', 'MALARIA', 'Non-Reactive', 'LOT-MAL-2026N', 'USR-LAB-002', 'USR-TMO-002', '2026-01-26 14:00:00', 'Non-reactive')
ON DUPLICATE KEY UPDATE `result`=VALUES(`result`), `reviewed_at`=VALUES(`reviewed_at`), `notes`=VALUES(`notes`);

-- ----------------------------------------------------------------------------
-- 11. CLINICAL REVIEWS (TMO Authorized Disposition Decisions)
-- ----------------------------------------------------------------------------
INSERT INTO `clinical_reviews` (`review_id`, `unit_number`, `reviewer_user_id`, `decision`, `notes`) VALUES
('REV-2026-0619', 'DON-2026-0619', 'USR-TMO-001', 'Released', 'All 5 mandatory TTI screening tests verified non-reactive. ABO/Rh grouping double-checked. Temperature and storage integrity validated. Authorized for clinical release.'),
('REV-2026-1044', 'DON-2026-1044', 'USR-TMO-001', 'Released', 'Universal O-Negative unit verified 100% Non-Reactive across serology panel and ID-NAT. Critical trauma release authorized.'),
('REV-2026-1310', 'DON-2026-1310', 'USR-TMO-001', 'Released', 'Complete non-reactive panel verified. Cell and serum ABO/Rh concordant. Component split validated and approved for general inventory release.')
ON DUPLICATE KEY UPDATE `decision`=VALUES(`decision`), `notes`=VALUES(`notes`);

-- ----------------------------------------------------------------------------
-- 12. CONFIDENTIAL FOLLOW-UPS (Strict PII Isolation & Post-Test Counseling)
-- ----------------------------------------------------------------------------
INSERT INTO `confidential_follow_ups` (`case_id`, `donor_id`, `trigger_unit_number`, `trigger_test_code`, `initial_finding`, `communication_status`, `assigned_officer_user_id`, `confidential_counseling_notes`, `confirmatory_status`) VALUES
('CFU-2026-001', 'DNR-2026-002', 'DON-2026-0742', 'HCV', 'Reactive Hepatitis C antibody on routine screening (ELISA S/CO 3.42)', 'Counseling_Scheduled', 'USR-TMO-001', 'Donor contacted by Medical Officer via private phone call. In-person confidential pre-test/counseling appointment scheduled at blood centre clinic.', 'Referred_to_ICTS'),
('CFU-2026-002', 'DNR-2026-010', 'DON-2026-1405', 'HBSAG', 'Reactive HBsAg surface antigen on routine chemiluminescence (CLIA 4.20 IU/mL)', 'Contacted', 'USR-TMO-002', 'Confidential letter dispatched via registered post marked confidential. Telephonic verification confirmed donor attendance for repeat confirmatory testing.', 'Pending')
ON DUPLICATE KEY UPDATE `communication_status`=VALUES(`communication_status`), `confirmatory_status`=VALUES(`confirmatory_status`);

-- ----------------------------------------------------------------------------
-- 13. AUDIT TRAILS & SYSTEM EVENTS LOG
-- ----------------------------------------------------------------------------
INSERT INTO `audit_logs` (`log_id`, `event_type`, `record_id`, `entity_type`, `actor_user_id`, `actor_role`, `details`) VALUES
('LOG-2026-0001', 'DONATION_ACCESSIONED', 'DON-2026-0619', 'blood_donations', 'USR-BBS-001', 'blood_bank_staff', 'Donation unit collected and placed in Quarantined status pending screening'),
('LOG-2026-0002', 'LAB_RESULT_RECORDED', 'LAB-0619-HIV', 'laboratory_test_results', 'USR-LAB-001', 'lab_technician', 'HIV test result entered as Non-Reactive'),
('LOG-2026-0003', 'CLINICAL_DISPOSITION_APPROVED', 'DON-2026-0619', 'blood_donations', 'USR-TMO-001', 'clinical_reviewer', 'Unit DON-2026-0619 authorized for release. All mandatory 5 TTI tests verified Non-Reactive.'),
('LOG-2026-0004', 'QUARANTINE_BIO_LOCK_ENGAGED', 'DON-2026-0742', 'blood_donations', 'USR-LAB-001', 'lab_technician', 'Automatic Bio-Lock triggered on unit DON-2026-0742 following Reactive HCV result'),
('LOG-2026-0005', 'CLINICAL_DISPOSITION_APPROVED', 'DON-2026-1044', 'blood_donations', 'USR-TMO-001', 'clinical_reviewer', 'Universal O-Negative unit DON-2026-1044 released for emergency trauma reserve.'),
('LOG-2026-0006', 'QUARANTINE_BIO_LOCK_ENGAGED', 'DON-2026-1405', 'blood_donations', 'USR-LAB-002', 'lab_technician', 'Automatic Bio-Lock triggered on unit DON-2026-1405 following Reactive HBsAg result'),
('LOG-2026-0007', 'EMERGENCY_REQUEST_RECEIVED', 'EMG-2026-03', 'emergency_requests', 'USR-HSP-002', 'hospital_coordinator', 'Critical trauma request registered for 6 units O-Negative blood from AIIMS Trauma Resuscitation Bay')
ON DUPLICATE KEY UPDATE `event_type`=VALUES(`event_type`);

COMMIT;
