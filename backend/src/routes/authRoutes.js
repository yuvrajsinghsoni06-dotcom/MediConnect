import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/environment.js';
import { UsersRepository, AuditLogsRepository, DonorsRepository } from '../repositories/index.js';
import { authenticateToken } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validator.js';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Valid email address is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit' }),
  phone: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  city: z.string().trim().optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional()
});

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Valid email address is required' }),
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

router.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').toLowerCase().trim();
    const password = req.body.password;
    const phone = (req.body.phone || req.body.phoneNumber || '').trim();
    const city = (req.body.city || 'Mumbai').trim();
    const bloodGroup = req.body.bloodGroup || 'O+';

    // 1. Prevent duplicate email registration
    const existing = await UsersRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    // 2. Hash password securely using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Security: Public registration strictly defaults to 'donor' role
    // Never allow registration with privileged roles (admin, staff, lab, reviewer, hospital)
    const newUser = await UsersRepository.create({
      name,
      email,
      password_hash: passwordHash,
      role: 'donor',
      department: 'Community Donors',
      is_active: 1
    });

    // 4. Create linked donor profile in registry
    const stateMap = {
      'Mumbai': 'Maharashtra',
      'Pune': 'Maharashtra',
      'New Delhi': 'Delhi',
      'Delhi': 'Delhi',
      'Bengaluru': 'Karnataka',
      'Hyderabad': 'Telangana',
      'Chennai': 'Tamil Nadu',
      'Kolkata': 'West Bengal',
      'Ahmedabad': 'Gujarat',
      'Lucknow': 'Uttar Pradesh',
      'Jaipur': 'Rajasthan',
      'Chandigarh': 'Punjab'
    };
    const state = stateMap[city] || 'Maharashtra';
    const donorId = `DNR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await DonorsRepository.create({
        donor_id: donorId,
        user_id: newUser.user_id,
        full_name: name,
        blood_group: bloodGroup,
        date_of_birth: '2000-01-01',
        gender: 'Other',
        phone: phone || '+91 99999 00000',
        email,
        city,
        state
      });
    } catch (donorErr) {
      console.warn('[Register] Optional donor profile creation notice:', donorErr.message);
    }

    // 5. Immutable security audit record
    await AuditLogsRepository.record({
      eventType: 'USER_REGISTERED',
      recordId: newUser.user_id,
      entityType: 'users',
      actorUserId: newUser.user_id,
      actorRole: 'donor',
      ipAddress: req.ip,
      details: { email: newUser.email, role: 'donor', registeredAt: new Date().toISOString() }
    });

    // 6. Sign JWT token so client can immediately or sequentially authenticate
    const token = jwt.sign(
      { userId: newUser.user_id, role: newUser.role, email: newUser.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to MediConnect.',
      token,
      user: {
        userId: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    const { password } = req.body;
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      // Unauthenticated security event: actorUserId is explicitly NULL to comply with foreign key constraints
      await AuditLogsRepository.record({
        eventType: 'LOGIN_FAILED',
        recordId: 'UNKNOWN_USER',
        entityType: 'users',
        actorUserId: null,
        actorRole: 'anonymous',
        ipAddress: req.ip,
        details: { attemptedEmail: email, reason: 'User not found' }
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
