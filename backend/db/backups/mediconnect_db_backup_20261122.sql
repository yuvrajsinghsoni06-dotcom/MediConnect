-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mediconnect_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `log_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `record_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `details` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `log_id` (`log_id`),
  KEY `idx_audit_record` (`record_id`),
  KEY `idx_audit_actor` (`actor_user_id`),
  KEY `idx_audit_timestamp` (`timestamp`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'LOG-2026-0001','DONATION_ACCESSIONED','DON-2026-0619','blood_donations','USR-BBS-001','blood_bank_staff',NULL,'2026-11-22 13:54:33','Donation unit collected and placed in Quarantined status pending screening'),(2,'LOG-2026-0002','LAB_RESULT_RECORDED','LAB-0619-HIV','laboratory_test_results','USR-LAB-001','lab_technician',NULL,'2026-11-22 13:54:33','HIV test result entered as Non-Reactive'),(3,'LOG-2026-0003','CLINICAL_DISPOSITION_APPROVED','DON-2026-0619','blood_donations','USR-TMO-001','clinical_reviewer',NULL,'2026-11-22 13:54:33','Unit DON-2026-0619 authorized for release. All mandatory 5 TTI tests verified Non-Reactive.'),(4,'LOG-2026-0004','QUARANTINE_BIO_LOCK_ENGAGED','DON-2026-0742','blood_donations','USR-LAB-001','lab_technician',NULL,'2026-11-22 13:54:33','Automatic Bio-Lock triggered on unit DON-2026-0742 following Reactive HCV result'),(12,'LOG-MWRWXPA5-285','LOGIN_FAILED','USR-TMO-001','users','USR-TMO-001','clinical_reviewer','::1','2026-11-22 14:09:11','{\"email\":\"dr.priya.tmo@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(13,'LOG-MWRWXSS0-694','LOGIN_FAILED','USR-TMO-001','users','USR-TMO-001','clinical_reviewer','::1','2026-11-22 14:09:16','{\"email\":\"dr.priya.tmo@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(14,'LOG-MWRYNO7K-120','LOGIN_FAILED','USR-TMO-001','users','USR-TMO-001','clinical_reviewer','::1','2026-11-22 14:57:23','{\"email\":\"dr.priya.tmo@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(15,'LOG-MWRYOVDX-838','LOGIN_FAILED','USR-ADM-001','users','USR-ADM-001','admin','::1','2026-11-22 14:58:18','{\"email\":\"admin@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(16,'LOG-MWRYQB84-449','LOGIN_FAILED','USR-ADM-001','users','USR-ADM-001','admin','::1','2026-11-22 14:59:26','{\"email\":\"admin@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(17,'LOG-MWRZ8NS5-711','USER_LOGIN','USR-ADM-001','users','USR-ADM-001','admin','::1','2026-11-22 15:13:42','{\"email\":\"admin@mediconnect.local\",\"role\":\"admin\"}'),(18,'LOG-MWRZRKA2-304','LOGIN_FAILED','USR-LAB-001','users','USR-LAB-001','lab_technician','::1','2026-11-22 15:28:24','{\"email\":\"lab.anita@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(19,'LOG-MWRZSAPR-61','LOGIN_FAILED','USR-LAB-001','users','USR-LAB-001','lab_technician','::1','2026-11-22 15:28:58','{\"email\":\"lab.anita@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(20,'LOG-MWRZSBAC-725','LOGIN_FAILED','USR-LAB-001','users','USR-LAB-001','lab_technician','::1','2026-11-22 15:28:59','{\"email\":\"lab.anita@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(21,'LOG-MWRZSBU7-130','LOGIN_FAILED','USR-LAB-001','users','USR-LAB-001','lab_technician','::1','2026-11-22 15:28:59','{\"email\":\"lab.anita@mediconnect.local\",\"reason\":\"Password mismatch\"}'),(22,'LOG-MWRZSC76-294','LOGIN_FAILED','USR-LAB-001','users','USR-LAB-001','lab_technician','::1','2026-11-22 15:29:00','{\"email\":\"lab.anita@mediconnect.local\",\"reason\":\"Password mismatch\"}');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_components`
--

DROP TABLE IF EXISTS `blood_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_components`
--

LOCK TABLES `blood_components` WRITE;
/*!40000 ALTER TABLE `blood_components` DISABLE KEYS */;
INSERT INTO `blood_components` VALUES (4,'PRBC-2026-0619','DON-2026-0619','Packed Red Blood Cells',280,'2-6°C','Cold Room B - Shelf 3','2026-01-10 08:30:00','2026-02-21 18:29:59','Released'),(5,'FFP-2026-0619','DON-2026-0619','Fresh Frozen Plasma',200,'-30°C or colder','Deep Freezer D1 - Rack 2','2026-01-10 09:00:00','2027-01-10 18:29:59','Released'),(6,'PLT-2026-0619','DON-2026-0619','Platelet Concentrate',55,'20-24°C with agitation','Platelet Agitator A - Tray 1','2026-01-10 09:15:00','2026-01-15 18:29:59','Released');
/*!40000 ALTER TABLE `blood_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_donations`
--

DROP TABLE IF EXISTS `blood_donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_donations`
--

LOCK TABLES `blood_donations` WRITE;
/*!40000 ALTER TABLE `blood_donations` DISABLE KEYS */;
INSERT INTO `blood_donations` VALUES (1,'DON-2026-0619','DNR-2026-001','ASM-2026-001','O+','Whole Blood','Triple',450,'2026-01-10 04:45:00','2026-02-14','Main Blood Centre - Phlebotomy Bay 1','Released','Fully screened negative and clinically authorized for release','USR-BBS-001','2026-11-22 13:46:15','2026-11-22 13:46:15'),(2,'DON-2026-0742','DNR-2026-002','ASM-2026-002','A+','Whole Blood','Triple',450,'2026-01-12 06:00:00','2026-02-16','Main Blood Centre - Phlebotomy Bay 2','Bio_Lock','BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (HCV)','USR-BBS-001','2026-11-22 13:46:15','2026-11-22 13:46:15'),(3,'DON-2026-0891','DNR-2026-001','ASM-2026-001','O+','Whole Blood','Triple',450,'2026-01-15 04:15:00','2026-02-19','Main Blood Centre - Phlebotomy Bay 1','Quarantined','Mandatory post-collection safety quarantine pending laboratory screening','USR-BBS-001','2026-11-22 13:46:15','2026-11-22 13:46:15');
/*!40000 ALTER TABLE `blood_donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (1,'CMP-2026-01','AIIMS Blood Donation Drive','Rotary Club Delhi & AIIMS','AIIMS Main Auditorium, New Delhi','2026-02-15','09:00:00','17:00:00',150,42,'Upcoming','Annual community blood collection camp in collaboration with AIIMS Blood Centre.','2026-11-22 13:54:33'),(2,'CMP-2026-02','Red Cross Youth Camp','Indian Red Cross Society','Town Hall Grounds, Connaught Place','2026-02-28','10:00:00','16:00:00',100,0,'Upcoming','Youth-oriented voluntary blood drive to support pediatric thalassemia transfusion units.','2026-11-22 13:54:33');
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinical_reviews`
--

DROP TABLE IF EXISTS `clinical_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinical_reviews`
--

LOCK TABLES `clinical_reviews` WRITE;
/*!40000 ALTER TABLE `clinical_reviews` DISABLE KEYS */;
INSERT INTO `clinical_reviews` VALUES (1,'REV-2026-0619','DON-2026-0619','USR-TMO-001','Released','All 5 mandatory TTI screening tests verified non-reactive. ABO/Rh grouping double-checked. Temperature and storage integrity validated. Authorized for clinical release.','2026-11-22 13:54:33');
/*!40000 ALTER TABLE `clinical_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `confidential_follow_ups`
--

DROP TABLE IF EXISTS `confidential_follow_ups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `confidential_follow_ups`
--

LOCK TABLES `confidential_follow_ups` WRITE;
/*!40000 ALTER TABLE `confidential_follow_ups` DISABLE KEYS */;
INSERT INTO `confidential_follow_ups` VALUES (1,'CFU-2026-001','DNR-2026-002','DON-2026-0742','HCV','Reactive Hepatitis C antibody on routine screening (ELISA S/CO 3.42)','Counseling_Scheduled','USR-TMO-001','Donor contacted by Medical Officer via private phone call. In-person confidential pre-test/counseling appointment scheduled at blood centre clinic.','Referred_to_ICTS','2026-11-22 13:54:33','2026-11-22 13:54:33');
/*!40000 ALTER TABLE `confidential_follow_ups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donor_assessments`
--

DROP TABLE IF EXISTS `donor_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_assessments`
--

LOCK TABLES `donor_assessments` WRITE;
/*!40000 ALTER TABLE `donor_assessments` DISABLE KEYS */;
INSERT INTO `donor_assessments` VALUES (1,'ASM-2026-001','DNR-2026-001',72.50,14.2,120,80,72,36.6,1,1,1,0,'Eligible',NULL,'USR-BBS-001','Regular voluntary donor. Clinically sound, cleared for whole blood donation.','2026-11-22 13:46:15'),(2,'ASM-2026-002','DNR-2026-002',56.00,12.8,118,76,75,36.8,1,1,1,0,'Eligible',NULL,'USR-BBS-001','First-time voluntary donor. All vital screening within approved limits.','2026-11-22 13:46:15'),(3,'ASM-2026-003','DNR-2026-003',68.00,11.2,124,82,70,36.5,1,1,1,0,'Temporarily_Deferred',NULL,'USR-BBS-001','Hemoglobin 11.2 g/dL is below mandatory DGHS threshold of 12.5 g/dL. Deferred for 90 days.','2026-11-22 13:46:15');
/*!40000 ALTER TABLE `donor_assessments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donor_deferrals`
--

DROP TABLE IF EXISTS `donor_deferrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_deferrals`
--

LOCK TABLES `donor_deferrals` WRITE;
/*!40000 ALTER TABLE `donor_deferrals` DISABLE KEYS */;
INSERT INTO `donor_deferrals` VALUES (1,'DEF-2026-001','DNR-2026-003','ASM-2026-003','Temporary','Low_Hemoglobin','Hemoglobin 11.2 g/dL below DGHS 12.5 g/dL threshold','2026-01-15','2026-04-15','USR-BBS-001','2026-11-22 13:46:15');
/*!40000 ALTER TABLE `donor_deferrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donors`
--

DROP TABLE IF EXISTS `donors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donors`
--

LOCK TABLES `donors` WRITE;
/*!40000 ALTER TABLE `donors` DISABLE KEYS */;
INSERT INTO `donors` VALUES (1,'DNR-2026-001','USR-DNR-001','Rahul Sharma','O+','1995-04-12','Male','+91 98765 43210','rahul.donor@mediconnect.local','New Delhi','Delhi',3,'2026-01-15','2026-11-22 13:46:15','2026-11-22 13:46:15'),(2,'DNR-2026-002',NULL,'Pooja Verma','A+','1998-08-22','Female','+91 98111 22334','pooja.v@example.com','Mumbai','Maharashtra',1,'2025-11-20','2026-11-22 13:46:15','2026-11-22 13:46:15'),(3,'DNR-2026-003',NULL,'Amit Patel','B+','1992-12-05','Male','+91 99222 33445','amit.patel@example.com','Ahmedabad','Gujarat',5,'2025-10-10','2026-11-22 13:46:15','2026-11-22 13:46:15'),(4,'DNR-2026-004',NULL,'Sunita Rao','AB+','2000-03-30','Female','+91 97333 44556','sunita.rao@example.com','Bengaluru','Karnataka',0,NULL,'2026-11-22 13:46:15','2026-11-22 13:46:15');
/*!40000 ALTER TABLE `donors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_requests`
--

DROP TABLE IF EXISTS `emergency_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_requests`
--

LOCK TABLES `emergency_requests` WRITE;
/*!40000 ALTER TABLE `emergency_requests` DISABLE KEYS */;
INSERT INTO `emergency_requests` VALUES (1,'EMG-2026-01','Apollo Hospital Trauma ICU','USR-HSP-001','O+',4,'Critical','Dr. Vikram Seth','+91 98765 11223','In_Progress','2026-11-22 13:54:33'),(2,'EMG-2026-02','Max Healthcare Cardiac OT',NULL,'AB-',2,'Urgent','Nurse Supervisor Deepa','+91 98111 44556','Open','2026-11-22 13:54:33');
/*!40000 ALTER TABLE `emergency_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laboratory_test_results`
--

DROP TABLE IF EXISTS `laboratory_test_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laboratory_test_results`
--

LOCK TABLES `laboratory_test_results` WRITE;
/*!40000 ALTER TABLE `laboratory_test_results` DISABLE KEYS */;
INSERT INTO `laboratory_test_results` VALUES (1,'LAB-0619-HIV','DON-2026-0619','HIV','Non-Reactive','LOT-HIV-2026A',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-11 04:30:00','CMIA Non-reactive S/CO 0.08'),(2,'LAB-0619-HBS','DON-2026-0619','HBSAG','Non-Reactive','LOT-HBS-2026C',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-11 04:30:00','HBsAg Non-reactive 0.12 IU/mL'),(3,'LAB-0619-HCV','DON-2026-0619','HCV','Non-Reactive','LOT-HCV-2026B',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-11 04:30:00','ELISA optical density 0.04 (cutoff 0.20)'),(4,'LAB-0619-SYP','DON-2026-0619','SYPHILIS','Non-Reactive','LOT-TPH-2026X',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-11 04:30:00','TPHA Non-reactive'),(5,'LAB-0619-MAL','DON-2026-0619','MALARIA','Non-Reactive','LOT-MAL-2026M',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-11 04:30:00','Antigen rapid strip negative'),(6,'LAB-0742-HIV','DON-2026-0742','HIV','Non-Reactive','LOT-HIV-2026A',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-13 08:30:00','Non-reactive'),(7,'LAB-0742-HBS','DON-2026-0742','HBSAG','Non-Reactive','LOT-HBS-2026C',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-13 08:30:00','Non-reactive'),(8,'LAB-0742-HCV','DON-2026-0742','HCV','Reactive','LOT-HCV-2026B',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-13 08:30:00','INITIAL REACTIVE ELISA (S/CO 3.42). Unit placed under Bio-Lock.'),(9,'LAB-0742-SYP','DON-2026-0742','SYPHILIS','Non-Reactive','LOT-TPH-2026X',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-13 08:30:00','Non-reactive'),(10,'LAB-0742-MAL','DON-2026-0742','MALARIA','Non-Reactive','LOT-MAL-2026M',NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33','USR-TMO-001','2026-01-13 08:30:00','Non-reactive'),(11,'LAB-0891-HIV','DON-2026-0891','HIV','Pending',NULL,NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33',NULL,NULL,'Specimen received in serology batch B26-101'),(12,'LAB-0891-HBS','DON-2026-0891','HBSAG','Pending',NULL,NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33',NULL,NULL,'Specimen received in serology batch B26-101'),(13,'LAB-0891-HCV','DON-2026-0891','HCV','Pending',NULL,NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33',NULL,NULL,'Specimen received in serology batch B26-101'),(14,'LAB-0891-SYP','DON-2026-0891','SYPHILIS','Pending',NULL,NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33',NULL,NULL,'Specimen received in serology batch B26-101'),(15,'LAB-0891-MAL','DON-2026-0891','MALARIA','Pending',NULL,NULL,NULL,'USR-LAB-001','2026-11-22 13:54:33',NULL,NULL,'Specimen received in serology batch B26-101');
/*!40000 ALTER TABLE `laboratory_test_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `screening_test_catalogue`
--

DROP TABLE IF EXISTS `screening_test_catalogue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `screening_test_catalogue`
--

LOCK TABLES `screening_test_catalogue` WRITE;
/*!40000 ALTER TABLE `screening_test_catalogue` DISABLE KEYS */;
INSERT INTO `screening_test_catalogue` VALUES (1,'HIV','HIV-1/2 4th Gen Ag/Ab Combo','TTI_Serology','Chemiluminescent Microparticle Immunoassay (CMIA)',1,'Non-Reactive','2026-11-22 13:46:15'),(2,'HBSAG','Hepatitis B Surface Antigen (HBsAg)','TTI_Serology','Chemiluminescence (CLIA)',1,'Non-Reactive','2026-11-22 13:46:15'),(3,'HCV','Hepatitis C Virus Antibody (Anti-HCV)','TTI_Serology','ELISA 3rd Generation',1,'Non-Reactive','2026-11-22 13:46:15'),(4,'SYPHILIS','Treponema pallidum Hemagglutination (TPHA)','TTI_Serology','TPHA / RPR Syphilis Screen',1,'Non-Reactive','2026-11-22 13:46:15'),(5,'MALARIA','Malaria Parasite Antigen (Pan/Pf)','TTI_Serology','Rapid Immunochromatographic Assay / Blood Film',1,'Non-Reactive','2026-11-22 13:46:15'),(6,'ABO_RH','Blood Group & Rh(D) Confirmation','Immunohematology','Forward & Reverse Tube Agglutination',1,'Confirmed','2026-11-22 13:46:15');
/*!40000 ALTER TABLE `screening_test_catalogue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'USR-ADM-001','System Administrator','admin@mediconnect.local','$2a$10$IxLWtwcFXlOtFl4SKpaoteAdQg6doSBkP/P.aAguW06ZYw4quP7/K','admin','IT & Systems',1,'2026-11-22 13:46:15','2026-11-22 15:13:22'),(2,'USR-BBS-001','Staff Nurse Rohit Verma','staff.rohit@mediconnect.local','$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y','blood_bank_staff','Blood Bank Phlebotomy',1,'2026-11-22 13:46:15','2026-11-22 13:46:15'),(3,'USR-LAB-001','Technician Anita Rao','lab.anita@mediconnect.local','$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y','lab_technician','Serology & Screening Lab',1,'2026-11-22 13:46:15','2026-11-22 13:46:15'),(4,'USR-TMO-001','Dr. Priya Nair (TMO)','dr.priya.tmo@mediconnect.local','$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y','clinical_reviewer','Transfusion Medicine Quality Office',1,'2026-11-22 13:46:15','2026-11-22 13:46:15'),(5,'USR-DNR-001','Rahul Sharma','rahul.donor@mediconnect.local','$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y','donor','Community Donors',1,'2026-11-22 13:46:15','2026-11-22 13:46:15'),(6,'USR-HSP-001','Coordinator Vikram Seth','coord.vikram@cityhospital.local','$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y','hospital_coordinator','Apollo Emergency Transfusion Dept',1,'2026-11-22 13:46:15','2026-11-22 13:46:15');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mediconnect_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-22 21:03:28
