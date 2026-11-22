import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { bloodSafetyService } from '../services/bloodSafetyService';
import { TEST_CATALOGUE } from '../data/bloodSafetyData';
import { SafetyDashboardPage } from '../pages/bloodSafety/SafetyDashboardPage';
import { SafetyAuthProvider } from '../context/SafetyAuthContext';

describe('Blood Safety & Donor Health Verification System', () => {
  beforeEach(async () => {
    await bloodSafetyService.resetDemoData();
  });

  it('contains all 5 statutory India-oriented infection screening categories', async () => {
    const res = await bloodSafetyService.getTestCatalogue();
    const codes = res.data.map((t) => t.testCode);

    expect(codes).toContain('SCR-HIV');
    expect(codes).toContain('SCR-HBV');
    expect(codes).toContain('SCR-HCV');
    expect(codes).toContain('SCR-SYPH');
    expect(codes).toContain('SCR-MAL');

    const mandatoryTests = res.data.filter((t) => t.isRequired);
    expect(mandatoryTests.length).toBeGreaterThanOrEqual(5);
  });

  it('verifies that an approved blood unit meets all statutory release prerequisites', () => {
    // DON-2026-0891 is our fully verified, non-reactive unit
    const audit = bloodSafetyService.evaluateUnitReleasePrerequisites('DON-2026-0891');
    expect(audit.canRelease).toBe(true);
    expect(audit.reasons.length).toBe(0);
    expect(audit.completedNonReactive).toBeGreaterThanOrEqual(5);
  });

  it('strictly blocks release when a mandatory screening assay is pending (DON-2026-0892)', () => {
    const audit = bloodSafetyService.evaluateUnitReleasePrerequisites('DON-2026-0892');
    expect(audit.canRelease).toBe(false);
    expect(audit.reasons.some((r) => r.includes('Pending'))).toBe(true);
  });

  it('strictly blocks release when a screening assay is reactive (DON-2026-0893)', () => {
    const audit = bloodSafetyService.evaluateUnitReleasePrerequisites('DON-2026-0893');
    expect(audit.canRelease).toBe(false);
    expect(audit.reasons.some((r) => r.includes('Reactive'))).toBe(true);
  });

  it('strictly blocks release when a screening assay is inconclusive or grey zone (DON-2026-0894)', () => {
    const audit = bloodSafetyService.evaluateUnitReleasePrerequisites('DON-2026-0894');
    expect(audit.canRelease).toBe(false);
    expect(audit.reasons.some((r) => r.includes('Inconclusive'))).toBe(true);
  });

  it('strictly blocks release when a screening assay is invalid (DON-2026-0895)', () => {
    const audit = bloodSafetyService.evaluateUnitReleasePrerequisites('DON-2026-0895');
    expect(audit.canRelease).toBe(false);
    expect(audit.reasons.some((r) => r.includes('Invalid'))).toBe(true);
  });

  it('prevents unauthorized roles from approving blood unit release', async () => {
    // Attempt release approval with 'donor' or 'hospital' role
    await expect(
      bloodSafetyService.updateUnitDisposition(
        'DON-2026-0891',
        'Approved for release',
        'Unauthorized attempt',
        { name: 'Public User', role: 'donor' }
      )
    ).rejects.toThrow(/Access Denied/i);

    // Attempt release approval with non-clinical 'administrator' role
    await expect(
      bloodSafetyService.updateUnitDisposition(
        'DON-2026-0891',
        'Approved for release',
        'Admin attempt',
        { name: 'System Admin', role: 'administrator' }
      )
    ).rejects.toThrow(/Access Denied/i);
  });

  it('restricts confidential donor follow-ups from public and donor personas', async () => {
    await expect(bloodSafetyService.getFollowUps('donor')).rejects.toThrow(/Access Restricted/i);
    await expect(bloodSafetyService.getFollowUps('hospital')).rejects.toThrow(/Access Restricted/i);

    // Clinical reviewer can view confidential registry
    const allowed = await bloodSafetyService.getFollowUps('clinical_reviewer');
    expect(allowed.data.length).toBeGreaterThan(0);
  });

  it('evaluates donor eligibility against statutory DGHS physical criteria (TC-07 & TC-08)', () => {
    // Underweight donor (< 45 kg)
    const underweight = bloodSafetyService.evaluateDonorEligibility({
      donorAge: 25,
      weightKg: 42.0,
      haemoglobinGdl: 13.0,
      pulseBpm: 72,
      donorGender: 'Female',
    });
    expect(underweight.isEligible).toBe(false);
    expect(underweight.reasons.some((r) => r.includes('45.0 kg'))).toBe(true);
    expect(underweight.recommendedOutcome).toBe('Temporarily deferred');

    // Low Hemoglobin (< 12.5 g/dL)
    const lowHb = bloodSafetyService.evaluateDonorEligibility({
      donorAge: 28,
      weightKg: 60.0,
      haemoglobinGdl: 11.8,
      pulseBpm: 76,
      donorGender: 'Male',
    });
    expect(lowHb.isEligible).toBe(false);
    expect(lowHb.reasons.some((r) => r.includes('12.5 g/dL'))).toBe(true);

    // Insufficient Interval for male donor (< 90 days)
    const shortIntervalMale = bloodSafetyService.evaluateDonorEligibility({
      donorAge: 30,
      weightKg: 70.0,
      haemoglobinGdl: 14.5,
      pulseBpm: 70,
      donorGender: 'Male',
      daysSinceLastDonation: 60,
    });
    expect(shortIntervalMale.isEligible).toBe(false);
    expect(shortIntervalMale.reasons.some((r) => r.includes('90 days'))).toBe(true);

    // Fully compliant donor
    const compliant = bloodSafetyService.evaluateDonorEligibility({
      donorAge: 32,
      weightKg: 65.0,
      haemoglobinGdl: 14.0,
      pulseBpm: 74,
      donorGender: 'Male',
      daysSinceLastDonation: 95,
      questionnaire: {
        takingPrescriptionAntibiotics: false,
        historyOfHepatitisOrJaundice: false,
        recentTattooOrPiercingInPast6Mo: false,
        recentDentalExtractionInPast72Hrs: false,
      },
    });
    expect(compliant.isEligible).toBe(true);
    expect(compliant.reasons.length).toBe(0);
    expect(compliant.recommendedOutcome).toBe('Accepted for donation');
  });

  it('automatically triggers quarantine bio-lock on a donation when an assay is updated to Reactive (TC-03)', async () => {
    // Update an assay of DON-2026-0891 to Reactive
    const res = await bloodSafetyService.getDonationById('DON-2026-0891');
    const firstTest = res.data.tests[0];

    await bloodSafetyService.updateTestResult(firstTest.testId, {
      resultStatus: 'Reactive',
      notes: 'Automated repeat reactive verification',
    }, { name: 'Lab Tech', role: 'lab_staff' });

    const updatedDonation = await bloodSafetyService.getDonationById('DON-2026-0891');
    expect(updatedDonation.data.donation.dispositionStatus).toBe('Quarantined');
    expect(updatedDonation.data.releaseAudit.canRelease).toBe(false);
  });

  it('enforces centralized prerequisite checks during clinical review (cannot bypass via review modal)', async () => {
    // Attempting to sign release on DON-2026-0892 (which has pending Malaria assay) via clinical review MUST be blocked
    await expect(
      bloodSafetyService.recordClinicalReview({
        donationId: 'DON-2026-0892',
        initialScreeningSummary: 'Review with pending assays',
        confirmatoryTestingRequired: false,
        confirmatoryStatus: 'None',
        clinicalDecision: 'Attempted Release Bypass',
        dispositionSigned: 'Approved for release',
        clinicalNotes: 'Trying to approve while test is pending',
      }, { name: 'Dr. Deshmukh', role: 'clinical_reviewer' })
    ).rejects.toThrow(/Safety Lock Violated/i);
  });

  it('creates a donation from an accepted assessment with 5 pending tests in awaiting testing status', async () => {
    // ASM-2026-101 is accepted for donation
    const res = await bloodSafetyService.createDonationFromAssessment('ASM-2026-101', {
      bloodComponent: 'Whole Blood 450ml',
      volumeMl: 450,
    }, { name: 'Nurse Gaikwad', role: 'blood_bank' });

    expect(res.data.dispositionStatus).toBe('Awaiting testing');
    expect(res.tests.length).toBe(5);
    expect(res.tests.every((t) => t.resultStatus === 'Pending')).toBe(true);

    // Release should be strictly blocked on this new unit
    const audit = bloodSafetyService.evaluateUnitReleasePrerequisites(res.data.donationId);
    expect(audit.canRelease).toBe(false);
  });

  it('filters donations for hospital role to only approved for release units with masked PII', async () => {
    const hospitalView = await bloodSafetyService.getDonations({}, 'hospital');
    expect(hospitalView.data.length).toBeGreaterThan(0);
    expect(hospitalView.data.every((d) => d.dispositionStatus === 'Approved for release')).toBe(true);

    // Quarantined unit DON-2026-0893 should be completely hidden from hospital view
    expect(hospitalView.data.some((d) => d.donationId === 'DON-2026-0893')).toBe(false);

    // Inspecting released unit as hospital coordinator strips sensitive donor PII
    const detail = await bloodSafetyService.getDonationById('DON-2026-0891', 'hospital');
    expect(detail.data.donation.donorMaskedName).toBe('Anonymized Volunteer Donor');
    expect(detail.data.assessment).toBeNull();
    expect(detail.data.followUp).toBeNull();
  });

  it('restricts donors from accessing peer donation records', async () => {
    // Donor 'dnr-001' trying to access peer unit DON-2026-0893 (dnr-005)
    await expect(
      bloodSafetyService.getDonationById('DON-2026-0893', 'donor', 'dnr-001')
    ).rejects.toThrow(/Access Denied/i);
  });

  it('resets demo data cleanly back to initial simulation baseline', async () => {
    const reset = await bloodSafetyService.resetDemoData();
    expect(reset.status).toBe('success');

    // Fresh query should return baseline records
    const donationsRes = await bloodSafetyService.getDonations();
    expect(donationsRes.data.length).toBeGreaterThanOrEqual(5);
  });

  it('renders Safety Dashboard page with key surveillance metrics', async () => {
    render(
      <MemoryRouter initialEntries={['/blood-safety']}>
        <SafetyAuthProvider>
          <SafetyDashboardPage />
        </SafetyAuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Blood Safety & Donor Health Verification/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Statutory Infection Screening Catalogue/i)).toBeInTheDocument();
      expect(screen.getByText(/Unit Release Clinical Mandate/i)).toBeInTheDocument();
    });
  });

  it('restores authenticated session from localStorage on refresh and maps backend roles', () => {
    // Simulate user having logged in previously and refreshed browser
    const mockUser = {
      userId: 'USR-BBS-001',
      name: 'Staff Nurse Rohit Verma',
      email: 'staff.rohit@mediconnect.local',
      role: 'blood_bank_staff',
      department: 'Blood Bank Phlebotomy'
    };
    localStorage.setItem('mediconnect_auth_token', 'mock-jwt-token-12345');
    localStorage.setItem('mediconnect_user', JSON.stringify(mockUser));

    render(
      <MemoryRouter initialEntries={['/blood-safety']}>
        <SafetyAuthProvider>
          <SafetyDashboardPage />
        </SafetyAuthProvider>
      </MemoryRouter>
    );

    // Verify authenticated persona is displayed with mapped role
    expect(screen.getByText(/Staff Nurse Rohit Verma/i)).toBeInTheDocument();
    expect(screen.getByText(/Authenticated Session/i)).toBeInTheDocument();

    // Clean up
    localStorage.removeItem('mediconnect_auth_token');
    localStorage.removeItem('mediconnect_user');
  });
});
