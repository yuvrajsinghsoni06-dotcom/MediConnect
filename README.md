# MediConnect — Intelligent Emergency Blood Donation and Healthcare Coordination Platform
## Stage 1: Project Foundation & Modern Healthcare UI

MediConnect is a university capstone project engineered to streamline emergency blood coordination between volunteer blood donors, patient families, hospitals, accredited blood banks, and community NGOs.

This repository contains **Stage 1: Frontend Foundation**, establishing the design system, responsive navigation, reusable component architecture, mock data pipelines, and public & authentication routes.

---

## 1. Tech Stack (Stage 1)

- **Framework**: React.js (v18.3.1)
- **Bundler & Tooling**: Vite 6
- **Styling**: Tailwind CSS v3 with customized healthcare color palette
- **Routing**: React Router DOM (v6.28.1)
- **Icons**: Lucide React
- **Form State & Validation**: React Hook Form with Zod schemas & resolvers
- **HTTP Client (Integration-Ready)**: Axios instance with request/response interceptors
- **Dashboards & Maps (Stage 2 Prepared)**: Recharts, Leaflet, and React-Leaflet

---

## 2. Design System & Theme Colors

MediConnect implements a clean, accessible, modern healthcare dashboard aesthetic:

- **Primary Red**: `#DC2626` (used selectively for emergency actions and primary buttons)
- **Dark Red**: `#991B1B` (urgent banners and headers)
- **Light Red**: `#FEE2E2` (pills, badges, and subtle highlights)
- **Background**: `#F8FAFC` (soft slate healthcare canvas)
- **Primary Text**: `#0F172A` (deep slate)
- **Secondary Text**: `#64748B` (muted slate)
- **Border**: `#E2E8F0`
- **Success**: `#16A34A` (availability and confirmations)
- **Warning**: `#F59E0B` (medium-urgency indicators)

---

## 3. Directory Architecture

```
src/
├── assets/                  # Logos and static media
├── components/
│   ├── common/              # Domain-specific components
│   │   ├── CampaignCard.jsx
│   │   ├── DonorCard.jsx
│   │   ├── EmergencyNoticeBanner.jsx
│   │   ├── EmergencyRequestModal.jsx
│   │   └── StatisticsCard.jsx
│   ├── layout/              # Layout structural pieces
│   │   └── Footer.jsx
│   ├── navigation/          # Navbars and menus
│   │   └── Navbar.jsx
│   └── ui/                  # Generic atomic design components
│       ├── Badge.jsx
│       ├── BloodGroupBadge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── EmptyState.jsx
│       ├── ErrorState.jsx
│       ├── FormField.jsx
│       ├── Input.jsx
│       ├── LoadingSpinner.jsx
│       ├── Modal.jsx
│       ├── SectionHeading.jsx
│       └── Select.jsx
├── data/                    # Structured mock datasets (ready for API replacement)
│   ├── bloodGroupsData.js   # 8 ABO/Rh groups and compatibility facts
│   ├── campaignsData.js     # 6 sample donation drives
│   ├── donorsData.js        # 14 sample donors (privacy-safe: no raw phone/addresses)
│   ├── faqsData.js          # Platform and medical knowledge base
│   ├── statsData.js         # Illustrative impact metrics
│   └── testimonialsData.js  # Illustrative user narratives
├── layouts/
│   └── AppLayout.jsx        # Sticky header, outlet, and footer wrapper
├── pages/
│   ├── auth/                # Frontend authentication demonstrations
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   └── public/              # Publicly accessible routes
│       ├── AboutPage.jsx
│       ├── CampaignsPage.jsx
│       ├── ContactPage.jsx
│       ├── FindDonorsPage.jsx
│       ├── HomePage.jsx
│       └── NotFoundPage.jsx
├── routes/
│   └── AppRoutes.jsx        # React Router DOM configuration
├── services/                # API communication layer
│   ├── api.js               # Centralized Axios client instance
│   ├── campaignService.js   # Campaign data resolution
│   └── donorService.js      # Donor query & radius filtering
├── styles/
│   └── index.css            # Tailwind directives and custom scrollbars
├── utils/
│   └── constants.js         # Roles, blood types, cities, and demo flags
├── App.jsx
└── main.jsx
```

---

## 4. Key Implemented Pages & Features

### A. Home Page (`/`)
1. **Hero Section**:
   - Headline: *"Every Second Counts. Every Donation Matters."*
   - Supporting narrative and primary CTAs (*"Request Blood"*, *"Become a Donor"*).
   - Interactive live dispatch radar card mockup with pulsing urgency badges and donor preview cards.
