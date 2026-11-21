import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Droplet,
  FlaskConical,
  Lock,
  Stethoscope,
  HeartHandshake,
  FileText
} from 'lucide-react';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const SafetyNavigation = () => {
  const { currentRole } = useSafetyAuth();

  const navItems = [
    {
      to: '/blood-safety',
      label: 'Overview',
      icon: LayoutDashboard,
      end: true,
      allowed: true,
    },
    {
      to: '/blood-safety/donor-assessment',
      label: 'Donor Assessment',
      icon: ClipboardCheck,
      allowed: currentRole.id !== 'hospital',
    },
    {
      to: '/blood-safety/donations',
      label: 'Donation Records',
      icon: Droplet,
      allowed: true,
    },
    {
      to: '/blood-safety/laboratory',
      label: 'Laboratory Screening',
      icon: FlaskConical,
      allowed: currentRole.id !== 'donor' && currentRole.id !== 'hospital',
    },
    {
      to: '/blood-safety/quarantine',
      label: 'Quarantine & Release',
      icon: Lock,
      allowed: currentRole.id !== 'donor',
    },
    {
      to: '/blood-safety/clinical-review',
      label: 'Clinical Review',
      icon: Stethoscope,
      allowed: currentRole.id !== 'donor' && currentRole.id !== 'hospital',
    },
    {
      to: '/blood-safety/follow-up',
      label: 'Confidential Follow-Up',
      icon: HeartHandshake,
      allowed: currentRole.id !== 'donor' && currentRole.id !== 'hospital',
    },
    {
      to: '/blood-safety/audit-logs',
      label: 'Audit Logs',
      icon: FileText,
      allowed: currentRole.id === 'administrator' || currentRole.id === 'clinical_reviewer',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-soft mb-8 overflow-hidden">
      <div className="overflow-x-auto">
        <nav className="flex items-center gap-1 p-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (!item.allowed) return null;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#DC2626] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
