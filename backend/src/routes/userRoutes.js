import express from 'express';
import { z } from 'zod';
import {
  UsersRepository,
  DonorsRepository,
  EmergencyRequestsRepository,
  AuditLogsRepository
} from '../repositories/index.js';
import { authenticateToken } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';
import { validateBody } from '../middleware/validator.js';

const router = express.Router();

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

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  phone: z.string().trim().min(10, { message: 'Phone number must be at least 10 digits' }).optional(),
  city: z.string().trim().min(1, { message: 'City is required' }).optional(),
  state: z.string().trim().optional()
});

const donorOnboardingSchema = z.object({
  full_name: z.string().trim().min(2, { message: 'Full name must be at least 2 characters' }),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    errorMap: () => ({ message: 'Valid ABO/Rh blood group is required' })
  }),
  date_of_birth: z.string().refine((val) => {
    const dob = new Date(val);
    if (isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    // DGHS Statutory Donor Age Threshold: 18 - 65 years
    return age >= 18 && age <= 65;
  }, { message: 'Donor must be between 18 and 65 years of age according to DGHS standards' }),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid gender option' })
  }),
  phone: z.string().trim().min(10, { message: 'Phone number must be at least 10 digits' }),
  city: z.string().trim().min(1, { message: 'City is required' }),
  state: z.string().trim().optional()
});

