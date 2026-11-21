/**
 * MediConnect Platform Constants
 */

export const PLATFORM_ROLES = [
  { id: "donor", label: "Donor", description: "Volunteer individuals willing to donate blood or platelets" },
  { id: "patient_rep", label: "Patient Representative", description: "Family member or caregiver coordinating emergency requests" },
  { id: "hospital", label: "Hospital", description: "Licensed hospital, trauma center, or surgical department" },
  { id: "blood_bank", label: "Blood Bank", description: "Accredited blood storage and component processing facility" },
  { id: "ngo_volunteer", label: "NGO / Volunteer", description: "Humanitarian organizations and community campaign organizers" },
];

export const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

export const MAJOR_CITIES = [
  "All Cities",
  "Mumbai",
  "Bengaluru",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad"
];

export const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All Availabilities" },
  { value: "Available Now", label: "Available Now" },
  { value: "Within 24 Hours", label: "Within 24 Hours" }
];

export const DEMO_CONTACT_INFO = {
  helpline: "+91 (0) 22-5555-0199",
  emergencyTollFree: "1800-000-DEMO (24x7 Illustrative)",
  email: "support@demo-mediconnect.org",
  emergencyEmail: "emergency@demo-mediconnect.org",
  address: "MediConnect Health Innovation Wing, Academic Center, Mumbai 400001",
  disclaimer: "MediConnect is a university capstone project demonstration for DBMS. It is not an officially commissioned emergency dispatch service."
};
