import React, { createContext, useContext, useState, useMemo } from 'react';
import { SAFETY_ROLES } from '../data/bloodSafetyData';

const SafetyAuthContext = createContext(null);

export const SafetyAuthProvider = ({ children }) => {
  // Default demonstration role: Transfusion Medical Officer (Clinical Reviewer)
  // allows full visibility into medical reviews, release approvals, and clinical safeguards.
  const [activeRoleId, setActiveRoleId] = useState('clinical_reviewer');

  const currentRole = useMemo(() => {
    return SAFETY_ROLES.find((r) => r.id === activeRoleId) || SAFETY_ROLES[0];
  }, [activeRoleId]);

  const currentUser = useMemo(() => {
    switch (activeRoleId) {
      case 'clinical_reviewer':
        return {
          id: 'USR-MED-01',
          name: 'Dr. K. S. Deshmukh',
          title: 'Transfusion Medical Officer (TMO)',
          credentials: 'MD (Transfusion Medicine)',
          facility: 'Central Municipal Blood Centre',
          role: 'clinical_reviewer',
        };
      case 'lab_staff':
        return {
          id: 'USR-LAB-04',
          name: 'R. Kulkarni',
          title: 'Senior Laboratory Technologist',
          credentials: 'B.Sc, MLT',
          facility: 'Central Blood Testing Serology Lab',
          role: 'lab_staff',
        };
      case 'blood_bank':
        return {
          id: 'USR-BB-02',
          name: 'Nurse S. Gaikwad',
          title: 'Blood Bank Phlebotomy Supervisor',
          credentials: 'RN, B.Sc Nursing',
          facility: 'Central Municipal Blood Centre',
          role: 'blood_bank',
        };
      case 'administrator':
        return {
          id: 'USR-ADM-09',
          name: 'A. Singhania',
          title: 'Blood Centre Quality & Regulatory Administrator',
          credentials: 'MHA (Hospital Admin)',
          facility: 'State Blood Transfusion Governance Board',
          role: 'administrator',
        };
      case 'donor':
        return {
          id: 'dnr-001',
          name: 'Dr. Ananya Sharma',
          title: 'Volunteer Donor Profile',
          credentials: 'Self (Private View)',
          facility: 'Registered Citizen Account',
          role: 'donor',
        };
      case 'hospital':
        return {
          id: 'USR-HOSP-12',
          name: 'Dr. P. Varma',
          title: 'Hospital Emergency Desk Coordinator',
          credentials: 'MD (Emergency Medicine)',
          facility: 'City Trauma Care Hospital',
          role: 'hospital',
        };
      default:
        return {
          id: 'USR-GUEST',
          name: 'Demonstration User',
          title: 'Healthcare Observer',
          credentials: '',
          facility: 'MediConnect Simulation Platform',
          role: activeRoleId,
        };
    }
  }, [activeRoleId]);

  const setRole = (roleId) => {
    if (SAFETY_ROLES.some((r) => r.id === roleId)) {
      setActiveRoleId(roleId);
    }
  };

  const hasPermission = (permissionKey) => {
    return !!currentRole[permissionKey];
  };

  return (
    <SafetyAuthContext.Provider
      value={{
        currentRole,
        currentUser,
        activeRoleId,
        setRole,
        hasPermission,
        availableRoles: SAFETY_ROLES,
      }}
    >
      {children}
    </SafetyAuthContext.Provider>
  );
};

export const useSafetyAuth = () => {
  const context = useContext(SafetyAuthContext);
  if (!context) {
    throw new Error('useSafetyAuth must be used within a SafetyAuthProvider');
  }
  return context;
};
