import React from 'react';
import { CheckCircle2, Lock, AlertTriangle, Clock, Ban, Trash2 } from 'lucide-react';

export const DispositionBadge = ({ status = 'Awaiting testing', size = 'md', className = '' }) => {
  const configs = {
    'Approved for release': {
      bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold',
      icon: CheckCircle2,
      label: 'Approved for Release',
      note: 'All statutory assays non-reactive; verified by Transfusion Medical Officer',
    },
    'Quarantined': {
      bg: 'bg-red-100 text-red-950 border-red-300 font-extrabold shadow-2xs',
      icon: Lock,
      label: 'Quarantined (Bio-Lock)',
      note: 'Strict quarantine engaged; release prohibited by clinical protocol',
    },
    'Under investigation': {
      bg: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
      icon: AlertTriangle,
      label: 'Under Investigation',
      note: 'Inconclusive assay or duplicate re-run pending clinical review',
    },
    'Awaiting testing': {
      bg: 'bg-sky-50 text-sky-900 border-sky-300 font-medium',
      icon: Clock,
      label: 'Awaiting Testing',
      note: 'Component collected; mandatory infection screening assays in progress',
    },
    'Not for transfusion': {
      bg: 'bg-rose-100 text-rose-950 border-rose-300 font-bold',
      icon: Ban,
      label: 'Not for Transfusion',
      note: 'Unit restricted by medical officer order',
    },
    'Discarded': {
      bg: 'bg-slate-200 text-slate-800 border-slate-300 line-through',
      icon: Trash2,
      label: 'Discarded (Bio-Waste)',
      note: 'Unit decontaminated and incinerated under biomedical waste rules',
    },
  };

  const current = configs[status] || configs['Awaiting testing'];
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border tracking-tight select-none ${current.bg} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      title={current.note}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
};
