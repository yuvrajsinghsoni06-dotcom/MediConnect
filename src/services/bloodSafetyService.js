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

// In-memory working state simulating database tables during application session
let assessments = [...mockDonorAssessments];
let donations = [...mockDonationRecords];
let testResults = [...mockTestResults];
let clinicalReviews = [...mockClinicalReviews];
let followUps = [...mockFollowUps];
let auditLogs = [...mockAuditLogs];
let catalogue = [...TEST_CATALOGUE];

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
   * Fetch donation records with filtering
   */
  async getDonations(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...donations];

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
      }, 100);
    });
  },

  /**
   * Fetch single donation with full clinical lifecycle (Assessment + Tests + Clinical Review + Disposition)
   */
  async getDonationById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const donation = donations.find((d) => d.donationId === id);
        if (!donation) {
          return reject(new Error(`Donation record ${id} not found.`));
        }

        const donationAssessment = assessments.find((a) => a.assessmentId === donation.assessmentId || a.donationRecordId === id);
        const donationTests = testResults.filter((t) => t.donationId === id);
        const donationReview = clinicalReviews.find((r) => r.donationId === id);
        const donationFollowUp = followUps.find((f) => f.donationId === id);

        // Calculate safety release verification checklist
        const releaseAudit = this.evaluateUnitReleasePrerequisites(id);

        resolve({
          data: {
            donation,
            assessment: donationAssessment || null,
            tests: donationTests,
            clinicalReview: donationReview || null,
            followUp: donationFollowUp || null,
            releaseAudit,
          },
          status: 'success'
        });
      }, 100);
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
      };

      testResults[testIdx] = updatedTest;

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
      }

      // Log action to audit trail
      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "LAB_TEST_ENTRY",
        recordReference: `${existingTest.donationId} (${existingTest.testCode})`,
        actionDetails: `Result updated to '${updates.resultStatus}'. Notes: ${updates.notes || 'Routine entry'}`,
        terminalIp: "10.12.6.14 (Lab Analyzer)",
      });

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

      resolve({ data: record, status: 'success' });
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

      resolve({ data: donation, status: 'success' });
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

      const newReview = {
        reviewId: `REV-2026-${clinicalReviews.length + 101}`,
        ...reviewData,
        reviewerName: user.name,
        reviewerTitle: "Transfusion Medical Officer (TMO)",
        reviewDateTime: new Date().toISOString(),
      };

      clinicalReviews.unshift(newReview);

      // If clinical review confirms unit restriction or release, apply to donation record
      const donation = donations.find((d) => d.donationId === reviewData.donationId);
      if (donation && reviewData.dispositionSigned) {
        donation.dispositionStatus = reviewData.dispositionSigned;
        donation.dispositionReason = reviewData.clinicalNotes;
        donation.authorizedBy = `${user.name} (TMO)`;
        donation.authorizationDate = new Date().toISOString();
      }

      // Audit Log
      auditLogs.unshift({
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRef: user.name,
        userRole: user.role,
        actionCategory: "CLINICAL_REVIEW",
        recordReference: reviewData.donationId,
        actionDetails: `Clinical review recorded. Decision: ${reviewData.clinicalDecision}. Confirmatory Status: ${reviewData.confirmatoryStatus}`,
        terminalIp: "10.12.4.18 (TMO Console)",
      });

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

      resolve({ data: followUps[idx], status: 'success' });
    });
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
