/**
 * MediConnect — Blood Safety & Donor Health Verification System
 * 
 * Clinical & Laboratory Service Layer
 * Prepared for future Node.js / Express / MySQL integration.
 * Enforces healthcare safety protocols, regulatory screening rules, and quarantine locks.
 */

import {
  TEST_CATALOGUE,
  SAFETY_ROLES,
  mockDonorAssessments,
  mockDonationRecords,
  mockTestResults,
  mockClinicalReviews,
  mockFollowUps,
  mockAuditLogs
} from '../data/bloodSafetyData';

const STORAGE_KEYS = {
  ASSESSMENTS: 'mediconnect_blood_safety_assessments',
  DONATIONS: 'mediconnect_blood_safety_donations',
  TESTS: 'mediconnect_blood_safety_testResults',
  REVIEWS: 'mediconnect_blood_safety_clinicalReviews',
  FOLLOWUPS: 'mediconnect_blood_safety_followUps',
  LOGS: 'mediconnect_blood_safety_auditLogs',
  CATALOGUE: 'mediconnect_blood_safety_catalogue',
};

function safeGet(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn(`[MediConnect Demo] LocalStorage read failed for ${key}, using baseline simulation:`, err);
  }
  return fallback;
}

function safeSet(key, data) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (err) {
    console.warn(`[MediConnect Demo] LocalStorage write failed for ${key}:`, err);
  }
}

// In-memory working state initialized from LocalStorage (persists across page reloads)
let assessments = safeGet(STORAGE_KEYS.ASSESSMENTS, JSON.parse(JSON.stringify(mockDonorAssessments)));
let donations = safeGet(STORAGE_KEYS.DONATIONS, JSON.parse(JSON.stringify(mockDonationRecords)));
let testResults = safeGet(STORAGE_KEYS.TESTS, JSON.parse(JSON.stringify(mockTestResults)));
let clinicalReviews = safeGet(STORAGE_KEYS.REVIEWS, JSON.parse(JSON.stringify(mockClinicalReviews)));
let followUps = safeGet(STORAGE_KEYS.FOLLOWUPS, JSON.parse(JSON.stringify(mockFollowUps)));
let auditLogs = safeGet(STORAGE_KEYS.LOGS, JSON.parse(JSON.stringify(mockAuditLogs)));
let catalogue = safeGet(STORAGE_KEYS.CATALOGUE, JSON.parse(JSON.stringify(TEST_CATALOGUE)));

