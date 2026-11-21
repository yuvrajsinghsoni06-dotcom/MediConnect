import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { bloodSafetyService } from '../services/bloodSafetyService';
import { TEST_CATALOGUE } from '../data/bloodSafetyData';
import { SafetyDashboardPage } from '../pages/bloodSafety/SafetyDashboardPage';
import { SafetyAuthProvider } from '../context/SafetyAuthContext';

describe('Blood Safety & Donor Health Verification System', () => {
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
});
