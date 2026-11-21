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
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  rememberMe: z.boolean().optional(),
});

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    // Frontend demo simulation
    await new Promise((res) => setTimeout(res, 500));
    setDemoSuccess(true);
  };

  const handleFillDemo = (roleEmail) => {
    setValue('email', roleEmail);
    setValue('password', 'DemoPassword123!');
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
            Access emergency coordination, donor profiles, and platform services
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 border border-[#E2E8F0] shadow-soft bg-white">
          {demoSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                Frontend Auth Demonstration
              </h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Form validation passed successfully! In Stage 2, this sends an authentication payload to the Node.js / MySQL backend and stores a signed JWT session.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="doctor@hospital.org or donor@demo.org"
                required
                icon={Mail}
                error={errors.email?.message}
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
                  <span>Remember my browser for 30 days</span>
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Sign In (Demo)
                </Button>
              </div>

              {/* Quick autofill helper for grading & testing */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Demo Autofill Presets:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('donor@demo-mediconnect.org')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px]"
                  >
                    Donor Role
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('hospital.admin@citygeneral.org')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px]"
                  >
                    Hospital Role
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('bloodbank@redcross-metro.org')}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px]"
                  >
                    Blood Bank Role
                  </button>
                </div>
              </div>
            </form>
          )}
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
