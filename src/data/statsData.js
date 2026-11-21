/**
 * Impact Statistics for MediConnect (Stage 1 Demonstration Data)
 * 
 * NOTE: These figures are illustrative mock metrics intended solely for 
 * demonstrating platform capacity and dashboard visualizations in Stage 1.
 */

export const mockStats = [
  {
    id: "donors",
    label: "Registered Donors",
    value: "14,850+",
    numericValue: 14850,
    change: "+12% this month",
    description: "Verified volunteer donors registered across metropolitan zones",
    isDemo: true
  },
  {
    id: "hospitals",
    label: "Hospitals Connected",
    value: "128",
    numericValue: 128,
    change: "+6 joined recently",
    description: "Accredited healthcare centers & trauma response units",
    isDemo: true
  },
  {
    id: "requests",
    label: "Blood Requests Fulfilled",
    value: "3,420+",
    numericValue: 3420,
    change: "94.8% response rate",
    description: "Emergency units successfully coordinated with donor response",
    isDemo: true
  },
  {
    id: "campaigns",
    label: "Active Campaigns",
    value: "42",
    numericValue: 42,
    change: "Across 8 cities",
    description: "Community donation drives, college camps, and mobile vans",
    isDemo: true
  }
];

export const platformFeatures = [
  {
    id: "emergency",
    title: "Emergency Blood Requests",
    shortDesc: "Rapid distress broadcast system connecting urgent patient needs to verified local donors.",
    fullDesc: "Hospital representatives and verified relatives can trigger high-urgency notifications to eligible donors located within an optimal transit radius.",
    icon: "AlertCircle",
    tag: "High Priority"
  },
  {
    id: "discovery",
    title: "Intelligent Donor Discovery",
    shortDesc: "Privacy-preserving search filtering donors by blood group, availability, and approximate distance.",
    fullDesc: "Protecting donor privacy while facilitating quick matching. No private contact numbers are made public; coordination happens via secure platform relays.",
    icon: "Search",
    tag: "Smart Matching"
  },
  {
    id: "bloodbank",
    title: "Blood Bank Coordination",
    shortDesc: "Inventory tracking and inter-facility transfers to prevent regional stock-outs and wastage.",
    fullDesc: "Allows affiliated hospitals and blood centers to monitor reserve levels, request inter-bank transfers, and schedule replenishment batches.",
    icon: "Building2",
    tag: "Institutional"
  },
  {
    id: "campaigns",
    title: "Community Donation Campaigns",
    shortDesc: "Organize, publicize, and track participation in voluntary blood camps and mobile drives.",
    fullDesc: "Empowering NGOs, corporate CSR arms, and university chapters to manage donor registrations, venue logistics, and post-drive certifications.",
    icon: "CalendarCheck",
    tag: "Civic Action"
  }
];
