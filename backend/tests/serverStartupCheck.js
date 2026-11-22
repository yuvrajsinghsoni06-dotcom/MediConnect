import http from 'http';
import app from '../src/app.js';

const PORT = 5055; // dedicated verification port

async function runStartupVerification() {
  console.log('[STARTUP CHECK] Testing MediConnect backend server startup...');

  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) return reject(err);
      console.log(`[STARTUP CHECK] ✅ Server successfully listening on http://localhost:${PORT}`);
      resolve();
    });
  });

  const makeRequest = (path, method = 'GET', body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: PORT,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
            ...headers
          }
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        }
      );
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    // 1. Health check
    const health = await makeRequest('/health');
    console.log(`[STARTUP CHECK] Health status: ${health.status}`, health.data);
    if (health.status !== 200 || health.data.status !== 'healthy') {
      throw new Error('Health check failed');
    }

    // 2. Demo accounts login check
    const demoAccounts = [
      { role: 'admin', email: 'admin@mediconnect.local' },
      { role: 'blood_bank_staff', email: 'staff.rohit@mediconnect.local' },
      { role: 'lab_technician', email: 'lab.anita@mediconnect.local' },
      { role: 'clinical_reviewer', email: 'dr.priya.tmo@mediconnect.local' },
      { role: 'donor', email: 'rahul.donor@mediconnect.local' },
      { role: 'hospital_coordinator', email: 'coord.vikram@cityhospital.local' }
    ];

    for (const acct of demoAccounts) {
      const loginRes = await makeRequest('/api/v1/auth/login', 'POST', {
        email: acct.email,
        password: 'Password@123'
      });
      if (loginRes.status !== 200 || !loginRes.data.token) {
        throw new Error(`Login failed for ${acct.email}: ${JSON.stringify(loginRes.data)}`);
      }
      console.log(`[STARTUP CHECK] ✅ Demo login verified: ${acct.email} -> Role: ${loginRes.data.user.role}`);
    }

    // 3. Inactive account test
    const inactiveRes = await makeRequest('/api/v1/auth/login', 'POST', {
      email: 'inactive.user@mediconnect.local',
      password: 'Password@123'
    });
    if (inactiveRes.status !== 403 || inactiveRes.data.error !== 'ACCOUNT_INACTIVE') {
      throw new Error(`Inactive account rejection failed: ${JSON.stringify(inactiveRes.data)}`);
    }
    console.log('[STARTUP CHECK] ✅ Inactive account rejection verified (403 ACCOUNT_INACTIVE)');

    // 4. Invalid password test
    const invalidPwRes = await makeRequest('/api/v1/auth/login', 'POST', {
      email: 'dr.priya.tmo@mediconnect.local',
      password: 'WrongPassword!'
    });
    if (invalidPwRes.status !== 401 || invalidPwRes.data.error !== 'INVALID_CREDENTIALS') {
      throw new Error(`Invalid password rejection failed: ${JSON.stringify(invalidPwRes.data)}`);
    }
    console.log('[STARTUP CHECK] ✅ Invalid password rejection verified (401 INVALID_CREDENTIALS)');

    // 5. Unknown email test
    const unknownRes = await makeRequest('/api/v1/auth/login', 'POST', {
      email: 'nobody@example.com',
      password: 'Password@123'
    });
    if (unknownRes.status !== 401 || unknownRes.data.error !== 'INVALID_CREDENTIALS') {
      throw new Error(`Unknown email rejection failed: ${JSON.stringify(unknownRes.data)}`);
    }
    console.log('[STARTUP CHECK] ✅ Unknown email rejection verified (401 INVALID_CREDENTIALS)');

    // 6. Donor privacy test
    const donorsRes = await makeRequest('/api/v1/donors');
    if (donorsRes.status !== 200 || !Array.isArray(donorsRes.data.data)) {
      throw new Error('Donors endpoint failed');
    }
    const sample = donorsRes.data.data[0];
    if (sample.phone || sample.email || sample.date_of_birth) {
      throw new Error('CRITICAL PRIVACY LEAK: PII returned in public donor endpoint!');
    }
    console.log('[STARTUP CHECK] ✅ Donor privacy shield verified (No phone, email, or DOB exposed)');

    console.log('[STARTUP CHECK] 🎯 ALL SERVER VERIFICATION CHECKS PASSED SUCCESSFULLY.');
  } finally {
    server.close(() => {
      console.log('[STARTUP CHECK] Server gracefully shut down.');
      process.exit(0);
    });
  }
}

runStartupVerification().catch((err) => {
  console.error('[STARTUP CHECK] ❌ Error:', err);
  process.exit(1);
});
