/**
 * MediConnect Server-Side Safety Safeguards
 * Enforces official clinical standards:
 * - DGHS Guidelines for Blood Transfusion Services
 * - WHO Guidelines on Screening Donated Blood for Transfusion-Transmissible Infections
 * 
 * Strict Constraint: Server-side validation is authoritative. Frontend cannot bypass these rules.
 */

export const MANDATORY_SCREENING_CODES = ['HIV', 'HBSAG', 'HCV', 'SYPHILIS', 'MALARIA'];

/**
 * Validates donor vitals against DGHS Standards
 */
export function evaluateDonorVitals(data) {
  const flags = [];

  const weight = parseFloat(data.weight_kg);
  const hb = parseFloat(data.hemoglobin_g_dl);
  const sys = parseInt(data.blood_pressure_sys, 10);
  const dia = parseInt(data.blood_pressure_dia, 10);
  const pulse = parseInt(data.pulse_bpm, 10);
  const temp = parseFloat(data.temperature_c);

  if (isNaN(weight) || weight < 45) {
    flags.push(`Weight (${weight} kg) is below DGHS minimum threshold of 45 kg.`);
  }

  if (isNaN(hb) || hb < 12.5) {
    flags.push(`Hemoglobin (${hb} g/dL) is below DGHS statutory cutoff of 12.5 g/dL.`);
  }

  if (isNaN(sys) || isNaN(dia) || sys < 100 || sys > 140 || dia < 60 || dia > 90) {
    flags.push(`Blood Pressure (${sys}/${dia} mmHg) outside acceptable DGHS range (100-140 / 60-90 mmHg).`);
  }

  if (isNaN(pulse) || pulse < 60 || pulse > 100) {
    flags.push(`Pulse rate (${pulse} bpm) outside permissible DGHS range (60-100 bpm).`);
  }

  if (isNaN(temp) || temp > 37.5) {
    flags.push(`Body temperature (${temp}°C) exceeds normal threshold (<= 37.5°C).`);
  }

  if (!data.travel_history_cleared) {
    flags.push('Travel history risk declared; requires infectious disease deferral assessment.');
  }

  if (!data.high_risk_cleared) {
    flags.push('High-risk behavior assessment unresolved; mandatory deferral applies.');
  }

  if (!data.medication_cleared) {
    flags.push('Donor currently taking medications that preclude blood donation.');
  }

  if (data.recent_fever_symptoms) {
    flags.push('Recent active febrile episode reported within the last 14 days.');
  }

  return {
    isEligible: flags.length === 0,
    status: flags.length === 0 ? 'Eligible' : 'Temporarily_Deferred',
    flags
  };
}

/**
 * Validates prerequisites for clinical release of a blood unit.
 * All checks must strictly pass before status can become 'Released'.
 */
export function verifyReleasePrerequisites(donation, labResults = []) {
  const blockingReasons = [];

  if (!donation) {
    return {
      canRelease: false,
      reasons: ['Donation record not found.'],
      totalMandatory: MANDATORY_SCREENING_CODES.length,
      passedCount: 0
    };
  }

  if (donation.quarantine_status === 'Discarded') {
    blockingReasons.push('Unit has already been discarded.');
  }

  if (donation.quarantine_status === 'Expired') {
    blockingReasons.push('Unit shelf life has expired; cannot release.');
  }

  // Check mandatory tests
  const testMap = new Map();
  labResults.forEach(r => {
    const code = (r.test_code || '').toUpperCase();
    testMap.set(code, r);
  });

  let passedCount = 0;
  const missingTests = [];
  const pendingTests = [];
  const reactiveTests = [];
  const invalidTests = [];

  for (const code of MANDATORY_SCREENING_CODES) {
    const res = testMap.get(code);
    if (!res) {
      missingTests.push(code);
    } else {
      const outcome = res.result;
      if (outcome === 'Reactive') {
        reactiveTests.push(`${code} (Reactive)`);
      } else if (outcome === 'Pending') {
        pendingTests.push(code);
      } else if (outcome === 'Inconclusive' || outcome === 'Invalid') {
        invalidTests.push(`${code} (${outcome})`);
      } else if (outcome === 'Non-Reactive') {
        passedCount++;
      } else {
        invalidTests.push(`${code} (Unknown status: ${outcome})`);
      }
    }
  }

  if (reactiveTests.length > 0) {
    blockingReasons.push(`BIO-LOCK ACTIVE: Reactive infectious disease results detected: ${reactiveTests.join(', ')}.`);
  }

  if (missingTests.length > 0) {
    blockingReasons.push(`Missing mandatory screening tests: ${missingTests.join(', ')}.`);
  }

  if (pendingTests.length > 0) {
    blockingReasons.push(`Mandatory tests still pending laboratory execution: ${pendingTests.join(', ')}.`);
  }

  if (invalidTests.length > 0) {
    blockingReasons.push(`Tests marked inconclusive or invalid; retesting required: ${invalidTests.join(', ')}.`);
  }

  return {
    canRelease: blockingReasons.length === 0,
    reasons: blockingReasons,
    totalMandatory: MANDATORY_SCREENING_CODES.length,
    passedCount
  };
}

/**
 * Calculates quarantine status update based on incoming lab results
 */
export function calculateQuarantineTransition(currentStatus, labResults = []) {
  const hasReactive = labResults.some(r => r.result === 'Reactive');
  if (hasReactive) {
    return {
      status: 'Bio_Lock',
      reason: 'BIO-LOCK: Mandatory quarantine due to reactive TTI screening result'
    };
  }

  const allMandatoryNonReactive = MANDATORY_SCREENING_CODES.every(code => {
    const found = labResults.find(r => (r.test_code || '').toUpperCase() === code);
    return found && found.result === 'Non-Reactive';
  });

  if (allMandatoryNonReactive && currentStatus === 'Quarantined') {
    return {
      status: 'Pending_Review',
      reason: 'All mandatory screening non-reactive. Awaiting Transfusion Medicine Officer clinical review.'
    };
  }

  return {
    status: currentStatus,
    reason: null
  };
}
