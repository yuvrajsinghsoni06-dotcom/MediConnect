import { query, withTransaction, isDbConnected } from '../config/db.js';
import { MANDATORY_SCREENING_CODES, verifyReleasePrerequisites } from '../services/safetySafeguards.js';

// Synthetic in-memory fallback datasets (mirroring 001_synthetic_seed_data.sql)
let memoryStore = {
  users: [
    { id: 1, user_id: 'USR-ADM-001', name: 'System Administrator', email: 'admin@mediconnect.local', password_hash: '$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y', role: 'admin', department: 'IT & Systems', is_active: 1 },
    { id: 2, user_id: 'USR-BBS-001', name: 'Staff Nurse Rohit Verma', email: 'staff.rohit@mediconnect.local', password_hash: '$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y', role: 'blood_bank_staff', department: 'Blood Bank Phlebotomy', is_active: 1 },
    { id: 3, user_id: 'USR-LAB-001', name: 'Technician Anita Rao', email: 'lab.anita@mediconnect.local', password_hash: '$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y', role: 'lab_technician', department: 'Serology & Screening Lab', is_active: 1 },
    { id: 4, user_id: 'USR-TMO-001', name: 'Dr. Priya Nair (TMO)', email: 'dr.priya.tmo@mediconnect.local', password_hash: '$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y', role: 'clinical_reviewer', department: 'Transfusion Medicine Quality Office', is_active: 1 },
    { id: 5, user_id: 'USR-DNR-001', name: 'Rahul Sharma', email: 'rahul.donor@mediconnect.local', password_hash: '$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y', role: 'donor', department: 'Community Donors', is_active: 1 },
    { id: 6, user_id: 'USR-HSP-001', name: 'Coordinator Vikram Seth', email: 'coord.vikram@cityhospital.local', password_hash: '$2a$10$Qj7Vb8aI98fHk1W4d9g3ye6Lg1gPz2zWj5r1D1/1G3p1a1e1k1e1y', role: 'hospital_coordinator', department: 'Apollo Emergency Transfusion Dept', is_active: 1 }
  ],
  donors: [
    { id: 1, donor_id: 'DNR-2026-001', user_id: 'USR-DNR-001', full_name: 'Rahul Sharma', blood_group: 'O+', date_of_birth: '1995-04-12', gender: 'Male', phone: '+91 98765 43210', email: 'rahul.donor@mediconnect.local', city: 'New Delhi', state: 'Delhi', total_donations: 3, last_donation_date: '2026-01-15' },
    { id: 2, donor_id: 'DNR-2026-002', user_id: null, full_name: 'Pooja Verma', blood_group: 'A+', date_of_birth: '1998-08-22', gender: 'Female', phone: '+91 98111 22334', email: 'pooja.v@example.com', city: 'Mumbai', state: 'Maharashtra', total_donations: 1, last_donation_date: '2025-11-20' },
    { id: 3, donor_id: 'DNR-2026-003', user_id: null, full_name: 'Amit Patel', blood_group: 'B+', date_of_birth: '1992-12-05', gender: 'Male', phone: '+91 99222 33445', email: 'amit.patel@example.com', city: 'Ahmedabad', state: 'Gujarat', total_donations: 5, last_donation_date: '2025-10-10' },
    { id: 4, donor_id: 'DNR-2026-004', user_id: null, full_name: 'Sunita Rao', blood_group: 'AB+', date_of_birth: '2000-03-30', gender: 'Female', phone: '+91 97333 44556', email: 'sunita.rao@example.com', city: 'Bengaluru', state: 'Karnataka', total_donations: 0, last_donation_date: null }
  ],
  assessments: [
    { id: 1, assessment_id: 'ASM-2026-001', donor_id: 'DNR-2026-001', weight_kg: 72.5, hemoglobin_g_dl: 14.2, blood_pressure_sys: 120, blood_pressure_dia: 80, pulse_bpm: 72, temperature_c: 36.6, travel_history_cleared: 1, high_risk_cleared: 1, medication_cleared: 1, recent_fever_symptoms: 0, status: 'Eligible', evaluator_user_id: 'USR-BBS-001', notes: 'Regular voluntary donor. Clinically sound.', created_at: '2026-01-15T09:30:00Z' },
    { id: 2, assessment_id: 'ASM-2026-002', donor_id: 'DNR-2026-002', weight_kg: 56.0, hemoglobin_g_dl: 12.8, blood_pressure_sys: 118, blood_pressure_dia: 76, pulse_bpm: 75, temperature_c: 36.8, travel_history_cleared: 1, high_risk_cleared: 1, medication_cleared: 1, recent_fever_symptoms: 0, status: 'Eligible', evaluator_user_id: 'USR-BBS-001', notes: 'First-time voluntary donor.', created_at: '2026-01-12T11:00:00Z' },
    { id: 3, assessment_id: 'ASM-2026-003', donor_id: 'DNR-2026-003', weight_kg: 68.0, hemoglobin_g_dl: 11.2, blood_pressure_sys: 124, blood_pressure_dia: 82, pulse_bpm: 70, temperature_c: 36.5, travel_history_cleared: 1, high_risk_cleared: 1, medication_cleared: 1, recent_fever_symptoms: 0, status: 'Temporarily_Deferred', evaluator_user_id: 'USR-BBS-001', notes: 'Hemoglobin 11.2 g/dL below DGHS 12.5 g/dL threshold.', created_at: '2026-01-15T10:00:00Z' }
  ],
  donations: [
    { id: 1, unit_number: 'DON-2026-0619', donor_id: 'DNR-2026-001', assessment_id: 'ASM-2026-001', blood_group: 'O+', donation_type: 'Whole Blood', bag_type: 'Triple', volume_ml: 450, donation_date: '2026-01-10 10:15:00', expiry_date: '2026-02-14', location: 'Main Blood Centre - Phlebotomy Bay 1', quarantine_status: 'Released', quarantine_reason: 'Fully screened negative and clinically authorized for release', phlebotomist_user_id: 'USR-BBS-001' },
    { id: 2, unit_number: 'DON-2026-0742', donor_id: 'DNR-2026-002', assessment_id: 'ASM-2026-002', blood_group: 'A+', donation_type: 'Whole Blood', bag_type: 'Triple', volume_ml: 450, donation_date: '2026-01-12 11:30:00', expiry_date: '2026-02-16', location: 'Main Blood Centre - Phlebotomy Bay 2', quarantine_status: 'Bio_Lock', quarantine_reason: 'BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (HCV)', phlebotomist_user_id: 'USR-BBS-001' },
    { id: 3, unit_number: 'DON-2026-0891', donor_id: 'DNR-2026-001', assessment_id: 'ASM-2026-001', blood_group: 'O+', donation_type: 'Whole Blood', bag_type: 'Triple', volume_ml: 450, donation_date: '2026-01-15 09:45:00', expiry_date: '2026-02-19', location: 'Main Blood Centre - Phlebotomy Bay 1', quarantine_status: 'Quarantined', quarantine_reason: 'Mandatory post-collection safety quarantine pending laboratory screening', phlebotomist_user_id: 'USR-BBS-001' }
  ],
  labResults: [
    { id: 1, result_id: 'LAB-0619-HIV', unit_number: 'DON-2026-0619', test_code: 'HIV', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-11 10:00:00' },
    { id: 2, result_id: 'LAB-0619-HBS', unit_number: 'DON-2026-0619', test_code: 'HBSAG', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-11 10:00:00' },
    { id: 3, result_id: 'LAB-0619-HCV', unit_number: 'DON-2026-0619', test_code: 'HCV', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-11 10:00:00' },
    { id: 4, result_id: 'LAB-0619-SYP', unit_number: 'DON-2026-0619', test_code: 'SYPHILIS', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-11 10:00:00' },
    { id: 5, result_id: 'LAB-0619-MAL', unit_number: 'DON-2026-0619', test_code: 'MALARIA', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-11 10:00:00' },
    { id: 6, result_id: 'LAB-0742-HIV', unit_number: 'DON-2026-0742', test_code: 'HIV', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-13 14:00:00' },
    { id: 7, result_id: 'LAB-0742-HBS', unit_number: 'DON-2026-0742', test_code: 'HBSAG', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-13 14:00:00' },
    { id: 8, result_id: 'LAB-0742-HCV', unit_number: 'DON-2026-0742', test_code: 'HCV', result: 'Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-13 14:00:00' },
    { id: 9, result_id: 'LAB-0742-SYP', unit_number: 'DON-2026-0742', test_code: 'SYPHILIS', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-13 14:00:00' },
    { id: 10, result_id: 'LAB-0742-MAL', unit_number: 'DON-2026-0742', test_code: 'MALARIA', result: 'Non-Reactive', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: 'USR-TMO-001', performed_at: '2026-01-13 14:00:00' },
    { id: 11, result_id: 'LAB-0891-HIV', unit_number: 'DON-2026-0891', test_code: 'HIV', result: 'Pending', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: null, performed_at: '2026-01-15 10:00:00' },
    { id: 12, result_id: 'LAB-0891-HBS', unit_number: 'DON-2026-0891', test_code: 'HBSAG', result: 'Pending', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: null, performed_at: '2026-01-15 10:00:00' },
    { id: 13, result_id: 'LAB-0891-HCV', unit_number: 'DON-2026-0891', test_code: 'HCV', result: 'Pending', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: null, performed_at: '2026-01-15 10:00:00' },
    { id: 14, result_id: 'LAB-0891-SYP', unit_number: 'DON-2026-0891', test_code: 'SYPHILIS', result: 'Pending', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: null, performed_at: '2026-01-15 10:00:00' },
    { id: 15, result_id: 'LAB-0891-MAL', unit_number: 'DON-2026-0891', test_code: 'MALARIA', result: 'Pending', technician_user_id: 'USR-LAB-001', reviewed_by_user_id: null, performed_at: '2026-01-15 10:00:00' }
  ],
  clinicalReviews: [
    { id: 1, review_id: 'REV-2026-0619', unit_number: 'DON-2026-0619', reviewer_user_id: 'USR-TMO-001', decision: 'Released', notes: 'All 5 mandatory TTI screening tests verified non-reactive.', reviewed_at: '2026-01-11 12:00:00' }
  ],
  followUps: [
    { id: 1, case_id: 'CFU-2026-001', donor_id: 'DNR-2026-002', trigger_unit_number: 'DON-2026-0742', trigger_test_code: 'HCV', initial_finding: 'Reactive Hepatitis C antibody on routine screening (ELISA S/CO 3.42)', communication_status: 'Counseling_Scheduled', assigned_officer_user_id: 'USR-TMO-001', confidential_counseling_notes: 'Donor contacted via private phone call.', confirmatory_status: 'Referred_to_ICTS' }
  ],
  campaigns: [
    { id: 1, campaign_id: 'CMP-2026-01', title: 'AIIMS Blood Donation Drive', organizer: 'Rotary Club Delhi & AIIMS', location: 'AIIMS Main Auditorium, New Delhi', date: '2026-02-15', start_time: '09:00:00', end_time: '17:00:00', target_units: 150, collected_units: 42, status: 'Upcoming', description: 'Annual community blood collection camp.' },
    { id: 2, campaign_id: 'CMP-2026-02', title: 'Red Cross Youth Camp', organizer: 'Indian Red Cross Society', location: 'Town Hall Grounds, Connaught Place', date: '2026-02-28', start_time: '10:00:00', end_time: '16:00:00', target_units: 100, collected_units: 0, status: 'Upcoming', description: 'Youth-oriented voluntary blood drive.' }
  ],
  emergencyRequests: [
    { id: 1, request_id: 'EMG-2026-01', hospital_name: 'Apollo Hospital Trauma ICU', coordinator_user_id: 'USR-HSP-001', blood_group: 'O+', units_needed: 4, urgency: 'Critical', contact_person: 'Dr. Vikram Seth', contact_phone: '+91 98765 11223', status: 'In_Progress' },
    { id: 2, request_id: 'EMG-2026-02', hospital_name: 'Max Healthcare Cardiac OT', coordinator_user_id: null, blood_group: 'AB-', units_needed: 2, urgency: 'Urgent', contact_person: 'Nurse Supervisor Deepa', contact_phone: '+91 98111 44556', status: 'Open' }
  ],
  auditLogs: [
    { id: 1, log_id: 'LOG-2026-0001', event_type: 'SYSTEM_INITIALIZED', record_id: 'SYS-INIT', entity_type: 'system', actor_user_id: 'USR-ADM-001', actor_role: 'admin', ip_address: '127.0.0.1', timestamp: new Date().toISOString(), details: 'Backend repository initialized.' }
  ]
};

// Reset memory store helper (useful for tests)
export function resetMemoryStore() {
  // Deep clone initial state if needed
}

export const UsersRepository = {
  async findByEmail(email) {
    if (isDbConnected()) {
      const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] || null;
    }
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findByUserId(userId) {
    if (isDbConnected()) {
      const rows = await query('SELECT * FROM users WHERE user_id = ?', [userId]);
      return rows[0] || null;
    }
    return memoryStore.users.find(u => u.user_id === userId) || null;
  }
};

export const DonorsRepository = {
  async listAll(filters = {}) {
    if (isDbConnected()) {
      let sql = 'SELECT * FROM donors WHERE 1=1';
      const params = [];
      if (filters.bloodGroup) {
        sql += ' AND blood_group = ?';
        params.push(filters.bloodGroup);
      }
      if (filters.city) {
        sql += ' AND city LIKE ?';
        params.push(`%${filters.city}%`);
      }
      return await query(sql, params);
    }
    return memoryStore.donors.filter(d => {
      if (filters.bloodGroup && d.blood_group !== filters.bloodGroup) return false;
      if (filters.city && !d.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      return true;
    });
  },

  async findById(donorId) {
    if (isDbConnected()) {
      const rows = await query('SELECT * FROM donors WHERE donor_id = ?', [donorId]);
      return rows[0] || null;
    }
    return memoryStore.donors.find(d => d.donor_id === donorId) || null;
  },

  async create(data) {
    if (isDbConnected()) {
      await query(
        `INSERT INTO donors (donor_id, user_id, full_name, blood_group, date_of_birth, gender, phone, email, city, state)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.donor_id, data.user_id || null, data.full_name, data.blood_group, data.date_of_birth, data.gender, data.phone, data.email, data.city, data.state]
      );
      return await this.findById(data.donor_id);
    }
    const newDonor = { id: memoryStore.donors.length + 1, ...data, total_donations: 0, last_donation_date: null };
    memoryStore.donors.push(newDonor);
    return newDonor;
  }
};

export const AssessmentsRepository = {
  async listAll() {
    if (isDbConnected()) {
      return await query(`
        SELECT a.*, d.full_name AS donor_name, d.blood_group
        FROM donor_assessments a
        JOIN donors d ON a.donor_id = d.donor_id
        ORDER BY a.created_at DESC
      `);
    }
    return memoryStore.assessments.map(a => {
      const donor = memoryStore.donors.find(d => d.donor_id === a.donor_id) || {};
      return { ...a, donor_name: donor.full_name || 'Unknown', blood_group: donor.blood_group || 'N/A' };
    });
  },

  async findById(assessmentId) {
    if (isDbConnected()) {
      const rows = await query('SELECT * FROM donor_assessments WHERE assessment_id = ?', [assessmentId]);
      return rows[0] || null;
    }
    return memoryStore.assessments.find(a => a.assessment_id === assessmentId) || null;
  },

  async create(data) {
    if (isDbConnected()) {
      await query(
        `INSERT INTO donor_assessments
         (assessment_id, donor_id, weight_kg, hemoglobin_g_dl, blood_pressure_sys, blood_pressure_dia, pulse_bpm, temperature_c, travel_history_cleared, high_risk_cleared, medication_cleared, recent_fever_symptoms, status, deferral_reason, evaluator_user_id, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.assessment_id, data.donor_id, data.weight_kg, data.hemoglobin_g_dl,
          data.blood_pressure_sys, data.blood_pressure_dia, data.pulse_bpm, data.temperature_c,
          data.travel_history_cleared ? 1 : 0, data.high_risk_cleared ? 1 : 0,
          data.medication_cleared ? 1 : 0, data.recent_fever_symptoms ? 1 : 0,
          data.status, data.deferral_reason || null, data.evaluator_user_id, data.notes || null
        ]
      );
      return await this.findById(data.assessment_id);
    }
    const newRecord = { id: memoryStore.assessments.length + 1, ...data, created_at: new Date().toISOString() };
    memoryStore.assessments.unshift(newRecord);
    return newRecord;
  }
};

export const DonationsRepository = {
  async listAll(role = 'admin', userId = null) {
    if (isDbConnected()) {
      let sql = `
        SELECT b.*, d.full_name AS donor_name
        FROM blood_donations b
        JOIN donors d ON b.donor_id = d.donor_id
      `;
      const params = [];

      if (role === 'hospital_coordinator') {
        sql += " WHERE b.quarantine_status = 'Released'";
      } else if (role === 'donor' && userId) {
        sql += ' WHERE d.user_id = ?';
        params.push(userId);
      }
      sql += ' ORDER BY b.created_at DESC';
      return await query(sql, params);
    }

    return memoryStore.donations
      .filter(d => {
        if (role === 'hospital_coordinator') return d.quarantine_status === 'Released';
        if (role === 'donor' && userId) {
          const donor = memoryStore.donors.find(dnr => dnr.user_id === userId);
          return donor ? d.donor_id === donor.donor_id : false;
        }
        return true;
      })
      .map(d => {
        const donor = memoryStore.donors.find(dnr => dnr.donor_id === d.donor_id) || {};
        return {
          ...d,
          donor_name: role === 'hospital_coordinator' ? 'CONFIDENTIAL / MASKED' : (donor.full_name || 'Unknown')
        };
      });
  },

  async findByUnit(unitNumber) {
    if (isDbConnected()) {
      const rows = await query('SELECT * FROM blood_donations WHERE unit_number = ?', [unitNumber]);
      return rows[0] || null;
    }
    return memoryStore.donations.find(d => d.unit_number === unitNumber) || null;
  },

  /**
   * Phlebotomy Collection Transaction:
   * Inserts blood_donations unit in 'Quarantined' status
   * and automatically accessions the 5 mandatory pending laboratory screening tests.
   */
  async createCollectionTransaction(donationData, phlebotomistUserId) {
    if (isDbConnected()) {
      return await withTransaction(async (conn) => {
        // 1. Insert blood donation unit
        await conn.query(
          `INSERT INTO blood_donations
           (unit_number, donor_id, assessment_id, blood_group, donation_type, bag_type, volume_ml, expiry_date, location, quarantine_status, quarantine_reason, phlebotomist_user_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Quarantined', 'Mandatory post-collection safety quarantine pending laboratory screening', ?)`,
          [
            donationData.unit_number, donationData.donor_id, donationData.assessment_id,
            donationData.blood_group, donationData.donation_type || 'Whole Blood',
            donationData.bag_type || 'Triple', donationData.volume_ml || 450,
            donationData.expiry_date, donationData.location, phlebotomistUserId
          ]
        );

        // 2. Insert 5 mandatory screening tests
        for (const testCode of MANDATORY_SCREENING_CODES) {
          const resultId = `LAB-${donationData.unit_number.replace('DON-', '')}-${testCode.substring(0, 3)}`;
          await conn.query(
            `INSERT INTO laboratory_test_results (result_id, unit_number, test_code, result, technician_user_id)
             VALUES (?, ?, ?, 'Pending', ?)`,
            [resultId, donationData.unit_number, testCode, phlebotomistUserId]
          );
        }

        const [created] = await conn.query('SELECT * FROM blood_donations WHERE unit_number = ?', [donationData.unit_number]);
        return created[0];
      });
    }

    // In-memory transaction
    const unit = {
      id: memoryStore.donations.length + 1,
      ...donationData,
      quarantine_status: 'Quarantined',
      quarantine_reason: 'Mandatory post-collection safety quarantine pending laboratory screening',
      phlebotomist_user_id: phlebotomistUserId,
      donation_date: new Date().toISOString()
    };
    memoryStore.donations.unshift(unit);

    for (const testCode of MANDATORY_SCREENING_CODES) {
      const resultId = `LAB-${donationData.unit_number.replace('DON-', '')}-${testCode.substring(0, 3)}`;
      memoryStore.labResults.push({
        id: memoryStore.labResults.length + 1,
        result_id: resultId,
        unit_number: donationData.unit_number,
        test_code: testCode,
        result: 'Pending',
        technician_user_id: phlebotomistUserId,
        reviewed_by_user_id: null,
        performed_at: new Date().toISOString()
      });
    }

    return unit;
  },

  async updateQuarantineStatus(unitNumber, status, reason) {
    if (isDbConnected()) {
      await query(
        'UPDATE blood_donations SET quarantine_status = ?, quarantine_reason = ? WHERE unit_number = ?',
        [status, reason, unitNumber]
      );
      return await this.findByUnit(unitNumber);
    }
    const unit = memoryStore.donations.find(d => d.unit_number === unitNumber);
    if (unit) {
      unit.quarantine_status = status;
      unit.quarantine_reason = reason;
    }
    return unit;
  }
};

export const LabTestsRepository = {
  async listByUnit(unitNumber) {
    if (isDbConnected()) {
      return await query('SELECT * FROM laboratory_test_results WHERE unit_number = ?', [unitNumber]);
    }
    return memoryStore.labResults.filter(r => r.unit_number === unitNumber);
  },

  async listAll() {
    if (isDbConnected()) {
      return await query('SELECT * FROM laboratory_test_results ORDER BY performed_at DESC');
    }
    return memoryStore.labResults;
  },

  async findById(resultId) {
    if (isDbConnected()) {
      const rows = await query('SELECT * FROM laboratory_test_results WHERE result_id = ?', [resultId]);
      return rows[0] || null;
    }
    return memoryStore.labResults.find(r => r.result_id === resultId) || null;
  },

  /**
   * Updates lab result. If result is 'Reactive', automatically triggers Bio_Lock on donation.
   */
  async updateResult(resultId, data, actorUserId) {
    if (isDbConnected()) {
      return await withTransaction(async (conn) => {
        await conn.query(
          `UPDATE laboratory_test_results
           SET result = ?, test_kit_lot = ?, notes = ?, technician_user_id = ?, reviewed_by_user_id = ?, reviewed_at = CURRENT_TIMESTAMP
           WHERE result_id = ?`,
          [data.result, data.test_kit_lot || null, data.notes || null, actorUserId, actorUserId, resultId]
        );

        const [resRows] = await conn.query('SELECT * FROM laboratory_test_results WHERE result_id = ?', [resultId]);
        const updatedResult = resRows[0];

        // Quarantine Bio-Lock cascade if Reactive
        if (data.result === 'Reactive') {
          await conn.query(
            `UPDATE blood_donations
             SET quarantine_status = 'Bio_Lock',
                 quarantine_reason = ?
             WHERE unit_number = ?`,
            [`BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (${updatedResult.test_code})`, updatedResult.unit_number]
          );
        }

        return updatedResult;
      });
    }

    const test = memoryStore.labResults.find(r => r.result_id === resultId);
    if (test) {
      test.result = data.result;
      if (data.test_kit_lot) test.test_kit_lot = data.test_kit_lot;
      if (data.notes) test.notes = data.notes;
      test.technician_user_id = actorUserId;
      test.reviewed_by_user_id = actorUserId;
      test.reviewed_at = new Date().toISOString();

      if (data.result === 'Reactive') {
        const unit = memoryStore.donations.find(d => d.unit_number === test.unit_number);
        if (unit) {
          unit.quarantine_status = 'Bio_Lock';
          unit.quarantine_reason = `BIO-LOCK: Mandatory quarantine due to reactive TTI screening result (${test.test_code})`;
        }
      }
    }
    return test;
  }
};

export const ClinicalReviewsRepository = {
  async listAll() {
    if (isDbConnected()) {
      return await query('SELECT * FROM clinical_reviews ORDER BY reviewed_at DESC');
    }
    return memoryStore.clinicalReviews;
  },

  /**
   * Authorize clinical release with server-side prerequisite verification.
   * If prerequisites fail, release is blocked and an exception is thrown.
   */
  async authorizeRelease(unitNumber, reviewerUserId, notes) {
    if (isDbConnected()) {
      return await withTransaction(async (conn) => {
        // Row lock
        const [unitRows] = await conn.query('SELECT * FROM blood_donations WHERE unit_number = ? FOR UPDATE', [unitNumber]);
        const donation = unitRows[0];
        if (!donation) throw new Error('DONATION_NOT_FOUND');

        const [labRows] = await conn.query('SELECT * FROM laboratory_test_results WHERE unit_number = ?', [unitNumber]);
        const evalResult = verifyReleasePrerequisites(donation, labRows);

        if (!evalResult.canRelease) {
          const err = new Error('RELEASE_PREREQUISITES_NOT_MET');
          err.reasons = evalResult.reasons;
          throw err;
        }

        // Update donation status
        await conn.query(
          `UPDATE blood_donations
           SET quarantine_status = 'Released',
               quarantine_reason = 'Fully screened negative and clinically authorized for release'
           WHERE unit_number = ?`,
          [unitNumber]
        );

        // Record clinical review
        const reviewId = `REV-${unitNumber.replace('DON-', '')}`;
        await conn.query(
          `INSERT INTO clinical_reviews (review_id, unit_number, reviewer_user_id, decision, notes)
           VALUES (?, ?, ?, 'Released', ?)
           ON DUPLICATE KEY UPDATE decision = 'Released', notes = VALUES(notes)`,
          [reviewId, unitNumber, reviewerUserId, notes || 'Clinically cleared for release.']
        );

        const [updatedUnit] = await conn.query('SELECT * FROM blood_donations WHERE unit_number = ?', [unitNumber]);
        return { donation: updatedUnit[0], reviewId };
      });
    }

    const unit = memoryStore.donations.find(d => d.unit_number === unitNumber);
    if (!unit) throw new Error('DONATION_NOT_FOUND');

    const labTests = memoryStore.labResults.filter(r => r.unit_number === unitNumber);
    const evalResult = verifyReleasePrerequisites(unit, labTests);

    if (!evalResult.canRelease) {
      const err = new Error('RELEASE_PREREQUISITES_NOT_MET');
      err.reasons = evalResult.reasons;
      throw err;
    }

    unit.quarantine_status = 'Released';
    unit.quarantine_reason = 'Fully screened negative and clinically authorized for release';

    const reviewId = `REV-${unitNumber.replace('DON-', '')}`;
    const review = {
      id: memoryStore.clinicalReviews.length + 1,
      review_id: reviewId,
      unit_number: unitNumber,
      reviewer_user_id: reviewerUserId,
      decision: 'Released',
      notes: notes || 'Clinically cleared for release.',
      reviewed_at: new Date().toISOString()
    };
    memoryStore.clinicalReviews.unshift(review);

    return { donation: unit, reviewId };
  }
};

export const FollowUpsRepository = {
  async listAll() {
    if (isDbConnected()) {
      return await query('SELECT * FROM confidential_follow_ups ORDER BY created_at DESC');
    }
    return memoryStore.followUps;
  },

  async updateCase(caseId, data) {
    if (isDbConnected()) {
      await query(
        `UPDATE confidential_follow_ups
         SET communication_status = COALESCE(?, communication_status),
             confidential_counseling_notes = COALESCE(?, confidential_counseling_notes),
             confirmatory_status = COALESCE(?, confirmatory_status)
         WHERE case_id = ?`,
        [data.communication_status, data.confidential_counseling_notes, data.confirmatory_status, caseId]
      );
      const rows = await query('SELECT * FROM confidential_follow_ups WHERE case_id = ?', [caseId]);
      return rows[0] || null;
    }
    const item = memoryStore.followUps.find(f => f.case_id === caseId);
    if (item) {
      if (data.communication_status) item.communication_status = data.communication_status;
      if (data.confidential_counseling_notes) item.confidential_counseling_notes = data.confidential_counseling_notes;
      if (data.confirmatory_status) item.confirmatory_status = data.confirmatory_status;
    }
    return item;
  }
};

export const CampaignsRepository = {
  async listAll() {
    if (isDbConnected()) {
      return await query('SELECT * FROM campaigns ORDER BY date ASC');
    }
    return memoryStore.campaigns;
  }
};

export const EmergencyRequestsRepository = {
  async listAll() {
    if (isDbConnected()) {
      return await query('SELECT * FROM emergency_requests ORDER BY created_at DESC');
    }
    return memoryStore.emergencyRequests;
  }
};

export const AuditLogsRepository = {
  async listAll() {
    if (isDbConnected()) {
      return await query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 200');
    }
    return memoryStore.auditLogs;
  },

  async record(entry) {
    const logId = `LOG-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const logRecord = {
      log_id: logId,
      event_type: entry.eventType,
      record_id: entry.recordId,
      entity_type: entry.entityType || 'blood_safety',
      actor_user_id: entry.actorUserId,
      actor_role: entry.actorRole,
      ip_address: entry.ipAddress || '127.0.0.1',
      details: typeof entry.details === 'object' ? JSON.stringify(entry.details) : String(entry.details)
    };

    if (isDbConnected()) {
      try {
        await query(
          `INSERT INTO audit_logs (log_id, event_type, record_id, entity_type, actor_user_id, actor_role, ip_address, details)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [logRecord.log_id, logRecord.event_type, logRecord.record_id, logRecord.entity_type, logRecord.actor_user_id, logRecord.actor_role, logRecord.ip_address, logRecord.details]
        );
      } catch (err) {
        console.error('[AUDIT] Failed to insert audit log into MySQL:', err.message);
      }
    }

    memoryStore.auditLogs.unshift({ ...logRecord, id: memoryStore.auditLogs.length + 1, timestamp: new Date().toISOString() });
    return logRecord;
  }
};
