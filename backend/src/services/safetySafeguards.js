/**
 * MediConnect Server-Side Safety Safeguards
 * Enforces official statutory and clinical standards:
 * - DGHS / MoHFW National Standards for Blood Centres & Blood Transfusion Services (2nd Ed, 2022)
 * - Drugs and Cosmetics Rules, 1945 (Schedule F, Part XII-B)
 * - DGHS Transfusion Medicine Technical Manual (3rd Ed, 2023)
 * - WHO Guidelines on Screening Donated Blood for Transfusion-Transmissible Infections
 * 
 * Strict Constraint: Server-side validation is authoritative. Frontend cannot bypass these rules.
 * Clinical Notice: Algorithmic checks support but do not replace physician assessment.
 */

export const MANDATORY_SCREENING_CODES = ['HIV', 'HBSAG', 'HCV', 'SYPHILIS', 'MALARIA'];

/**
 * Validates donor vitals and eligibility against DGHS 2022 & Schedule F standards
 * Ref: SOT-ELIG-AGE, SOT-ELIG-WT, SOT-ELIG-HB, SOT-ELIG-BP, SOT-ELIG-TEMP, SOT-ELIG-INT-M, SOT-ELIG-INT-F
 */
export function evaluateDonorVitals(data) {
  const flags = [];

  // Age verification (18 - 65 years, DGHS 2022 Section 3.1)
  const age = parseInt(data.age || data.donor_age, 10);
  if (!isNaN(age)) {
    if (age < 18 || age > 65) {
      flags.push(`Age (${age} years) is outside statutory range of 18-65 years (DGHS 2022 Sec 3.1).`);
    } else if (age > 60 && data.is_first_time_donor) {
      flags.push(`First-time donor over 60 years (${age}y) requires specific Medical Officer clearance.`);
    }
  }

  // Weight verification (DGHS 2022 Section 3.2: >= 45 kg for 350 mL, >= 50 kg for 450 mL)
  const weight = parseFloat(data.weight_kg);
  const collectionVolume = parseInt(data.collection_volume_ml || data.bag_volume_ml || 350, 10);
  if (isNaN(weight) || weight < 45) {
    flags.push(`Weight (${weight} kg) is below statutory minimum threshold of 45 kg (DGHS 2022 Sec 3.2).`);
  } else if (collectionVolume >= 450 && weight < 50) {
    flags.push(`Weight (${weight} kg) is below 50 kg requirement for 450 mL donation bag.`);
  }

  // Hemoglobin verification (Schedule F, Part XII-B: >= 12.5 g/dL)
  const hb = parseFloat(data.hemoglobin_g_dl);
  if (isNaN(hb) || hb < 12.5) {
    flags.push(`Hemoglobin (${hb} g/dL) is below statutory cutoff of 12.5 g/dL (Drugs & Cosmetics Rules, Schedule F).`);
  }

  // Blood Pressure verification (DGHS 2022 Section 3.2: Systolic 100-160, Diastolic 60-100 mmHg)
  const sys = parseInt(data.blood_pressure_sys, 10);
  const dia = parseInt(data.blood_pressure_dia, 10);
  if (isNaN(sys) || isNaN(dia) || sys < 100 || sys > 160 || dia < 60 || dia > 100) {
    flags.push(`Blood Pressure (${sys}/${dia} mmHg) outside acceptable DGHS range (100-160 / 60-100 mmHg).`);
  }

  // Pulse rate verification (DGHS 2022 Section 3.2: 60-100 regular bpm)
  const pulse = parseInt(data.pulse_bpm, 10);
  if (isNaN(pulse) || pulse < 60 || pulse > 100) {
    flags.push(`Pulse rate (${pulse} bpm) outside permissible DGHS range (60-100 bpm regular).`);
  }

  // Temperature verification (DGHS 2022 Section 3.2: 36.0°C - 37.5°C or 96.8°F - 99.5°F)
  const tempInput = parseFloat(data.temperature_c !== undefined ? data.temperature_c : data.temperature_f);
  if (!isNaN(tempInput)) {
    if (tempInput > 45) {
      // Fahrenheit input
      if (tempInput > 99.5 || tempInput < 96.8) {
        flags.push(`Body temperature (${tempInput}°F) outside normal oral range (96.8°F - 99.5°F).`);
      }
    } else {
      // Celsius input
      if (tempInput > 37.5 || tempInput < 36.0) {
        flags.push(`Body temperature (${tempInput}°C) outside normal oral range (36.0°C - 37.5°C).`);
      }
    }
  }

  // Whole blood donation interval (DGHS 2022 Section 3.3: Male = 90 days, Female = 120 days)
  const daysSince = parseInt(data.days_since_last_donation, 10);
  if (!isNaN(daysSince) && daysSince > 0) {
    const isFemale = (data.gender || data.donor_gender || '').toLowerCase() === 'female';
    const isApheresis = data.donation_type === 'apheresis' || data.donation_type === 'plateletpheresis';
    if (isApheresis) {
      if (daysSince < 2) {
        flags.push(`Apheresis interval (${daysSince} days) must be at least 48 hours (DGHS 2023 Manual Ch. 5).`);
      }
    } else {
      const minDays = isFemale ? 120 : 90;
      if (daysSince < minDays) {
        flags.push(`Donation interval (${daysSince} days) is less than statutory minimum (${minDays} days for ${isFemale ? 'female' : 'male'} donors, DGHS 2022 Sec 3.3).`);
      }
    }
  }

  // Specific clinical & deferral risk factors (DGHS 2022 Section 3.4)
  if (data.travel_history_cleared === false) {
    flags.push('Travel history risk declared; requires infectious disease (malaria/endemic) deferral assessment.');
  }

  if (data.high_risk_cleared === false) {
    flags.push('High-risk behavior assessment unresolved; mandatory statutory deferral applies.');
  }

  if (data.medication_cleared === false) {
    flags.push('Donor currently taking medications that preclude blood donation.');
  }

  if (data.recent_fever_symptoms === true) {
    flags.push('Recent active febrile episode reported within the last 14 days (DGHS 2022 Sec 3.4).');
  }

  if (data.recent_tattoo_piercing === true) {
    flags.push('Tattoo or body piercing within past 12 months requires 12-month deferral (DGHS 2022 Sec 3.4).');
  }

  if (data.recent_dental_extraction === true) {
    flags.push('Dental extraction within past 72 hours requires 3-day deferral (DGHS 2022 Sec 3.4).');
  }

  if (data.pregnant_or_lactating === true) {
    flags.push('Pregnancy or lactation mandates 12-month deferral post-delivery (DGHS 2022 Sec 3.4).');
  }

  return {
    isEligible: flags.length === 0,
    status: flags.length === 0 ? 'Eligible' : 'Temporarily_Deferred',
    flags,
    regulatoryCitation: 'DGHS / MoHFW National Standards for Blood Centres 2nd Ed (2022), Section 3',
    requiresPhysicianApproval: true
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
