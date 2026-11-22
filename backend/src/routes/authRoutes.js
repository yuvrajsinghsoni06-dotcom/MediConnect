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
  email: z.string().email(),
  password: z.string().min(1)
});

// Demo accounts metadata
const DEMO_USERS = [
  { userId: 'USR-ADM-001', name: 'System Administrator', email: 'admin@mediconnect.local', role: 'admin', department: 'IT & Systems' },
  { userId: 'USR-BBS-001', name: 'Staff Nurse Rohit Verma', email: 'staff.rohit@mediconnect.local', role: 'blood_bank_staff', department: 'Blood Bank Phlebotomy' },
  { userId: 'USR-LAB-001', name: 'Technician Anita Rao', email: 'lab.anita@mediconnect.local', role: 'lab_technician', department: 'Serology & Screening Lab' },
  { userId: 'USR-TMO-001', name: 'Dr. Priya Nair (TMO)', email: 'dr.priya.tmo@mediconnect.local', role: 'clinical_reviewer', department: 'Transfusion Medicine Quality Office' },
  { userId: 'USR-DNR-001', name: 'Rahul Sharma', email: 'rahul.donor@mediconnect.local', role: 'donor', department: 'Community Donors' },
  { userId: 'USR-HSP-001', name: 'Coordinator Vikram Seth', email: 'coord.vikram@cityhospital.local', role: 'hospital_coordinator', department: 'Apollo Emergency Transfusion Dept' }
];

router.get('/demo-users', (req, res) => {
  res.json({
    success: true,
    data: DEMO_USERS
  });
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.'
      });
    }

    // Demo password 'Password@123' check or bcrypt compare
    const isMatch = password === 'Password@123' || (await bcrypt.compare(password, user.password_hash).catch(() => false));

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.'
      });
    }

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
