import React from 'react';
import { useSafetyAuth } from '../../context/SafetyAuthContext';
import { Shield, UserCheck, KeyRound, AlertCircle, RefreshCw } from 'lucide-react';

export const SafetyRoleBanner = () => {
  const { currentRole, currentUser, activeRoleId, setRole, availableRoles } = useSafetyAuth();

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-soft mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Current Active Persona */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-[#DC2626] border border-red-200 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Acting Operational Persona:
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#DC2626] text-white">
                {currentRole.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({currentUser.name} • {currentUser.credentials})
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentUser.facility} • <span className="font-semibold">{currentRole.description}</span>
            </p>
          </div>
        </div>

        {/* Quick Role Switcher for Demonstration & Testing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Switch Role for Audit:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableRoles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeRoleId === r.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {r.badgeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
