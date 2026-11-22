import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { AuditLogsRepository, UsersRepository } from '../src/repositories/index.js';

describe('MediConnect Backend API & Safety Safeguards Integration Tests', () => {
  let adminToken;
  let staffToken;
  let labToken;
  let tmoToken;
  let donorToken;
  let hospitalToken;

  before(async () => {
    // Authenticate demo roles to obtain JWT tokens
    const [adminRes, staffRes, labRes, tmoRes, donorRes, hospitalRes] = await Promise.all([
      request(app).post('/api/v1/auth/login').send({ email: 'admin@mediconnect.local', password: 'Password@123' }),
      request(app).post('/api/v1/auth/login').send({ email: 'staff.rohit@mediconnect.local', password: 'Password@123' }),
      request(app).post('/api/v1/auth/login').send({ email: 'lab.anita@mediconnect.local', password: 'Password@123' }),
      request(app).post('/api/v1/auth/login').send({ email: 'dr.priya.tmo@mediconnect.local', password: 'Password@123' }),
      request(app).post('/api/v1/auth/login').send({ email: 'rahul.donor@mediconnect.local', password: 'Password@123' }),
      request(app).post('/api/v1/auth/login').send({ email: 'coord.vikram@cityhospital.local', password: 'Password@123' })
    ]);

    adminToken = adminRes.body.token;
    staffToken = staffRes.body.token;
    labToken = labRes.body.token;
    tmoToken = tmoRes.body.token;
    donorToken = donorRes.body.token;
    hospitalToken = hospitalRes.body.token;
  });

  test('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
  });

  test('POST /api/v1/auth/login authorizes all 6 active demo users and issues signed JWT', async () => {
    assert.ok(adminToken);
    assert.ok(staffToken);
    assert.ok(labToken);
    assert.ok(tmoToken);
    assert.ok(donorToken);
    assert.ok(hospitalToken);
  });

  test('POST /api/v1/auth/register creates a new user account with role donor and hashed password', async () => {
    const uniqueEmail = `test.user.${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'New Registered User',
        email: uniqueEmail,
        password: 'SecurePassword123!',
        phoneNumber: '9876543210',
        city: 'Mumbai',
        bloodGroup: 'O+'
      });

    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.role, 'donor');
    assert.equal(res.body.user.name, 'New Registered User');
    assert.equal(res.body.user.email, uniqueEmail);

    // Verify user can immediately log in with exact email and password
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: uniqueEmail,
        password: 'SecurePassword123!'
      });

    assert.equal(loginRes.status, 200);
    assert.ok(loginRes.body.token);
    assert.equal(loginRes.body.user.role, 'donor');

    // Verify stored password in repository is hashed, not plain text
    const storedUser = await UsersRepository.findByEmail(uniqueEmail);
    assert.ok(storedUser);
    assert.notEqual(storedUser.password_hash, 'SecurePassword123!');
    assert.ok(storedUser.password_hash.startsWith('$2'));
  });

  test('POST /api/v1/auth/register rejects duplicate email with 409 EMAIL_ALREADY_EXISTS', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Duplicate Admin Attempt',
        email: 'admin@mediconnect.local',
        password: 'Password@123'
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.error, 'EMAIL_ALREADY_EXISTS');
  });

  test('POST /api/v1/auth/register rejects weak password with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Weak Password User',
        email: 'weak.pw@example.com',
        password: 'short'
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'VALIDATION_FAILED');
  });

  test('POST /api/v1/auth/register rejects invalid email format with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: 'Password123!'
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'VALIDATION_FAILED');
  });

  test('POST /api/v1/auth/register ignores client-supplied privileged role and enforces donor', async () => {
    const uniqueEmail = `malicious.admin.${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Sneaky User',
        email: uniqueEmail,
        password: 'Password123!',
        role: 'admin'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.user.role, 'donor');
  });

  test('POST /api/v1/auth/login normalizes email (case-insensitive and trimmed)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: '  DR.PRIYA.TMO@MEDICONNECT.LOCAL  ', password: 'Password@123' });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.userId, 'USR-TMO-001');
  });

  test('POST /api/v1/auth/login rejects unknown email with 401 INVALID_CREDENTIALS', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'unknown.stranger@example.com', password: 'Password@123' });

    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'INVALID_CREDENTIALS');
  });

  test('POST /api/v1/auth/login rejects incorrect password with 401 INVALID_CREDENTIALS', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'dr.priya.tmo@mediconnect.local', password: 'WrongPassword999!' });

    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'INVALID_CREDENTIALS');
  });

  test('POST /api/v1/auth/login rejects deactivated account with 403 ACCOUNT_INACTIVE', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'inactive.user@mediconnect.local', password: 'Password@123' });

    assert.equal(res.status, 403);
    assert.equal(res.body.error, 'ACCOUNT_INACTIVE');
  });

  test('Audit logging: records unknown-user failed login with NULL actor_user_id (no FK violation)', async () => {
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ghost.user.audit@nowhere.com', password: 'Password@123' });

    const logs = await AuditLogsRepository.listAll();
    const failedLog = logs.find(l => {
      const details = typeof l.details === 'string' ? JSON.parse(l.details) : l.details;
      return l.event_type === 'LOGIN_FAILED' && details.attemptedEmail === 'ghost.user.audit@nowhere.com';
    });

    assert.ok(failedLog, 'Expected failed login audit record to be created');
    assert.equal(failedLog.actor_user_id, null, 'Unauthenticated actor_user_id must be NULL, never nonexistent string');
    assert.equal(failedLog.actor_role, 'anonymous');
  });

  test('Audit logging: records incorrect-password failed login with valid actor_user_id', async () => {
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'staff.rohit@mediconnect.local', password: 'IncorrectPassword1!' });

    const logs = await AuditLogsRepository.listAll();
    const pwFailLog = logs.find(l => {
      const details = typeof l.details === 'string' ? JSON.parse(l.details) : l.details;
      return l.event_type === 'LOGIN_FAILED' && details.reason === 'Password mismatch' && details.email === 'staff.rohit@mediconnect.local';
    });

    assert.ok(pwFailLog, 'Expected password mismatch audit record');
    assert.equal(pwFailLog.actor_user_id, 'USR-BBS-001', 'Seeded user ID must be preserved for existing user');
    assert.equal(pwFailLog.actor_role, 'blood_bank_staff');
  });

  test('Audit logging: direct record handles both NULL and legacy ANONYMOUS safely', async () => {
    const record1 = await AuditLogsRepository.record({
      eventType: 'SECURITY_EVENT_NULL',
      recordId: 'SEC-001',
      actorUserId: null,
      actorRole: 'anonymous',
      details: { note: 'Direct null actor' }
    });
    assert.equal(record1.actor_user_id, null);

    const record2 = await AuditLogsRepository.record({
      eventType: 'SECURITY_EVENT_ANON_STRING',
      recordId: 'SEC-002',
      actorUserId: 'ANONYMOUS', // Legacy string normalized to null
      actorRole: 'anonymous',
      details: { note: 'Legacy string sanitized to null' }
    });
    assert.equal(record2.actor_user_id, null);
  });

  test('GET /api/v1/auth/me returns profile for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${tmoToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.user.role, 'clinical_reviewer');
  });

  test('CORS: allows configured origins (http://localhost:3000 and 5173)', async () => {
    const res3000 = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:3000');
    assert.equal(res3000.status, 200);
    assert.equal(res3000.headers['access-control-allow-origin'], 'http://localhost:3000');

    const res5173 = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173');
    assert.equal(res5173.status, 200);
    assert.equal(res5173.headers['access-control-allow-origin'], 'http://localhost:5173');
  });

  test('POST /api/v1/blood-safety/assessments evaluates DGHS vitals on server with staffToken', async () => {
    // Eligible donor
    const res = await request(app)
      .post('/api/v1/blood-safety/assessments')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        donor_id: 'DNR-2026-001',
        weight_kg: 70,
        hemoglobin_g_dl: 14.5,
        blood_pressure_sys: 120,
        blood_pressure_dia: 80,
        pulse_bpm: 72,
        temperature_c: 36.6,
        travel_history_cleared: true,
        high_risk_cleared: true,
        medication_cleared: true,
        recent_fever_symptoms: false
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.status, 'Eligible');
    assert.equal(res.body.evaluation.isEligible, true);
  });

  test('POST /api/v1/blood-safety/assessments defers donor when vitals violate DGHS (Hb < 12.5 g/dL)', async () => {
    const res = await request(app)
      .post('/api/v1/blood-safety/assessments')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        donor_id: 'DNR-2026-002',
        weight_kg: 50,
        hemoglobin_g_dl: 11.0, // Low Hb
        blood_pressure_sys: 120,
        blood_pressure_dia: 80,
        pulse_bpm: 72,
        temperature_c: 36.6,
        travel_history_cleared: true,
        high_risk_cleared: true,
        medication_cleared: true,
        recent_fever_symptoms: false
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.status, 'Temporarily_Deferred');
    assert.equal(res.body.evaluation.isEligible, false);
    assert.ok(res.body.evaluation.flags.some(f => f.includes('Hemoglobin')));
  });

  test('POST /api/v1/blood-safety/donations accessions unit with 5 mandatory pending lab tests in Quarantined status', async () => {
    const res = await request(app)
      .post('/api/v1/blood-safety/donations')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        donor_id: 'DNR-2026-001',
        assessment_id: 'ASM-2026-001',
        blood_group: 'O+',
        donation_type: 'Whole Blood',
        bag_type: 'Triple',
        volume_ml: 450,
        location: 'Phlebotomy Bay 1'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.quarantine_status, 'Quarantined');

    const unitNumber = res.body.data.unit_number;
    // Verify 5 mandatory tests were created
    const labRes = await request(app).get(`/api/v1/blood-safety/lab-tests/unit/${unitNumber}`);
    assert.equal(labRes.status, 200);
    assert.equal(labRes.body.data.length, 5);
    assert.ok(labRes.body.data.every(t => t.result === 'Pending'));
  });

  test('PUT /api/v1/blood-safety/lab-tests/:id auto-locks donation under Bio_Lock when result is Reactive', async () => {
    // Update LAB-0891-HIV to Reactive using labToken
    const res = await request(app)
      .put('/api/v1/blood-safety/lab-tests/LAB-0891-HIV')
      .set('Authorization', `Bearer ${labToken}`)
      .send({
        result: 'Reactive',
        test_kit_lot: 'LOT-TEST-REACT-1',
        notes: 'Reactive result on re-test'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.result, 'Reactive');

    // Verify unit DON-2026-0891 is now Bio_Lock
    const unitRes = await request(app).get('/api/v1/blood-safety/donations/DON-2026-0891');
    assert.equal(unitRes.status, 200);
    assert.equal(unitRes.body.data.quarantine_status, 'Bio_Lock');
  });

  test('POST /api/v1/blood-safety/clinical-reviews strictly blocks release when unit has reactive or pending tests', async () => {
    // Attempt release on DON-2026-0891 (which has reactive HIV)
    const res = await request(app)
      .post('/api/v1/blood-safety/clinical-reviews')
      .set('Authorization', `Bearer ${tmoToken}`)
      .send({
        unit_number: 'DON-2026-0891',
        decision: 'Released',
        notes: 'Attempting release'
      });

    assert.equal(res.status, 422);
    assert.equal(res.body.error, 'RELEASE_PREREQUISITES_NOT_MET');
    assert.ok(res.body.blockingReasons.length > 0);
  });

  test('POST /api/v1/blood-safety/clinical-reviews successfully authorizes release for fully screened negative unit', async () => {
    // DON-2026-0619 has all 5 mandatory Non-Reactive tests
    const res = await request(app)
      .post('/api/v1/blood-safety/clinical-reviews')
      .set('Authorization', `Bearer ${tmoToken}`)
      .send({
        unit_number: 'DON-2026-0619',
        decision: 'Released',
        notes: 'All mandatory screening non-reactive. Verified.'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.donation.quarantine_status, 'Released');
  });

  test('Role authorization rejects non-clinical reviewer from authorizing clinical release', async () => {
    // Attempt clinical release using lab technician token
    const res = await request(app)
      .post('/api/v1/blood-safety/clinical-reviews')
      .set('Authorization', `Bearer ${labToken}`)
      .send({
        unit_number: 'DON-2026-0619',
        decision: 'Released',
        notes: 'Attempting unauthorized clinical approval'
      });

    assert.equal(res.status, 403);
    assert.equal(res.body.error, 'INSUFFICIENT_PERMISSIONS');
  });

  test('Protected mutation without token returns 401 UNAUTHORIZED', async () => {
    const res = await request(app)
      .post('/api/v1/blood-safety/clinical-reviews')
      .send({
        unit_number: 'DON-2026-0619',
        decision: 'Released',
        notes: 'No token supplied'
      });

    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'UNAUTHORIZED');
  });

  test('Donor Privacy Shield: GET /api/v1/donors NEVER exposes phone, email or date of birth', async () => {
    const res = await request(app).get('/api/v1/donors');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);

    res.body.data.forEach(donor => {
      assert.equal(donor.phone, undefined, 'Phone must not be exposed in public API');
      assert.equal(donor.email, undefined, 'Email must not be exposed in public API');
      assert.equal(donor.date_of_birth, undefined, 'Date of birth must not be exposed in public API');
      assert.ok(donor.blood_group);
      assert.ok(donor.city);
      assert.ok(donor.record_type);
    });
  });

  test('GET /api/v1/public-centres returns verified e-RaktKosh blood directory', async () => {
    const res = await request(app).get('/api/v1/public-centres');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.source.includes('e-RaktKosh'));
    assert.ok(res.body.data.every(c => c.verification_status && c.last_updated));
  });

  test('Hospital coordinator view filters out unreleased inventory and masks PII', async () => {
    const res = await request(app)
      .get('/api/v1/blood-safety/donations?role=hospital_coordinator');

    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.data.every(u => u.quarantine_status === 'Released'));
    assert.ok(res.body.data.every(u => u.donor_name === 'CONFIDENTIAL / MASKED'));
  });

  test('GET /api/v1/platform-stats returns aggregated network metrics', async () => {
    const res = await request(app).get('/api/v1/platform-stats');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.donors);
    assert.ok(res.body.data.hospitals);
    assert.ok(res.body.data.requests);
    assert.ok(res.body.data.campaigns);
  });

  test('GET /api/v1/blood-safety/statistics returns surveillance metrics', async () => {
    const res = await request(app).get('/api/v1/blood-safety/statistics');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.donations);
    assert.ok(res.body.data.tests);
    assert.equal(typeof res.body.data.activeFollowUps, 'number');
  });

  // Profile Management & Donor Onboarding Test Suite
  test('GET /api/v1/users/profile returns 401 UNAUTHORIZED when no token is provided', async () => {
    const res = await request(app).get('/api/v1/users/profile');
    assert.equal(res.status, 401);
  });

  test('GET /api/v1/users/profile returns authenticated user and donor profile without exposing password', async () => {
    const res = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${donorToken}`);

    assert.equal(res.status, 200);
    assert.ok(res.body.user);
    assert.equal(res.body.user.email, 'rahul.donor@mediconnect.local');
    assert.equal(res.body.user.password_hash, undefined, 'Password hash must NEVER be exposed');
    assert.equal(res.body.user.password, undefined);
    assert.ok(res.body.donorProfile);
    assert.equal(res.body.donorProfile.blood_group, 'O+');
    assert.equal(res.body.isOnboarded, true);
    assert.ok(Array.isArray(res.body.donationHistory));
  });

  test('PUT /api/v1/users/profile updates permitted profile fields', async () => {
    const res = await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${donorToken}`)
      .send({
        name: 'Rahul Sharma (Updated)',
        phone: '9876543219',
        city: 'New Delhi'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.user.name, 'Rahul Sharma (Updated)');
    assert.equal(res.body.donorProfile.phone, '9876543219');
  });

  test('POST /api/v1/users/donor-onboarding completes donor profile for a new user', async () => {
    // 1. Register a new donor user
    const newEmail = `onboarding.donor.${Date.now()}@example.com`;
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Fresh Donor',
        email: newEmail,
        password: 'Password@123'
      });

    assert.equal(regRes.status, 201);
    const newToken = regRes.body.token;

    // 2. Complete onboarding
    const onboardRes = await request(app)
      .post('/api/v1/users/donor-onboarding')
      .set('Authorization', `Bearer ${newToken}`)
      .send({
        full_name: 'Fresh Donor Citizen',
        blood_group: 'B+',
        date_of_birth: '1996-08-20',
        gender: 'Male',
        phone: '9812345678',
        city: 'Bengaluru',
        state: 'Karnataka'
      });

    assert.equal(onboardRes.status, 200);
    assert.ok(onboardRes.body.donorProfile);
    assert.equal(onboardRes.body.donorProfile.blood_group, 'B+');
    assert.equal(onboardRes.body.donorProfile.city, 'Bengaluru');

    // 3. Repeat onboarding updates the same record without duplicate profiles
    const repeatRes = await request(app)
      .post('/api/v1/users/donor-onboarding')
      .set('Authorization', `Bearer ${newToken}`)
      .send({
        full_name: 'Fresh Donor Citizen (Revised)',
        blood_group: 'B+',
        date_of_birth: '1996-08-20',
        gender: 'Male',
        phone: '9812345679',
        city: 'Bengaluru',
        state: 'Karnataka'
      });

    assert.equal(repeatRes.status, 200);
    assert.equal(repeatRes.body.donorProfile.donor_id, onboardRes.body.donorProfile.donor_id);
    assert.equal(repeatRes.body.donorProfile.phone, '9812345679');
  });

  test('POST /api/v1/users/donor-onboarding rejects invalid age under 18 according to DGHS standards', async () => {
    const res = await request(app)
      .post('/api/v1/users/donor-onboarding')
      .set('Authorization', `Bearer ${donorToken}`)
      .send({
        full_name: 'Underage User',
        blood_group: 'A+',
        date_of_birth: '2015-01-01', // Under 18 years old
        gender: 'Female',
        phone: '9811122233',
        city: 'Mumbai'
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'VALIDATION_FAILED');
  });

  test('POST /api/v1/users/donor-onboarding rejects non-donor role', async () => {
    const res = await request(app)
      .post('/api/v1/users/donor-onboarding')
      .set('Authorization', `Bearer ${adminToken}`) // admin role
      .send({
        full_name: 'Admin Attempting Donor Onboarding',
        blood_group: 'O-',
        date_of_birth: '1990-01-01',
        gender: 'Male',
        phone: '9811122233',
        city: 'Mumbai'
      });

    assert.equal(res.status, 403);
  });

  // ============================================================================
  // Master Roadmap Phase Integration Tests
  // ============================================================================

  test('GET /api/v1/blood-safety/catalogue returns official screening test master catalogue', async () => {
    const res = await request(app).get('/api/v1/blood-safety/catalogue');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    const codes = res.body.data.map(t => t.test_code);
    assert.ok(codes.includes('HIV'));
    assert.ok(codes.includes('HBSAG'));
    assert.ok(codes.includes('HCV'));
    assert.ok(codes.includes('SYPHILIS'));
    assert.ok(codes.includes('MALARIA'));
  });

  test('GET /api/v1/blood-safety/deferrals and POST /api/v1/blood-safety/deferrals track donor deferrals', async () => {
    // 1. List deferrals with staff token
    const listRes = await request(app)
      .get('/api/v1/blood-safety/deferrals')
      .set('Authorization', `Bearer ${staffToken}`);
    assert.equal(listRes.status, 200);
    assert.ok(Array.isArray(listRes.body.data));

    // 2. Create a temporary deferral
    const postRes = await request(app)
      .post('/api/v1/blood-safety/deferrals')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        donor_id: 'DNR-2026-001',
        type: 'Temporary',
        category: 'Low_Hemoglobin',
        reason: 'Hemoglobin 11.5 g/dL on repeat check; advised dietary counseling',
        start_date: '2026-02-01',
        end_date: '2026-05-01'
      });
    assert.equal(postRes.status, 201);
    assert.ok(postRes.body.data.deferral_id);
    assert.equal(postRes.body.data.category, 'Low_Hemoglobin');
  });

  test('GET /api/v1/inventory/summary and GET /api/v1/inventory/components return blood inventory data', async () => {
    // 1. Inventory summary
    const summaryRes = await request(app)
      .get('/api/v1/inventory/summary')
      .set('Authorization', `Bearer ${staffToken}`);
    assert.equal(summaryRes.status, 200);
    assert.ok(summaryRes.body.data.totals);
    assert.equal(typeof summaryRes.body.data.totals.released, 'number');

    // 2. List components with filter
    const compRes = await request(app)
      .get('/api/v1/inventory/components?status=Released')
      .set('Authorization', `Bearer ${staffToken}`);
    assert.equal(compRes.status, 200);
    assert.ok(Array.isArray(compRes.body.data));
  });

  test('POST /api/v1/inventory/components derives component and PUT /api/v1/inventory/components/:code/status updates lifecycle', async () => {
    const code = `TEST-PRBC-${Date.now()}`;
    const createRes = await request(app)
      .post('/api/v1/inventory/components')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        component_code: code,
        unit_number: 'DON-2026-0619',
        component_type: 'Packed Red Blood Cells',
        volume_ml: 280,
        storage_temperature_c: '2-6°C',
        storage_location: 'Cold Room A Shelf 1',
        expiry_date: '2026-03-01',
        status: 'Released'
      });
    assert.equal(createRes.status, 201);
    assert.equal(createRes.body.data.component_code, code);

    // Update status to Transfused
    const updateRes = await request(app)
      .put(`/api/v1/inventory/components/${code}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        status: 'Transfused',
        reason: 'Issued for trauma surgery at Apollo ICU'
      });
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.data.status, 'Transfused');
  });

  test('Emergency blood request workflow: submit and update status', async () => {
    // Submit emergency request
    const createRes = await request(app)
      .post('/api/v1/emergency-requests')
      .send({
        hospital_name: 'Max Superspeciality Saket',
        blood_group: 'O-',
        units_needed: 3,
        urgency: 'Critical',
        contact_person: 'Dr. Alok Verma',
        contact_phone: '+91 98111 88990'
      });
    assert.equal(createRes.status, 201);
    const reqId = createRes.body.data.request_id;
    assert.ok(reqId);

    // Update status to In_Progress with hospital coordinator token
    const updateRes = await request(app)
      .put(`/api/v1/emergency-requests/${reqId}/status`)
      .set('Authorization', `Bearer ${hospitalToken}`)
      .send({ status: 'In_Progress' });
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.data.status, 'In_Progress');
  });

  test('Campaigns workflow: create and update donation drive', async () => {
    const createRes = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Community College Blood Camp',
        organizer: 'Rotaract Club of Delhi',
        location: 'College Auditorium, North Campus',
        date: '2026-03-15',
        start_time: '10:00:00',
        end_time: '16:00:00',
        target_units: 120,
        status: 'Upcoming'
      });
    assert.equal(createRes.status, 201);
    const campId = createRes.body.data.campaign_id;
    assert.ok(campId);

    // Update campaign
    const updateRes = await request(app)
      .put(`/api/v1/campaigns/${campId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ collected_units: 45, status: 'Active' });
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.data.collected_units, 45);
  });

  test('Reports and Analytics: summary and CSV export', async () => {
    // 1. JSON summary
    const summaryRes = await request(app)
      .get('/api/v1/reports/summary')
      .set('Authorization', `Bearer ${tmoToken}`);
    assert.equal(summaryRes.status, 200);
    assert.ok(summaryRes.body.data.monthlyDonations);
    assert.ok(summaryRes.body.data.labOutcomes);
    assert.ok(summaryRes.body.data.emergencyStats);

    // 2. CSV export
    const csvRes = await request(app)
      .get('/api/v1/reports/export')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(csvRes.status, 200);
    assert.ok(csvRes.text.includes('MediConnect Blood Surveillance'));
  });

  test('GET /api/v1/users/notifications returns role-tailored alerts', async () => {
    // 1. Donor notifications
    const donorRes = await request(app)
      .get('/api/v1/users/notifications')
      .set('Authorization', `Bearer ${donorToken}`);
    assert.equal(donorRes.status, 200);
    assert.ok(Array.isArray(donorRes.body.data));

    // 2. TMO notifications
    const tmoRes = await request(app)
      .get('/api/v1/users/notifications')
      .set('Authorization', `Bearer ${tmoToken}`);
    assert.equal(tmoRes.status, 200);
    assert.ok(Array.isArray(tmoRes.body.data));
    assert.ok(tmoRes.body.data.some(n => n.type === 'clinical_review'));
  });
});