// ============================================================================
// 1. GET USER PROFILE & ONBOARDING STATUS
// ============================================================================
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await UsersRepository.findByUserId(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User account not found.'
      });
    }

    // Never expose password_hash
    const safeUser = {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: Boolean(user.is_active),
      createdAt: user.created_at
    };

    let donorProfile = null;
    let donationHistory = [];
    let matchingRequests = [];

    // If user is a donor, fetch linked donor details and donation history
    if (user.role === 'donor') {
      donorProfile = await DonorsRepository.findByUserId(userId);

      if (donorProfile) {
        donationHistory = await DonorsRepository.getDonationHistory(donorProfile.donor_id);
        matchingRequests = await EmergencyRequestsRepository.listMatching(donorProfile.blood_group);
      }
    }

    res.json({
      success: true,
      user: safeUser,
      donorProfile: donorProfile ? {
        donor_id: donorProfile.donor_id,
        full_name: donorProfile.full_name,
        blood_group: donorProfile.blood_group,
        date_of_birth: donorProfile.date_of_birth,
        gender: donorProfile.gender,
        phone: donorProfile.phone,
        email: donorProfile.email,
        city: donorProfile.city,
        state: donorProfile.state,
        total_donations: donorProfile.total_donations || 0,
        last_donation_date: donorProfile.last_donation_date || null
      } : null,
      isOnboarded: Boolean(donorProfile),
      donationHistory,
      matchingRequests
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 2. UPDATE USER PROFILE (PERMITTED FIELDS)
// ============================================================================
router.put('/profile', authenticateToken, validateBody(updateProfileSchema), async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, phone, city, state } = req.body;

    const user = await UsersRepository.findByUserId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User account not found.'
      });
    }

    // Update users table
    if (name) {
      await UsersRepository.update(userId, { name });
    }

    // Update linked donor record if exists
    const donor = await DonorsRepository.findByUserId(userId);
    if (donor) {
      const derivedState = state || stateMap[city] || donor.state || 'Maharashtra';
      await DonorsRepository.update(donor.donor_id, {
        full_name: name || donor.full_name,
        blood_group: donor.blood_group,
        date_of_birth: donor.date_of_birth,
        gender: donor.gender,
        phone: phone || donor.phone,
        city: city || donor.city,
        state: derivedState
      });
    }

    await AuditLogsRepository.record({
      eventType: 'USER_PROFILE_UPDATED',
      recordId: userId,
      entityType: 'users',
      actorUserId: userId,
      actorRole: user.role,
      ipAddress: req.ip,
      details: { updatedFields: Object.keys(req.body) }
    });

    const updatedUser = await UsersRepository.findByUserId(userId);
    const updatedDonor = await DonorsRepository.findByUserId(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        userId: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department
      },
      donorProfile: updatedDonor ? {
        donor_id: updatedDonor.donor_id,
        full_name: updatedDonor.full_name,
        blood_group: updatedDonor.blood_group,
        date_of_birth: updatedDonor.date_of_birth,
        gender: updatedDonor.gender,
        phone: updatedDonor.phone,
        email: updatedDonor.email,
        city: updatedDonor.city,
        state: updatedDonor.state
      } : null
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 3. DONOR ONBOARDING (RESTRICTED TO DONOR ROLE)
// ============================================================================
router.post('/donor-onboarding', authenticateToken, requireRole('donor'), validateBody(donorOnboardingSchema), async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { full_name, blood_group, date_of_birth, gender, phone, city } = req.body;
    const state = req.body.state || stateMap[city] || 'Maharashtra';

    const user = await UsersRepository.findByUserId(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User account not found.'
      });
    }

    // Check if donor profile already exists for this user (prevent duplicate profiles)
    let donor = await DonorsRepository.findByUserId(userId);

    if (donor) {
      // Update existing donor profile
      donor = await DonorsRepository.update(donor.donor_id, {
        full_name,
        blood_group,
        date_of_birth,
        gender,
        phone,
        city,
        state
      });
    } else {
      // Create new donor profile linked to this authenticated user
      const donorId = `DNR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      donor = await DonorsRepository.create({
        donor_id: donorId,
        user_id: userId,
        full_name,
        blood_group,
        date_of_birth,
        gender,
        phone,
        email: user.email,
        city,
        state
      });
    }

    // Keep user's display name synced
    await UsersRepository.update(userId, { name: full_name });

    await AuditLogsRepository.record({
      eventType: 'DONOR_ONBOARDED',
      recordId: donor.donor_id,
      entityType: 'donors',
      actorUserId: userId,
      actorRole: 'donor',
      ipAddress: req.ip,
      details: {
        donor_id: donor.donor_id,
        blood_group,
        city
      }
    });

    res.status(200).json({
      success: true,
      message: 'Donor onboarding completed successfully! Your donor profile is now active.',
      donorProfile: {
        donor_id: donor.donor_id,
        full_name: donor.full_name,
        blood_group: donor.blood_group,
        date_of_birth: donor.date_of_birth,
        gender: donor.gender,
        phone: donor.phone,
        email: donor.email,
        city: donor.city,
        state: donor.state,
        total_donations: donor.total_donations || 0,
        last_donation_date: donor.last_donation_date || null
      }
    });
  } catch (err) {
    next(err);
  }
});

// Role-Based Notifications Feed
router.get('/notifications', authenticateToken, async (req, res, next) => {
  try {
    const role = req.user.role;
    const userId = req.user.userId;
    const notifications = [];

    if (role === 'donor') {
      const donor = await DonorsRepository.findByUserId(userId);
      if (donor) {
        const matching = await EmergencyRequestsRepository.listMatching(donor.blood_group);
        if (matching.length > 0) {
          notifications.push({
            id: 'NOTIF-EMG-MATCH',
            type: 'urgent_match',
            title: 'Urgent Hospital Blood Requirement',
            message: `${matching.length} active emergency request(s) match your blood group (${donor.blood_group}). Your donation can save lives today.`,
            timestamp: new Date().toISOString(),
            priority: 'high'
          });
        }
        if (!donor.last_donation_date || (new Date() - new Date(donor.last_donation_date)) > (90 * 24 * 60 * 60 * 1000)) {
          notifications.push({
            id: 'NOTIF-DON-ELIGIBLE',
            type: 'eligibility',
            title: 'Eligible for Voluntary Donation',
            message: 'You have cleared the mandatory interval period and are eligible to donate whole blood.',
            timestamp: new Date().toISOString(),
            priority: 'normal'
          });
        }
      } else {
        notifications.push({
          id: 'NOTIF-ONBOARD-INCOMPLETE',
          type: 'onboarding',
          title: 'Complete Your Donor Profile',
          message: 'Please complete your donor health profile to receive blood matching alerts and accession certificates.',
          timestamp: new Date().toISOString(),
          priority: 'normal'
        });
      }
    } else if (role === 'clinical_reviewer') {
      notifications.push({
        id: 'NOTIF-TMO-PENDING',
        type: 'clinical_review',
        title: 'Units Awaiting Release Disposition',
        message: 'There are laboratory-screened units requiring medical officer clinical disposition.',
        timestamp: new Date().toISOString(),
        priority: 'high'
      });
    } else if (role === 'lab_technician') {
      notifications.push({
        id: 'NOTIF-LAB-WORKLIST',
        type: 'laboratory_worklist',
        title: 'Active Screening Queue',
        message: 'Mandatory 5-infection TTI screening batches are active in the serology lab.',
        timestamp: new Date().toISOString(),
        priority: 'normal'
      });
    } else if (role === 'blood_bank_staff' || role === 'admin') {
      notifications.push({
        id: 'NOTIF-STAFF-INVENTORY',
        type: 'inventory_alert',
        title: 'Inventory Surveillance Active',
        message: 'Safe blood inventory is monitored in real-time under DGHS cold-chain guidelines.',
        timestamp: new Date().toISOString(),
        priority: 'normal'
      });
    } else if (role === 'hospital_coordinator') {
      notifications.push({
        id: 'NOTIF-COORD-TRANSFUSION',
        type: 'transfusion_requisition',
        title: 'Emergency Blood Link Active',
        message: 'Your hospital connection to the central blood banking reserve is online.',
        timestamp: new Date().toISOString(),
        priority: 'normal'
      });
    }

    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    next(err);
  }
});

export default router;