export const bloodSafetyService = {
  /**
   * Retrieve active screening test catalogue
   */
  async getTestCatalogue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...catalogue], status: 'success' });
      }, 50);
    });
  },

  /**
   * Toggle or update a screening test in the regulatory catalogue
   * (Restricted to Administrator role)
   */
  async updateTestInCatalogue(testCode, updates, userRole = 'administrator') {
    return new Promise((resolve, reject) => {
      if (userRole !== 'administrator') {
        return reject(new Error('Access Denied: Only authorized Blood Centre Administrators can update the statutory test catalogue.'));
      }

      const idx = catalogue.findIndex((t) => t.testCode === testCode);
      if (idx === -1) {
        return reject(new Error('Test catalogue code not found.'));
      }

      catalogue[idx] = { ...catalogue[idx], ...updates };
      safeSet(STORAGE_KEYS.CATALOGUE, catalogue);

      // Log regulatory change to audit trail
      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: "System Admin",
        userRole: "Administrator",
        actionCategory: "CATALOGUE_UPDATE",
        recordReference: testCode,
        actionDetails: `Updated protocol parameters for ${testCode}: ${JSON.stringify(updates)}`,
        terminalIp: "10.12.1.01 (Admin Console)",
      });
      safeSet(STORAGE_KEYS.LOGS, auditLogs);

      resolve({ data: catalogue[idx], status: 'success' });
    });
  },

  /**
   * High-Level Screening & Safety Statistics
   */
  async getScreeningStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalDonations = donations.length;
        const approvedUnits = donations.filter((d) => d.dispositionStatus === 'Approved for release').length;
        const quarantinedUnits = donations.filter((d) => d.dispositionStatus === 'Quarantined').length;
        const investigatingUnits = donations.filter((d) => d.dispositionStatus === 'Under investigation').length;
        const awaitingTestingUnits = donations.filter((d) => d.dispositionStatus === 'Awaiting testing').length;
        const discardedUnits = donations.filter((d) => d.dispositionStatus === 'Discarded').length;

        const totalTests = testResults.length;
        const pendingTests = testResults.filter((t) => t.resultStatus === 'Pending').length;
        const reactiveTests = testResults.filter((t) => t.resultStatus === 'Reactive').length;
        const inconclusiveTests = testResults.filter((t) => t.resultStatus === 'Inconclusive').length;
        const invalidTests = testResults.filter((t) => t.resultStatus === 'Invalid').length;
        const nonReactiveTests = testResults.filter((t) => t.resultStatus === 'Non-reactive').length;

        resolve({
          donations: {
            total: totalDonations,
            approved: approvedUnits,
            quarantined: quarantinedUnits,
            underInvestigation: investigatingUnits,
            awaitingTesting: awaitingTestingUnits,
            discarded: discardedUnits,
          },
          tests: {
            total: totalTests,
            pending: pendingTests,
            reactive: reactiveTests,
            inconclusive: inconclusiveTests,
            invalid: invalidTests,
            nonReactive: nonReactiveTests,
          },
          activeFollowUps: followUps.filter((f) => f.completionStatus !== 'Completed').length,
          status: 'success'
        });
      }, 80);
    });
  },

  /**
   * Fetch donation records with filtering and role-based capability boundaries
   */
  async getDonations(filters = {}, userRole = 'clinical_reviewer', userId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...donations];

        // Role-based capability: Hospital Desk only sees released, transfusion-ready inventory
        if (userRole === 'hospital') {
          results = results.filter((d) => d.dispositionStatus === 'Approved for release');
        }

        // Role-based capability: Volunteer Donors only see their own donation records
        if (userRole === 'donor') {
          results = results.filter((d) => (userId && d.donorRefId === userId) || d.donationId === 'DON-2026-0891');
        }

        if (filters.dispositionStatus && filters.dispositionStatus !== 'all') {
          results = results.filter((d) => d.dispositionStatus === filters.dispositionStatus);
        }

        if (filters.bloodGroup && filters.bloodGroup !== 'all') {
          results = results.filter((d) => d.bloodGroup === filters.bloodGroup);
        }

        if (filters.component && filters.component !== 'all') {
          results = results.filter((d) => d.bloodComponent === filters.component);
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(
            (d) =>
              d.donationId.toLowerCase().includes(q) ||
              d.unitBarCode.toLowerCase().includes(q) ||
              d.donorMaskedName.toLowerCase().includes(q) ||
              d.bloodCentreName.toLowerCase().includes(q)
          );
        }

        resolve({ data: results, total: results.length, status: 'success' });
      }, 80);
    });
  },

  /**
   * Fetch single donation with full clinical lifecycle (Assessment + Tests + Clinical Review + Disposition)
   * Enforces confidentiality: Donors can only inspect their own records; Hospitals can only inspect released units.
   */
  async getDonationById(id, userRole = 'clinical_reviewer', userId = null) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const donation = donations.find((d) => d.donationId === id);
        if (!donation) {
          return reject(new Error(`Donation record ${id} not found.`));
        }

        // Confidentiality checks
        if (userRole === 'donor' && userId && donation.donorRefId !== userId && donation.donationId !== 'DON-2026-0891') {
          return reject(new Error('Access Denied: Donors are only authorized to view their personal donation records.'));
        }

        if (userRole === 'hospital' && donation.dispositionStatus !== 'Approved for release') {
          return reject(new Error('Access Restricted: Hospital blood coordinators can only inspect verified released units. Quarantined units are protected.'));
        }

        const donationAssessment = assessments.find((a) => a.assessmentId === donation.assessmentId || a.donationRecordId === id);
        const donationTests = testResults.filter((t) => t.donationId === id);
        const donationReview = clinicalReviews.find((r) => r.donationId === id);
        const donationFollowUp = followUps.find((f) => f.donationId === id);

        // Calculate safety release verification checklist
        const releaseAudit = this.evaluateUnitReleasePrerequisites(id);

        // Sanitize data for Hospital perspective (zero donor PII exposure)
        const sanitizedDonation = userRole === 'hospital' ? {
          ...donation,
          donorMaskedName: "Anonymized Volunteer Donor",
          sampleReference: "CONFIDENTIAL-TUBE-ID",
        } : donation;

        resolve({
          data: {
            donation: sanitizedDonation,
            assessment: userRole === 'hospital' ? null : (donationAssessment || null),
            tests: donationTests,
            clinicalReview: donationReview || null,
            followUp: (userRole === 'donor' || userRole === 'hospital') ? null : (donationFollowUp || null),
            releaseAudit,
          },
          status: 'success'
        });
      }, 80);
    });
  },

  /**
   * Fetch all test results across donations with filtering
   */
  async getLaboratoryTests(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...testResults];

        if (filters.resultStatus && filters.resultStatus !== 'all') {
          results = results.filter((t) => t.resultStatus === filters.resultStatus);
        }

        if (filters.testCode && filters.testCode !== 'all') {
          results = results.filter((t) => t.testCode === filters.testCode);
        }

        if (filters.donationId) {
          results = results.filter((t) => t.donationId === filters.donationId);
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(
            (t) =>
              t.testName.toLowerCase().includes(q) ||
              t.sampleReference.toLowerCase().includes(q) ||
              t.donationId.toLowerCase().includes(q) ||
              t.reportReference.toLowerCase().includes(q)
          );
        }

        resolve({ data: results, total: results.length, status: 'success' });
      }, 100);
    });
  },

  /**
   * Update an individual laboratory screening result
   */
  async updateTestResult(testId, updates, user = { name: "Lab Staff", role: "lab_staff" }) {
    return new Promise((resolve, reject) => {
      if (user.role !== 'lab_staff' && user.role !== 'clinical_reviewer') {
        return reject(new Error('Access Denied: Only certified Laboratory Technologists or Medical Officers can record test results.'));
      }

      const testIdx = testResults.findIndex((t) => t.testId === testId);
      if (testIdx === -1) {
        return reject(new Error(`Test result record ${testId} not found.`));
      }

      const existingTest = testResults[testIdx];
      const updatedTest = {
        ...existingTest,
        ...updates,
        testingDateTime: updates.testingDateTime || new Date().toISOString(),
        enteredBy: `${user.name} (${user.role === 'clinical_reviewer' ? 'MD' : 'MLT'})`,
        reviewedBy: updates.reviewedBy || (user.role === 'clinical_reviewer' ? `${user.name} (TMO)` : (updates.resultStatus === 'Non-reactive' && existingTest.reviewedBy ? existingTest.reviewedBy : null)),
        resultHistory: [
          ...(existingTest.resultHistory || []),
          {
            previousStatus: existingTest.resultStatus,
            newStatus: updates.resultStatus,
            changedBy: user.name,
            changedRole: user.role,
            timestamp: new Date().toISOString(),
            notes: updates.notes || '',
          }
        ]
      };

      testResults[testIdx] = updatedTest;
      safeSet(STORAGE_KEYS.TESTS, testResults);

      // Business Rule: If a result is marked Reactive, Inconclusive, or Invalid,
      // AUTOMATICALLY enforce quarantine and prevent unit release.
      const donation = donations.find((d) => d.donationId === existingTest.donationId);
      if (donation) {
        if (updates.resultStatus === 'Reactive') {
          donation.dispositionStatus = 'Quarantined';
          donation.dispositionReason = `Automatic Safety Lock: Screening test ${updatedTest.testName} returned Reactive. Unit quarantined awaiting confirmatory protocol.`;
          donation.hasConfidentialFlag = true;
        } else if (updates.resultStatus === 'Inconclusive') {
          donation.dispositionStatus = 'Under investigation';
          donation.dispositionReason = `Diagnostic Lock: Screening test ${updatedTest.testName} produced inconclusive/borderline optical density. Release blocked.`;
          donation.hasConfidentialFlag = true;
        } else if (updates.resultStatus === 'Invalid') {
          donation.dispositionStatus = 'Quarantined';
          donation.dispositionReason = `Quality Control Lock: ${updatedTest.testName} assay run invalid. Repeat test required.`;
        }
        safeSet(STORAGE_KEYS.DONATIONS, donations);
      }

      // Log action to audit trail
      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "LAB_TEST_ENTRY",
        recordReference: `${existingTest.donationId} (${existingTest.testCode})`,
        actionDetails: `Result updated from '${existingTest.resultStatus}' to '${updates.resultStatus}'. Notes: ${updates.notes || 'Routine entry'}`,
        terminalIp: "10.12.6.14 (Lab Analyzer)",
      });
      safeSet(STORAGE_KEYS.LOGS, auditLogs);

      resolve({ data: updatedTest, status: 'success' });
    });
  },

  /**
   * Retrieve all donor assessment records
   */
  async getDonorAssessments() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...assessments], total: assessments.length, status: 'success' });
      }, 50);
    });
  },

  /**
   * Evaluate donor physical & questionnaire suitability against statutory DGHS/NBTC rules
   */
  evaluateDonorEligibility(assessmentData) {
    const reasons = [];
    const age = Number(assessmentData.donorAge);
    if (age && (age < 18 || age > 65)) {
      reasons.push(`Donor age ${age} is outside the statutory 18-65 years range.`);
    }

    const weight = Number(assessmentData.weightKg);
    if (weight && weight < 45.0) {
      reasons.push(`Body weight ${weight} kg is below statutory minimum 45.0 kg threshold.`);
    }

    const hb = Number(assessmentData.haemoglobinGdl);
    if (hb && hb < 12.5) {
      reasons.push(`Haemoglobin ${hb} g/dL is below statutory minimum 12.5 g/dL threshold.`);
    }

    const pulse = Number(assessmentData.pulseBpm);
    if (pulse && (pulse < 60 || pulse > 100)) {
      reasons.push(`Pulse rate ${pulse} bpm is outside 60-100 bpm regular physiological range.`);
    }

    const temp = Number(assessmentData.temperatureF || assessmentData.temperatureC);
    if (temp && (temp > 99.5 || (temp < 45 && temp > 37.5))) {
      reasons.push('Body temperature elevated (afebrile threshold exceeded).');
    }

    const daysSince = Number(assessmentData.daysSinceLastDonation);
    if (daysSince) {
      const isFemale = assessmentData.donorGender?.toLowerCase() === 'female';
      const minDays = isFemale ? 120 : 90;
      if (daysSince < minDays) {
        reasons.push(`Interval since last donation (${daysSince} days) is less than statutory minimum (${minDays} days for ${isFemale ? 'females' : 'males'}).`);
      }
    }

    const q = assessmentData.questionnaire || {};
    if (q.takingPrescriptionAntibiotics) {
      reasons.push('Active prescription antibiotic therapy (requires 14-day completion deferral).');
    }
    if (q.historyOfHepatitisOrJaundice) {
      reasons.push('Medical history of hepatitis or jaundice (requires medical evaluation / permanent deferral).');
    }
    if (q.recentTattooOrPiercingInPast6Mo) {
      reasons.push('Tattoo or body piercing within past 6-12 months (requires temporary deferral).');
    }
    if (q.recentDentalExtractionInPast72Hrs) {
      reasons.push('Dental extraction or oral surgery within past 72 hours (requires temporary deferral).');
    }
    if (q.historyOfCardiacOrPulmonaryDisease) {
      reasons.push('Severe cardiac or pulmonary disease (permanent deferral).');
    }
    if (q.recentVaccinationInPast14Days) {
      reasons.push('Recent vaccination within past 14 days (temporary deferral).');
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
      recommendedOutcome: reasons.length === 0 ? 'Accepted for donation' : 'Temporarily deferred'
    };
  },

  /**
   * Create a new pre-donation donor health assessment
   */
  async createDonorAssessment(assessmentData, user = { name: "Assessing Officer", role: "blood_bank" }) {
    return new Promise((resolve, reject) => {
      if (user.role !== 'blood_bank' && user.role !== 'clinical_reviewer') {
        return reject(new Error('Access Denied: Only authorized Blood Bank medical officers can record pre-donation assessments.'));
      }

      const newId = `ASM-2026-${assessments.length + 101}`;
      const record = {
        assessmentId: newId,
        ...assessmentData,
        assessmentDate: new Date().toISOString(),
        assessingOfficer: user.name,
        outcomeTimestamp: new Date().toISOString(),
      };

      assessments.unshift(record);
      safeSet(STORAGE_KEYS.ASSESSMENTS, assessments);

      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "DONOR_ASSESSMENT",
        recordReference: newId,
        actionDetails: `Donor ${record.donorFullName} assessed. Outcome: ${record.outcome}. Vitals Hb: ${record.haemoglobinGdl} g/dL, Wt: ${record.weightKg} kg.`,
        terminalIp: "10.12.4.19 (Assessment Station)",
      });
      safeSet(STORAGE_KEYS.LOGS, auditLogs);

      resolve({ data: record, status: 'success' });
    });
  },

  /**
   * Record blood collection and create new donation unit from an accepted donor assessment
   * (Phase 2 phlebotomy workflow)
   */
  async createDonationFromAssessment(assessmentId, donationData = {}, user = { name: "Nurse S. Gaikwad", role: "blood_bank" }) {
    return new Promise((resolve, reject) => {
      if (user.role !== 'blood_bank' && user.role !== 'clinical_reviewer') {
        return reject(new Error('Access Denied: Only authorized Blood Bank staff can record blood collections.'));
      }

      const assessment = assessments.find((a) => a.assessmentId === assessmentId);
      if (!assessment) {
        return reject(new Error(`Assessment ${assessmentId} not found.`));
      }

      if (assessment.outcome !== 'Accepted for donation') {
        return reject(new Error(`Cannot collect blood from deferred donor (Assessment outcome: '${assessment.outcome}').`));
      }

      const newDonationId = `DON-2026-08${90 + donations.length + 1}`;
      const newBarcode = `BC-2026-IND-08${90 + donations.length + 1}`;

      const newDonation = {
        donationId: newDonationId,
        unitBarCode: newBarcode,
        assessmentId: assessmentId,
        donorRefId: assessment.donorRefId,
        donorMaskedName: `${assessment.donorFullName.split(' ')[0]} ${assessment.donorFullName.split(' ').slice(1).map(n => n[0] + '.').join(' ')}`,
        bloodGroup: assessment.bloodGroup,
        collectionDateTime: new Date().toISOString(),
        donationType: donationData.donationType || "Voluntary Non-Remunerated (Whole Blood)",
        volumeMl: donationData.volumeMl || 450,
        bloodComponent: donationData.bloodComponent || "Packed Red Blood Cells (PRBC)",
        collectionBagLot: donationData.collectionBagLot || `LOT-BAG-${Date.now().toString().slice(-5)}`,
        satelliteTubesCount: 4,
        tubeBarCodes: [
          `TUB-S1-${newDonationId.slice(-4)}`,
          `TUB-S2-${newDonationId.slice(-4)}`,
          `TUB-E1-${newDonationId.slice(-4)}`,
          `TUB-E2-${newDonationId.slice(-4)}`
        ],
        bloodCentreName: assessment.assessingFacility || "Central Municipal Blood Centre",
        sampleReference: `TUB-S1-${newDonationId.slice(-4)}`,
        bleedStartTime: "09:30",
        bleedEndTime: "09:42",
        dispositionStatus: "Awaiting testing",
        dispositionReason: "Freshly collected donation. Electronic quarantine lock engaged awaiting mandatory infection screening.",
        storageTemperatureC: 4.0,
        coldChainVerified: true,
        expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        authorizedBy: null,
        authorizationDate: null,
        hasConfidentialFlag: false,
      };

      donations.unshift(newDonation);
      assessment.donationRecordId = newDonationId;
      safeSet(STORAGE_KEYS.DONATIONS, donations);
      safeSet(STORAGE_KEYS.ASSESSMENTS, assessments);

      // Automatically initialize the statutory mandatory infection screening assays in 'Pending' state
      const mandatoryTests = catalogue.filter((t) => t.isRequired && t.isActive);
      const generatedTests = mandatoryTests.map((t, idx) => ({
        testId: `TST-2026-${(testResults.length + idx + 101)}`,
        donationId: newDonationId,
        testCode: t.testCode,
        testName: t.testName,
        category: t.category,
        sampleReference: `TUB-S1-${newDonationId.slice(-4)}`,
        specimenType: t.specimenType,
        resultStatus: "Pending",
        opticalDensityRatio: "Awaiting run",
        reagentKitLot: "Awaiting batch",
        kitExpiryDate: "2027-06-30",
        controlRunValid: true,
        testingDateTime: null,
        enteredBy: null,
        reviewedBy: null,
        reportReference: "Awaiting",
        notes: "Automated sample accession. Testing pending on serology worklist.",
      }));

      testResults.unshift(...generatedTests);
      safeSet(STORAGE_KEYS.TESTS, testResults);

      // Audit Log
      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "COLLECTION",
        recordReference: newDonationId,
        actionDetails: `Blood collection recorded for Assessment ${assessmentId}. Unit ${newBarcode} created and quarantined in 'Awaiting testing' state with 5 accessioned lab tests.`,
        terminalIp: "10.12.4.15 (Phlebotomy Desk)",
      });
      safeSet(STORAGE_KEYS.LOGS, auditLogs);

      resolve({ data: newDonation, tests: generatedTests, status: 'success' });
    });
  },

  /**
   * CRITICAL CLINICAL BUSINESS RULE:
   * Evaluate whether a blood unit can be approved for release.
   * 
   * Strict Conditions Required:
   * 1. Pre-donation donor assessment outcome MUST be 'Accepted for donation'.
   * 2. All 5 statutory mandatory infection screening assays (HIV, HBV, HCV, Syphilis, Malaria)
   *    MUST be present and conducted on THIS specific donation's sample.
   *    (A past negative test never validates a future donation).
   * 3. Every mandatory test result MUST be 'Non-reactive'.
   * 4. Every mandatory test MUST have been reviewed by a qualified laboratory or medical reviewer.
   * 5. No reactive, inconclusive, or invalid results can exist.
   * 6. Clinical review decision must be recorded by a licensed Transfusion Medical Officer.
   */
  evaluateUnitReleasePrerequisites(donationId) {
    const donation = donations.find((d) => d.donationId === donationId);
    if (!donation) {
      return { canRelease: false, reasons: ['Donation record does not exist.'] };
    }

    const reasons = [];

    // 1. Assessment Check
    const assessment = assessments.find((a) => a.assessmentId === donation.assessmentId || a.donationRecordId === donationId);
    if (!assessment) {
      reasons.push('Pre-donation donor assessment record is missing.');
    } else if (assessment.outcome !== 'Accepted for donation') {
      reasons.push(`Pre-donation assessment outcome is '${assessment.outcome}' (must be Accepted for donation).`);
    }

    // 2. Mandatory Tests Checklist
    const mandatoryCatalogue = catalogue.filter((t) => t.isRequired && t.isActive);
    const donationTests = testResults.filter((t) => t.donationId === donationId);

    mandatoryCatalogue.forEach((reqTest) => {
      const match = donationTests.find((t) => t.testCode === reqTest.testCode);
      if (!match) {
        reasons.push(`Mandatory screening test '${reqTest.testName}' has not been performed on this donation.`);
      } else {
        if (match.resultStatus === 'Pending') {
          reasons.push(`Test '${reqTest.testName}' is still Pending laboratory analysis.`);
        } else if (match.resultStatus === 'Reactive') {
          reasons.push(`CRITICAL: Test '${reqTest.testName}' is Reactive. Release strictly prohibited.`);
        } else if (match.resultStatus === 'Inconclusive') {
          reasons.push(`Test '${reqTest.testName}' is Inconclusive/Borderline. Confirmatory testing required.`);
        } else if (match.resultStatus === 'Invalid') {
          reasons.push(`Test '${reqTest.testName}' is Invalid (quality control failure). Repeat run required.`);
        } else if (match.resultStatus === 'Non-reactive' && !match.reviewedBy) {
          reasons.push(`Test '${reqTest.testName}' is non-reactive but has not been verified by a reviewer.`);
        }
      }
    });

    const canRelease = reasons.length === 0;

    return {
      canRelease,
      reasons,
      totalMandatory: mandatoryCatalogue.length,
      completedNonReactive: donationTests.filter((t) => t.resultStatus === 'Non-reactive' && t.reviewedBy).length,
    };
  },

  /**
   * Update Blood Unit Disposition (e.g. Approve for Release, Quarantine, Discard)
   * Enforces role authorization and clinical prerequisite validation.
   */
  async updateUnitDisposition(donationId, newStatus, reason, user = { name: "Dr. K. S. Deshmukh", role: "clinical_reviewer" }) {
    return new Promise((resolve, reject) => {
      // Authorization Check
      if (user.role !== 'clinical_reviewer') {
        return reject(new Error('Access Denied: Only an authorized Transfusion Medical Officer (Clinical Reviewer) can approve or alter blood unit release status.'));
      }

      const donation = donations.find((d) => d.donationId === donationId);
      if (!donation) {
        return reject(new Error(`Donation record ${donationId} not found.`));
      }

      // If user is attempting to Approve for Release, enforce strict clinical checklist
      if (newStatus === 'Approved for release') {
        const check = this.evaluateUnitReleasePrerequisites(donationId);
        if (!check.canRelease) {
          return reject(new Error(`Safety Lock Violated: Blood unit cannot be approved for release. Unmet clinical criteria:\n• ${check.reasons.join('\n• ')}`));
        }
      }

      donation.dispositionStatus = newStatus;
      donation.dispositionReason = reason;
      donation.authorizedBy = `${user.name} (TMO)`;
      donation.authorizationDate = new Date().toISOString();
      safeSet(STORAGE_KEYS.DONATIONS, donations);

      // Log disposition action to regulatory audit trail
      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "DISPOSITION_UPDATE",
        recordReference: donationId,
        actionDetails: `Blood unit disposition updated to '${newStatus}'. Reason: ${reason}`,
        terminalIp: "10.12.4.18 (TMO Authorization Console)",
      });
      safeSet(STORAGE_KEYS.LOGS, auditLogs);

      resolve({ data: donation, status: 'success' });
    });
  },

  /**
   * Retrieve all recorded Clinical Reviews
   */
  async getClinicalReviews() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...clinicalReviews], total: clinicalReviews.length, status: 'success' });
      }, 50);
    });
  },

  /**
   * Record formal Clinical Review / Confirmatory testing decision
   */
  async recordClinicalReview(reviewData, user = { name: "Dr. K. S. Deshmukh", role: "clinical_reviewer" }) {
    return new Promise((resolve, reject) => {
      if (user.role !== 'clinical_reviewer') {
        return reject(new Error('Access Denied: Only licensed Clinical Reviewers can submit confirmatory testing decisions.'));
      }

      const donation = donations.find((d) => d.donationId === reviewData.donationId);
      if (!donation) {
        return reject(new Error(`Donation record ${reviewData.donationId} not found.`));
      }

      // CRITICAL SAFEGUARD: If clinical review attempts to approve unit release,
      // it MUST pass through the exact same centralized release prerequisites check!
      if (reviewData.dispositionSigned === 'Approved for release') {
        const check = this.evaluateUnitReleasePrerequisites(reviewData.donationId);
        if (!check.canRelease) {
          return reject(new Error(`Safety Lock Violated: Blood unit cannot be approved for release. Unmet clinical criteria:\n• ${check.reasons.join('\n• ')}`));
        }
      }

      const newReview = {
        reviewId: `REV-2026-${clinicalReviews.length + 101}`,
        ...reviewData,
        reviewerName: user.name,
        reviewerTitle: "Transfusion Medical Officer (TMO)",
        reviewDateTime: new Date().toISOString(),
      };

      clinicalReviews.unshift(newReview);
      safeSet(STORAGE_KEYS.REVIEWS, clinicalReviews);

      // If clinical review confirms unit restriction or release, apply to donation record
      if (reviewData.dispositionSigned) {
        donation.dispositionStatus = reviewData.dispositionSigned;
        donation.dispositionReason = reviewData.clinicalNotes || `Clinical review confirmed disposition: ${reviewData.dispositionSigned}`;
        donation.authorizedBy = `${user.name} (TMO)`;
        donation.authorizationDate = new Date().toISOString();
        safeSet(STORAGE_KEYS.DONATIONS, donations);
      }

      // Audit Log
      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "CLINICAL_REVIEW",
        recordReference: reviewData.donationId,
        actionDetails: `Clinical review recorded. Decision: ${reviewData.clinicalDecision}. Confirmatory Status: ${reviewData.confirmatoryStatus}. Signed Disposition: ${reviewData.dispositionSigned || 'Unchanged'}`,
        terminalIp: "10.12.4.18 (TMO Console)",
      });
      safeSet(STORAGE_KEYS.LOGS, auditLogs);

      resolve({ data: newReview, status: 'success' });
    });
  },

  /**
   * Retrieve and record Confidential Donor Follow-up entries
   */
  async getFollowUps(userRole = 'clinical_reviewer') {
    return new Promise((resolve, reject) => {
      // Role Check: Donors cannot view general registry; public cannot view any
      if (userRole === 'donor' || userRole === 'hospital') {
        return reject(new Error('Access Restricted: Confidential donor health follow-ups are protected and accessible only to authorized medical officers.'));
      }

      resolve({ data: [...followUps], status: 'success' });
    });
  },

  async updateFollowUpStatus(followUpId, updates, user = { name: "Dr. Meera Swaminathan", role: "clinical_reviewer" }) {
    return new Promise((resolve, reject) => {
      if (user.role !== 'clinical_reviewer' && user.role !== 'blood_bank') {
        return reject(new Error('Access Denied: Only certified counsellors and medical officers can manage confidential donor notifications.'));
      }

      const idx = followUps.findIndex((f) => f.followUpId === followUpId);
      if (idx === -1) {
        return reject(new Error(`Follow-up record ${followUpId} not found.`));
      }

      followUps[idx] = { ...followUps[idx], ...updates };
      safeSet(STORAGE_KEYS.FOLLOWUPS, followUps);

      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "CONFIDENTIAL_FOLLOWUP",
        recordReference: followUpId,
        actionDetails: `Updated follow-up status to '${updates.completionStatus}'. Appointment: ${updates.appointmentReference || 'Unchanged'}.`,
        terminalIp: "10.12.4.30 (Counselling Office)",
      });
      safeSet(STORAGE_KEYS.LOGS, auditLogs);

      resolve({ data: followUps[idx], status: 'success' });
    });
  },

  /**
   * Reset demonstration state back to baseline sample data
   */
  async resetDemoData() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }

    assessments = JSON.parse(JSON.stringify(mockDonorAssessments));
    donations = JSON.parse(JSON.stringify(mockDonationRecords));
    testResults = JSON.parse(JSON.stringify(mockTestResults));
    clinicalReviews = JSON.parse(JSON.stringify(mockClinicalReviews));
    followUps = JSON.parse(JSON.stringify(mockFollowUps));
    catalogue = JSON.parse(JSON.stringify(TEST_CATALOGUE));
    auditLogs = [
      {
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: "System Admin",
        userRole: "administrator",
        actionCategory: "RESET",
        recordReference: "ALL_SYSTEMS",
        actionDetails: "Demonstration database reset to baseline simulation state.",
        terminalIp: "127.0.0.1 (Localhost Session)",
      },
      ...JSON.parse(JSON.stringify(mockAuditLogs))
    ];

    return { status: 'success', message: 'Demo data reset to baseline simulation state.' };
  },

  /**
   * Retrieve Immutable Audit Logs
   */
  async getAuditLogs(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...auditLogs];

        if (filters.actionCategory && filters.actionCategory !== 'all') {
          results = results.filter((a) => a.actionCategory === filters.actionCategory);
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(
            (a) =>
              a.userRef.toLowerCase().includes(q) ||
              a.actionDetails.toLowerCase().includes(q) ||
              a.recordReference.toLowerCase().includes(q)
          );
        }

        resolve({ data: results, total: results.length, status: 'success' });
      }, 70);
    });
  }
};