2. **Impact Statistics**:
   - Clearly labeled demo metrics (*14,850+ Donors, 128 Hospitals, 3,420+ Requests Fulfilled, 42 Campaigns*).
3. **How MediConnect Works**:
   - 4-step structured protocol (*Register Profile -> Find or Broadcast -> Coordinate Match -> Complete Donation*).
4. **Main Services**:
   - Emergency Blood Requests, Intelligent Donor Discovery, Blood Bank Coordination, Community Drives.
5. **Blood Group Educational Matrix**:
   - Interactive blood group tabs (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) displaying red cell donor/recipient compatibility rules and medical disclaimer.
6. **Emergency CTA Section**:
   - High-contrast emergency banner with instant request dispatch trigger.
7. **Recent Campaigns Preview**:
   - Cards showing upcoming drives with progress bars and location.
8. **Testimonials**:
   - Illustrative community narratives labeled as demo content.

### B. Find Donors (`/find-donors`)
- Filter by **Blood Group** (`A+`, `B+`, `O-`, etc.), **City**, **Availability** (*Available Now*, *Within 24 Hours*), and **Approximate Distance Radius** (slider from 2 km to 25 km).
- Search by donor name, municipal area, or city.
- Donor cards showing **BloodGroupBadge**, verified status, approximate distance, readiness score, and lifetime donation counter.
- **Privacy Protection**: Does NOT expose private phone numbers or exact residential addresses.
- **Interactive "View Profile" Modal**: Simulates sending a secure coordination ping to the donor without revealing contact details.
- Prominent **Preliminary Matching & Medical Safety Notice**.

### C. Campaigns Page (`/campaigns`)
- Listing of scheduled community donation drives with date, venue, organizer badge, target units progress bar, and category.
- Search and municipal filter controls.
- Interactive **"Register as Donor"** modal with pre-donation checklist and slot reservation simulation.
- **"Host / Suggest a Camp"** modal for community organizers.

### D. About Page (`/about`)
- Mission and vision statements.
- Healthcare challenge & problem statement (golden hour delays, privacy leaks, inventory fragmentation).
- How MediConnect helps.
- Breakdown of the 5 platform user groups (*Donors, Patient Reps, Hospitals, Blood Banks, NGOs*).
- Privacy, safety, and non-commercial clinical governance principles.

### E. Contact Page (`/contact`)
- Interactive validated contact form using **React Hook Form + Zod** (*Full Name, Email, Subject, Message*).
- Frontend demonstration submission confirmation state.
- Demo contact coordinates (helpline, emergency desk, address).
- Interactive **Accordion FAQ Section** categorized by General, Donors, Safety & Privacy, and Emergency.

### F. Authentication Demonstration UI
- **Login (`/login`)**: Email, password with show/hide toggle, remember me checkbox, validation, demo autofill presets for Donor/Hospital/Blood Bank roles.
- **Register (`/register`)**: Full name, email, phone number, city, role selector (5 roles), password strength requirements, password confirmation, terms acceptance checkbox.
- **Forgot Password (`/forgot-password`)**: Email reset link dispatch simulation with return link.
- **404 Not Found (`*`)**: Professional error screen with links back to Home and Donor Discovery.

---

## 5. Medical Safety & Privacy Principles

- **No Public Contact Leaks**: In accordance with healthcare data protection principles, personal phone numbers and home addresses are never published. Coordination is facilitated through platform relays.
- **Clinical Precedence**: Displayed matches are preliminary coordination indicators. Final ABO/Rh cross-matching, infectious screening, and transfusion authorization remain strictly under qualified hospital laboratory staff.
- **Demo Disclaimers**: All sample statistics, campaigns, donors, and testimonials are clearly labeled as illustrative mock data.

---

## 6. How to Run the Application

```bash
# Install dependencies (already completed)
npm install

# Start local Vite development server
npm run dev

# Run production build
npm run build

# Preview production build
npm run preview
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Stage 2 Integration Readiness

The frontend has been built with clean separation of concerns for future backend integration:
- `src/services/api.js`: Pre-configured Axios instance with base URL environment variable and interceptors ready for JWT tokens.
- `src/services/donorService.js` and `campaignService.js`: Service wrappers simulating async REST API calls with promises; can be swapped directly for `api.get('/donors')` endpoints.
- No `localStorage`, `sessionStorage`, or fake mock databases are used as permanent storage, ensuring a clean transition to **Node.js, Express.js, and MySQL** in subsequent stages.
#   M e d i C o n n e c t  
 