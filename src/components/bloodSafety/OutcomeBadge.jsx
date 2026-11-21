import React from 'react';
import { CheckCircle2, Clock, Ban, Stethoscope } from 'lucide-react';

export const OutcomeBadge = ({ outcome = 'Pending assessment', size = 'md', className = '' }) => {
  const configs = {
    'Accepted for donation': {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
      icon: CheckCircle2,
      label: 'Accepted for Donation',
    },
    'Temporarily deferred': {
      bg: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
      icon: Clock,
      label: 'Temporarily Deferred',
    },
    'Permanently deferred': {
      bg: 'bg-red-50 text-red-900 border-red-300 font-bold',
      icon: Ban,
      label: 'Permanently Deferred',
    },
    'Referred for medical review': {
      bg: 'bg-sky-50 text-sky-800 border-sky-300 font-semibold',
      icon: Stethoscope,
      label: 'Referred for Medical Review',
    },
    'Pending assessment': {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Clock,
      label: 'Pending Assessment',
    },
  };

  const current = configs[outcome] || configs['Pending assessment'];
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border select-none ${current.bg} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
};
