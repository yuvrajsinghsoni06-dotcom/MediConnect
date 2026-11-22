import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/environment.js';
import { UsersRepository, AuditLogsRepository } from '../repositories/index.js';
import { authenticateToken } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validator.js';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email address is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

// Demo accounts catalog (for developer/reviewer assistance)
const DEMO_USERS = [
  { userId: 'USR-ADM-001', name: 'System Administrator', email: 'admin@mediconnect.local', role: 'admin', mappedRole: 'administrator', department: 'IT & Systems' },
  { userId: 'USR-BBS-001', name: 'Staff Nurse Rohit Verma', email: 'staff.rohit@mediconnect.local', role: 'blood_bank_staff', mappedRole: 'blood_bank', department: 'Blood Bank Phlebotomy' },
  { userId: 'USR-LAB-001', name: 'Technician Anita Rao', email: 'lab.anita@mediconnect.local', role: 'lab_technician', mappedRole: 'lab_staff', department: 'Serology & Screening Lab' },
  { userId: 'USR-TMO-001', name: 'Dr. Priya Nair (TMO)', email: 'dr.priya.tmo@mediconnect.local', role: 'clinical_reviewer', mappedRole: 'clinical_reviewer', department: 'Transfusion Medicine Quality Office' },
  { userId: 'USR-DNR-001', name: 'Rahul Sharma', email: 'rahul.donor@mediconnect.local', role: 'donor', mappedRole: 'donor', department: 'Community Donors' },
  { userId: 'USR-HSP-001', name: 'Coordinator Vikram Seth', email: 'coord.vikram@cityhospital.local', role: 'hospital_coordinator', mappedRole: 'hospital', department: 'Apollo Emergency Transfusion Dept' },
  { userId: 'USR-INA-001', name: 'Deactivated User', email: 'inactive.user@mediconnect.local', role: 'donor', mappedRole: 'donor', department: 'Community Donors', is_active: 0 }
];

router.get('/demo-users', (req, res) => {
  res.json({
    success: true,
    data: DEMO_USERS.filter(u => u.is_active !== 0),
    documentation: 'Password for all demo accounts is: Password@123'
  });
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      await AuditLogsRepository.record({
        eventType: 'LOGIN_FAILED',
        recordId: 'UNKNOWN_USER',
        entityType: 'users',
        actorUserId: 'ANONYMOUS',
        actorRole: 'anonymous',
        ipAddress: req.ip,
        details: { email, reason: 'User not found' }
      });

      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email address or password. Please verify your credentials.'
      });
    }

    // Inactive account check
    if (user.is_active === 0 || user.is_active === false) {
      await AuditLogsRepository.record({
        eventType: 'LOGIN_REJECTED_INACTIVE_ACCOUNT',
        recordId: user.user_id,
        entityType: 'users',
        actorUserId: user.user_id,
        actorRole: user.role,
        ipAddress: req.ip,
        details: { email: user.email, reason: 'Deactivated account login attempt' }
      });

      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: 'Account is deactivated. Please contact your system administrator.'
      });
    }

    // Secure bcrypt password verification
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      await AuditLogsRepository.record({
        eventType: 'LOGIN_FAILED',
        recordId: user.user_id,
        entityType: 'users',
        actorUserId: user.user_id,
        actorRole: user.role,
        ipAddress: req.ip,
        details: { email: user.email, reason: 'Password mismatch' }
      });

      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email address or password. Please verify your credentials.'
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    await AuditLogsRepository.record({
      eventType: 'USER_LOGIN',
      recordId: user.user_id,
      entityType: 'users',
      actorUserId: user.user_id,
      actorRole: user.role,
      ipAddress: req.ip,
      details: { email: user.email, role: user.role }
    });

    res.json({
      success: true,
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
