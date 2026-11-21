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

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Public & Authenticated Layout Wrapper */}
      <Route element={<AppLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/find-donors" element={<FindDonorsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
