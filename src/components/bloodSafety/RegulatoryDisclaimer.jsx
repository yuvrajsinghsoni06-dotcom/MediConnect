import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const RegulatoryDisclaimer = ({ className = '' }) => {
  return (
    <div className={`p-4 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <strong className="text-white text-sm font-bold tracking-tight">
            Transfusion Transmitted Infection (TTI) Safety Architecture
          </strong>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
          Academic DBMS Demonstration
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-[11px] leading-relaxed text-slate-400">
        <div className="space-y-1">
          <strong className="text-slate-200 block font-semibold">Statutory Screening Mandate:</strong>
          <span>
            Every collected unit must independently pass mandatory screening for HIV-1/2, Hepatitis B, Hepatitis C, Syphilis, and Malaria. A prior negative test never validates a future donation.
          </span>
        </div>

        <div className="space-y-1">
          <strong className="text-slate-200 block font-semibold">Automated Quarantine Lock:</strong>
          <span>
            Any reactive, inconclusive, or invalid screening result automatically locks the unit in bio-hazard quarantine. Release is strictly blocked until confirmed by a Transfusion Medical Officer.
          </span>
        </div>

        <div className="space-y-1">
          <strong className="text-slate-200 block font-semibold">Confidentiality & Governance:</strong>
          <span>
            Donor infection screening records are never published publicly. Follow-up notifications and counselling are conducted through private, authenticated clinical channels.
          </span>
        </div>
      </div>
    </div>
  );
};
