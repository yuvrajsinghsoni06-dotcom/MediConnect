import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Droplet,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { PLATFORM_ROLES, MAJOR_CITIES, BLOOD_GROUPS } from '../../utils/constants';
import api from '../../services/api';

const registerSchema = z
  .object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please provide a valid email address.' }),
    phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
    city: z.string().min(1, { message: 'Please select your municipal city.' }),
    role: z.string().min(1, { message: 'Please select an account role.' }),
    bloodGroup: z.string().optional(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
      .regex(/[0-9]/, { message: 'Password must contain at least one digit.' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password.' }),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms & conditions.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ['confirmPassword'],
  });

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      city: 'Mumbai',
      role: 'donor',
      bloodGroup: 'O+',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const response = await api.post('/auth/register', {
        name: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: data.phoneNumber ? data.phoneNumber.trim() : undefined,
        phoneNumber: data.phoneNumber ? data.phoneNumber.trim() : undefined,
        city: data.city,
        bloodGroup: data.bloodGroup || 'O+',
        // role is ignored by server - securely defaulted to donor
      });

      if (response.data && response.data.success) {
        setDemoSuccess(true);
      } else {
        throw new Error(response.data?.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('[Register] Request failed:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setApiError(serverMessage || 'Failed to connect to authentication server. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
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
            Create Platform Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Join as a volunteer donor, patient representative, hospital coordinator, or NGO
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-6 sm:p-8 border border-[#E2E8F0] shadow-soft bg-white">
          {demoSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                Account Created Successfully!
              </h2>
              <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto">
                Your voluntary donor account has been registered and verified in the database. You can now sign in using your email and password.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Proceed to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Server / Network Error Alert */}
              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{apiError}</span>
                </div>
              )}
              {/* Account Role Selector */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Select Account Role <span className="text-[#DC2626]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PLATFORM_ROLES.map((role) => (
                    <label
                      key={role.id}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedRole === role.id
                          ? 'border-[#DC2626] bg-red-50/50 text-[#0F172A]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        value={role.id}
                        {...register('role')}
                        className="mt-0.5 text-[#DC2626] focus:ring-[#DC2626]"
                      />
                      <div>
                        <div className="font-bold">{role.label}</div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{role.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Full Name"
                  placeholder="e.g. Dr. Ananya Sharma"
                  required
                  icon={User}
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@domain.com"
                  required
                  icon={Mail}
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Phone Number"
                  placeholder="10-digit contact number"
                  required
                  icon={Phone}
                  helperText="Stored securely; never published publicly"
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />

                <Select
                  label="Municipal City"
                  required
                  icon={MapPin}
                  error={errors.city?.message}
                  {...register('city')}
                >
                  {MAJOR_CITIES.filter((c) => c !== 'All Cities').map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </div>

              {/* Optional Blood Group selector if Donor role selected */}
              {selectedRole === 'donor' && (
                <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-100">
                  <Select
                    label="Blood Group (Optional for Donors)"
                    icon={Droplet}
                    {...register('bloodGroup')}
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Password */}
                <div>
                  <label htmlFor="register-password" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                    Password <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 chars"
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                    Confirm Password <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                      className={`block w-full rounded-lg border text-sm text-[#0F172A] pl-10 pr-10 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 ${
                        errors.confirmPassword
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-[#E2E8F0] focus:border-[#DC2626] bg-white'
                      }`}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2 text-xs text-[#64748B] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-slate-300 text-[#DC2626] focus:ring-[#DC2626] w-4 h-4"
                    {...register('termsAccepted')}
                  />
                  <span>
                    I understand that MediConnect is a voluntary coordination platform and agree to abide by non-commercial blood donation principles and privacy terms.
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.termsAccepted.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Create Platform Account (Demo)
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Link to Login */}
        <div className="text-center text-xs text-[#64748B]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#DC2626] hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
