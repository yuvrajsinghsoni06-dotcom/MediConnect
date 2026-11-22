import React, { useState } from 'react';
import { useSafetyAuth } from '../../context/SafetyAuthContext';
import { Shield, UserCheck, KeyRound, AlertCircle, RefreshCw, RotateCcw, AlertTriangle, LogOut, CheckCircle } from 'lucide-react';
import { bloodSafetyService } from '../../services/bloodSafetyService';

export const SafetyRoleBanner = () => {
  const { currentRole, currentUser, activeRoleId, setRole, availableRoles, isAuthenticated, logout } = useSafetyAuth();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset all demonstration data back to pristine baseline simulation state? Any new test assessments or disposition overrides will be restored.')) {
      setIsResetting(true);
      await bloodSafetyService.resetDemoData();
      setIsResetting(false);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-2 mb-6">
      {/* Session Status Notice */}
      {isAuthenticated ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 text-[10px] flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-700" />
              Authenticated Session
            </span>
            <span className="text-[11px] text-emerald-800">
              Logged in as <strong>{currentUser.email}</strong>. Server-side role verification is active; client-side role switching is locked.
            </span>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px]">
              Demo Simulation Mode
            </span>
            <span className="text-[11px] text-amber-800">
              Unauthenticated prototype mode. Role checks demonstrate capability boundaries; not a substitute for backend server security.
            </span>
          </div>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:text-red-700 underline transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-soft">
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
                  ({currentUser.name} {currentUser.credentials ? `• ${currentUser.credentials}` : ''})
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentUser.facility} • <span className="font-semibold">{currentRole.description}</span>
              </p>
            </div>
          </div>

          {/* Quick Role Switcher (Available ONLY in isolated demo mode) */}
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Demo Persona:</span>
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
          )}
        </div>
      </div>
    </div>
  );
};
