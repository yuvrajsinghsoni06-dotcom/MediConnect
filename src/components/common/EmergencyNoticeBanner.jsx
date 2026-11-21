import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const EmergencyNoticeBanner = ({
  className = '',
  title = 'Preliminary Matching & Medical Disclaimer',
  description = 'Displayed matches and search filters are preliminary coordination indicators only. Final donor eligibility, ABO/Rh antibody cross-matching, infectious disease screening, and transfusion compatibility must always be confirmed directly by licensed healthcare professionals at accredited clinical facilities.',
}) => {
  return (
    <div className={`rounded-xl border border-blue-200 bg-sky-50/70 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="text-sm">
        <div className="font-bold text-[#0F172A] flex items-center gap-2">
          <span>{title}</span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            Medical Safety Principle
          </span>
        </div>
        <p className="mt-1 text-[#64748B] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
