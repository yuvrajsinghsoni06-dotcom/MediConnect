import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Droplet,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';
import { useSafetyAuth, ROLE_MAP } from '../../context/SafetyAuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});

// Official Demo Accounts Catalog
const DEMO_PRESETS = [
  { label: 'TMO / Clinical Reviewer', email: 'dr.priya.tmo@mediconnect.local', role: 'clinical_reviewer' },
  { label: 'Blood Bank Staff', email: 'staff.rohit@mediconnect.local', role: 'blood_bank_staff' },
  { label: 'Lab Technician', email: 'lab.anita@mediconnect.local', role: 'lab_technician' },
  { label: 'System Admin', email: 'admin@mediconnect.local', role: 'admin' },
  { label: 'Hospital Coordinator', email: 'coord.vikram@cityhospital.local', role: 'hospital_coordinator' },
  { label: 'Registered Donor', email: 'rahul.donor@mediconnect.local', role: 'donor' },
];

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useSafetyAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const getDestinationForRole = (backendRole) => {
    switch (backendRole) {
      case 'admin':
        return '/blood-safety';
      case 'blood_bank_staff':
        return '/blood-safety/donations';
      case 'lab_technician':
        return '/blood-safety/laboratory';
      case 'clinical_reviewer':
        return '/blood-safety/clinical-review';
      case 'hospital_coordinator':
        return '/blood-safety/donations';
      case 'donor':
      default:
        return '/find-donors';
    }
  };

  const onSubmit = async (data) => {
    setApiError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: data.email.trim(),
        password: data.password,
      });

      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
        // Synchronize authenticated session in Context & LocalStorage
        login(token, user);

        // Role-based routing
        const targetPath = getDestinationForRole(user.role);
        navigate(targetPath, { replace: true });
      } else {
        throw new Error('Malformed authentication response from server.');
      }
    } catch (err) {
      console.error('[Login] Authentication request failed:', err);

      if (!err.response) {
        setApiError(
          'Unable to reach MediConnect authentication server. Please ensure the backend is active at http://localhost:5000.'
        );
      } else if (err.response.status === 401) {
        setApiError(
          err.response.data?.message || 'Invalid email address or password. Please verify your credentials.'
        );
      } else if (err.response.status === 403 && err.response.data?.error === 'ACCOUNT_INACTIVE') {
        setApiError(
          'Your account has been deactivated. Please contact your system administrator.'
        );
      } else {
        setApiError(
          err.response.data?.message || 'Authentication error. Please check your network and credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email) => {
    setValue('email', email);
    setValue('password', 'Password@123');
    setApiError(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shadow-md">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-extrabold text-[#0F172A]">
              Medi<span className="text-[#DC2626]">Connect</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Authoritative healthcare access, blood-safety screening, and donor management
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 border border-[#E2E8F0] shadow-soft bg-white">
          {/* Server Error Alert */}
          {apiError && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{apiError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@mediconnect.local"
              required
              icon={Mail}
              error={errors.email?.message}
              disabled={loading}
              {...register('email')}
            />

            <div className="w-full">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-semibold text-[#0F172A]">
                  Password <span className="text-[#DC2626]">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#DC2626] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  disabled={loading}
                  className={`block w-full rounded-lg border text-sm text-[#0F172A] pl-10 pr-10 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 ${
                    errors.password
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-[#E2E8F0] focus:border-[#DC2626] bg-white'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[#64748B] cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-[#DC2626] focus:ring-[#DC2626] w-4 h-4"
                  {...register('rememberMe')}
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold"
                isLoading={loading}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </div>

            {/* Demo Autofill Presets */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Autofill Presets:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Default PW: Password@123
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.email}
                    type="button"
                    onClick={() => handleFillDemo(preset.email)}
                    disabled={loading}
                    className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-left text-[11px] font-medium border border-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </Card>

        {/* Link to Registration */}
        <div className="text-center text-xs text-[#64748B]">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#DC2626] hover:underline">
            Register for MediConnect
          </Link>
        </div>
      </div>
    </div>
  );
};
