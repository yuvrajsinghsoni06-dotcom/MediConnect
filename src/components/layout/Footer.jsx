import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { DEMO_CONTACT_INFO } from '../../utils/constants';
import { Modal } from '../ui/Modal';

export const Footer = () => {
  const [activePolicyModal, setActivePolicyModal] = useState(null);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shadow-md">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  Medi<span className="text-red-500">Connect</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Intelligent Emergency Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              MediConnect is an academic capstone platform designed to streamline emergency blood coordination between verified volunteer donors, patient families, hospitals, and blood banks.
            </p>

            {/* Academic & Demonstration notice */}
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-400 max-w-sm">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Capstone Academic Project</span>
              </div>
              <span>Developed for DBMS curriculum demonstration. Fictional demo data used for UI illustration.</span>
            </div>

            {/* Social Media Placeholders */}
            <div className="pt-2 flex items-center gap-3">
              {['Twitter', 'LinkedIn', 'GitHub', 'Instagram'].map((network) => (
                <span
                  key={network}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                  title={`${network} Placeholder`}
                >
                  {network[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <Link to="/find-donors" className="hover:text-white transition-colors">
                  Find Donors
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-white transition-colors">
                  Donation Campaigns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register as Donor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-slate-200 transition-colors">
                Emergency Blood Request
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Donor Radius Discovery
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Blood Group Compatibility
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Blood Bank Registry (Stage 2)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                Community Drives & Camps
              </li>
            </ul>
          </div>

          {/* Col 5: Demo Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white flex items-center gap-1.5">
              <span>Demo Desk</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                Demo
              </span>
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-semibold">{DEMO_CONTACT_INFO.helpline}</span>
                  <span className="text-[10px] text-slate-500">Helpline (Demonstration)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{DEMO_CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-snug">{DEMO_CONTACT_INFO.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} MediConnect Platform. Academic Capstone Project. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActivePolicyModal('medical')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Medical Disclaimer
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Policy Modals */}
      <Modal
        isOpen={activePolicyModal !== null}
        onClose={() => setActivePolicyModal(null)}
        title={
          activePolicyModal === 'privacy'
            ? 'Privacy & Donor Protection Policy'
            : activePolicyModal === 'terms'
            ? 'Platform Terms of Use'
            : 'Medical & Transfusion Safety Disclaimer'
        }
        subtitle="Stage 1 Academic Governance Statement"
      >
        <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
          {activePolicyModal === 'privacy' && (
            <>
              <p>
                <strong>Privacy-by-Design:</strong> MediConnect is engineered around donor dignity and security. Public searches never expose donor mobile numbers, residential addresses, or direct contact identifiers.
              </p>
              <p>
                Coordination pings are relayed through secure system endpoints so donors can choose when and if to accept an emergency request without unwanted spam.
              </p>
            </>
          )}

          {activePolicyModal === 'terms' && (
            <>
              <p>
                <strong>Voluntary Academic Platform:</strong> This software is an educational prototype developed for DBMS coursework. It does not replace 911/112 emergency municipal services.
              </p>
              <p>
                Users agree that all registrations and coordinate broadcasts represent voluntary non-commercial human solidarity.
              </p>
            </>
          )}

          {activePolicyModal === 'medical' && (
            <>
              <p>
                <strong>Critical Clinical Notice:</strong> MediConnect does not diagnose, test, or prescribe blood transfusions.
              </p>
              <p>
                All compatibility charts, readiness scores, and distance rankings are informational guides. Final ABO/Rh crossmatching, pathogen screening (HIV, Hepatitis B/C, Syphilis, Malaria), and hemoglobin threshold verification are solely the responsibility of licensed clinical phlebotomists and attending physicians.
              </p>
            </>
          )}
        </div>
      </Modal>
    </footer>
  );
};
