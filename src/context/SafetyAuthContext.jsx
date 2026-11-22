import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { SAFETY_ROLES } from '../data/bloodSafetyData';

const SafetyAuthContext = createContext(null);

export const ROLE_MAP = {
  admin: 'administrator',
  administrator: 'administrator',
  blood_bank_staff: 'blood_bank',
  blood_bank: 'blood_bank',
  lab_technician: 'lab_staff',
  lab_staff: 'lab_staff',
  clinical_reviewer: 'clinical_reviewer',
  donor: 'donor',
  hospital_coordinator: 'hospital',
  hospital: 'hospital',
};

function getStoredSession() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = window.localStorage.getItem('mediconnect_auth_token');
      const userStr = window.localStorage.getItem('mediconnect_user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        const mappedRole = ROLE_MAP[user.role] || 'donor';
        return {
          token,
          user,
          roleId: mappedRole,
          isAuthenticated: true,
          isDemoSimulation: false,
        };
      }
    }
  } catch (err) {
    console.warn('[SafetyAuth] Failed to restore session from localStorage:', err);
  }

  // Baseline default when unauthenticated: 'donor' (NOT clinical_reviewer)
  return {
    token: null,
    user: null,
    roleId: 'donor',
    isAuthenticated: false,
    isDemoSimulation: true,
  };
}

export const SafetyAuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);

  // Sync session on window focus or storage change
  useEffect(() => {
    const handleStorageChange = () => {
      setSession(getStoredSession());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeRoleId = session.roleId;

  const currentRole = useMemo(() => {
    return SAFETY_ROLES.find((r) => r.id === activeRoleId) || SAFETY_ROLES[0];
  }, [activeRoleId]);

  const currentUser = useMemo(() => {
    if (session.isAuthenticated && session.user) {
      return {
        id: session.user.userId || session.user.id || 'USR-AUTH',
        name: session.user.name || 'Authenticated User',
        email: session.user.email,
        title: session.user.department || currentRole.name,
        credentials: session.user.role ? `Role: ${session.user.role}` : 'Staff Verified',
        facility: session.user.department || 'MediConnect Healthcare Grid',
        role: session.roleId,
        backendRole: session.user.role,
        isAuthenticated: true,
      };
    }

    // Isolated demo simulation personas (used only when unauthenticated in demo mode)
    switch (activeRoleId) {
      case 'clinical_reviewer':
        return {
          id: 'USR-MED-01',
          name: 'Dr. K. S. Deshmukh',
          title: 'Transfusion Medical Officer (TMO)',
          credentials: 'MD (Transfusion Medicine)',
          facility: 'Central Municipal Blood Centre',
          role: 'clinical_reviewer',
          isAuthenticated: false,
        };
      case 'lab_staff':
        return {
          id: 'USR-LAB-04',
          name: 'R. Kulkarni',
          title: 'Senior Laboratory Technologist',
          credentials: 'B.Sc, MLT',
          facility: 'Central Blood Testing Serology Lab',
          role: 'lab_staff',
          isAuthenticated: false,
        };
      case 'blood_bank':
        return {
          id: 'USR-BB-02',
          name: 'Nurse S. Gaikwad',
          title: 'Blood Bank Phlebotomy Supervisor',
          credentials: 'RN, B.Sc Nursing',
          facility: 'Central Municipal Blood Centre',
          role: 'blood_bank',
          isAuthenticated: false,
        };
      case 'administrator':
        return {
          id: 'USR-ADM-09',
          name: 'A. Singhania',
          title: 'Blood Centre Quality & Regulatory Administrator',
          credentials: 'MHA (Hospital Admin)',
          facility: 'State Blood Transfusion Governance Board',
          role: 'administrator',
          isAuthenticated: false,
        };
      case 'hospital':
        return {
          id: 'USR-HOSP-12',
          name: 'Dr. P. Varma',
          title: 'Hospital Emergency Desk Coordinator',
          credentials: 'MD (Emergency Medicine)',
          facility: 'City Trauma Care Hospital',
          role: 'hospital',
          isAuthenticated: false,
        };
      case 'donor':
      default:
        return {
          id: 'dnr-001',
          name: 'Dr. Ananya Sharma',
          title: 'Volunteer Donor Profile',
          credentials: 'Self (Private View)',
          facility: 'Registered Citizen Account',
          role: 'donor',
          isAuthenticated: false,
        };
    }
  }, [session, activeRoleId, currentRole]);

  /**
   * Role Switcher:
   * STRICT SECURITY RULE: Authenticated accounts CANNOT alter their roles from the frontend.
   * Role switching is only permitted in isolated unauthenticated demonstration mode.
   */
  const setRole = (roleId) => {
    if (session.isAuthenticated) {
      console.warn('[SafetyAuth] Role switching is prohibited on authenticated sessions. Enforced by backend RBAC.');
      return false;
    }

    if (SAFETY_ROLES.some((r) => r.id === roleId)) {
      setSession((prev) => ({
        ...prev,
        roleId,
        isDemoSimulation: true,
      }));
      return true;
    }
    return false;
  };

  /**
   * Log in user with backend token & user record
   */
  const login = (token, user) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('mediconnect_auth_token', token);
        window.localStorage.setItem('mediconnect_user', JSON.stringify(user));
      }
    } catch (err) {
      console.error('[SafetyAuth] Failed to write session to localStorage:', err);
    }

    const mappedRole = ROLE_MAP[user.role] || 'donor';
    setSession({
      token,
      user,
      roleId: mappedRole,
      isAuthenticated: true,
      isDemoSimulation: false,
    });
  };

  /**
   * Log out user and clear session
   */
  const logout = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('mediconnect_auth_token');
        window.localStorage.removeItem('mediconnect_user');
      }
    } catch (err) {
      console.error('[SafetyAuth] Failed to clear session from localStorage:', err);
    }

    setSession({
      token: null,
      user: null,
      roleId: 'donor',
      isAuthenticated: false,
      isDemoSimulation: true,
    });
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
        isAuthenticated: session.isAuthenticated,
        isDemoSimulation: session.isDemoSimulation,
        setRole,
        login,
        logout,
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
    // Resilient fallback when component is rendered in isolation (e.g. unit tests)
    return {
      currentRole: SAFETY_ROLES[0],
      currentUser: { id: 'USR-GUEST', name: 'Guest User', role: 'donor', isAuthenticated: false },
      activeRoleId: 'donor',
      isAuthenticated: false,
      isDemoSimulation: true,
      setRole: () => false,
      login: (token, user) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('mediconnect_auth_token', token);
            window.localStorage.setItem('mediconnect_user', JSON.stringify(user));
          }
        } catch (err) {
          console.error(err);
        }
      },
      logout: () => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem('mediconnect_auth_token');
            window.localStorage.removeItem('mediconnect_user');
          }
        } catch (err) {
          console.error(err);
        }
      },
      hasPermission: () => false,
      availableRoles: SAFETY_ROLES,
    };
  }
  return context;
};
