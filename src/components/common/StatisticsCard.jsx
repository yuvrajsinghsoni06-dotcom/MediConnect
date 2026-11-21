import React from 'react';
import { Card } from '../ui/Card';
import { Users, Building2, CheckCircle2, Calendar, TrendingUp } from 'lucide-react';

const iconMap = {
  donors: Users,
  hospitals: Building2,
  requests: CheckCircle2,
  campaigns: Calendar,
};

export const StatisticsCard = ({
  id,
  label,
  value,
  change,
  description,
  isDemo = true,
  className = '',
}) => {
  const Icon = iconMap[id] || TrendingUp;

  return (
    <Card hoverEffect className={`p-6 border border-[#E2E8F0] relative overflow-hidden group ${className}`}>
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/60 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />

      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shadow-xs">
          <Icon className="w-6 h-6" />
        </div>
        {isDemo && (
          <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200" title="Illustrative sample metric for Stage 1">
            Demo Metric
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {value}
        </div>
        <div className="text-sm font-semibold text-[#0F172A]">
          {label}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
        <span>{description}</span>
        {change && (
          <span className="font-medium text-[#16A34A] shrink-0 ml-2">
            {change}
          </span>
        )}
      </div>
    </Card>
  );
};
