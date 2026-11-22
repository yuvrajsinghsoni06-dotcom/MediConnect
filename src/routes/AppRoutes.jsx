import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { FindDonorsPage } from '../pages/public/FindDonorsPage';
import { CampaignsPage } from '../pages/public/CampaignsPage';
import { ContactPage } from '../pages/public/ContactPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';
import { ProfilePage } from '../pages/profile/ProfilePage';

// Blood Safety & Donor Health Verification Module Pages
import { SafetyAuthProvider } from '../context/SafetyAuthContext';
import { SafetyDashboardPage } from '../pages/bloodSafety/SafetyDashboardPage';
import { DonorAssessmentPage } from '../pages/bloodSafety/DonorAssessmentPage';
import { DonationsListPage } from '../pages/bloodSafety/DonationsListPage';
import { DonationDetailPage } from '../pages/bloodSafety/DonationDetailPage';
import { LaboratoryTestingPage } from '../pages/bloodSafety/LaboratoryTestingPage';
import { QuarantineManagementPage } from '../pages/bloodSafety/QuarantineManagementPage';
import { ClinicalReviewPage } from '../pages/bloodSafety/ClinicalReviewPage';
import { ConfidentialFollowUpPage } from '../pages/bloodSafety/ConfidentialFollowUpPage';
import { AuditLogsPage } from '../pages/bloodSafety/AuditLogsPage';

export const AppRoutes = () => {
  return (
    <SafetyAuthProvider>
      <Routes>
        {/* Main Public & Authenticated Layout Wrapper */}
        <Route element={<AppLayout />}>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/find-donors" element={<FindDonorsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Authentication & User Profile Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/donor/dashboard" element={<ProfilePage />} />
          <Route path="/donor/onboarding" element={<ProfilePage />} />

          {/* Blood Safety & Donor Health Verification Module */}
          <Route path="/blood-safety" element={<SafetyDashboardPage />} />
          <Route path="/blood-safety/donor-assessment" element={<DonorAssessmentPage />} />
          <Route path="/blood-safety/donations" element={<DonationsListPage />} />
          <Route path="/blood-safety/donation/:id" element={<DonationDetailPage />} />
          <Route path="/blood-safety/laboratory" element={<LaboratoryTestingPage />} />
          <Route path="/blood-safety/quarantine" element={<QuarantineManagementPage />} />
          <Route path="/blood-safety/clinical-review" element={<ClinicalReviewPage />} />
          <Route path="/blood-safety/follow-up" element={<ConfidentialFollowUpPage />} />
          <Route path="/blood-safety/audit-logs" element={<AuditLogsPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </SafetyAuthProvider>
  );
};
