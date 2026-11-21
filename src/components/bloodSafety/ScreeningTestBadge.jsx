import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

export const ScreeningTestBadge = ({ status = 'Pending', size = 'md', className = '' }) => {
  const configs = {
    'Non-reactive': {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      label: 'Non-reactive',
      accessibleNote: 'Negative for infection marker',
    },
    'Reactive': {
      bg: 'bg-red-100 text-red-900 border-red-300 font-extrabold',
      icon: AlertCircle,
      label: 'Reactive (Flagged)',
      accessibleNote: 'Screening marker positive; requires quarantine & confirmation',
    },
    'Inconclusive': {
      bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      icon: HelpCircle,
      label: 'Inconclusive / Grey Zone',
      accessibleNote: 'Borderline reading; repeat assay required',
    },
    'Invalid': {
      bg: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
      icon: AlertTriangle,
      label: 'Invalid Run (QC Failed)',
      accessibleNote: 'Control failure; repeat collection/run required',
    },
    'Pending': {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Clock,
      label: 'Pending Assay',
      accessibleNote: 'Laboratory analysis scheduled or in progress',
    },
    'Reviewed': {
      bg: 'bg-blue-50 text-blue-800 border-blue-300',
      icon: ShieldCheck,
      label: 'Clinically Reviewed',
      accessibleNote: 'Assay verified by medical reviewer',
    },
  };

  const current = configs[status] || configs.Pending;
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-semibold select-none ${current.bg} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      title={current.accessibleNote}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
};
