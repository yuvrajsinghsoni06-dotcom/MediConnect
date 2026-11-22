import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

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

  test('GET /api/v1/auth/me returns profile for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${tmoToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.user.role, 'clinical_reviewer');
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
});
