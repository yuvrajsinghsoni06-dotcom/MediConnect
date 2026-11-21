import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Target,
  Eye,
  AlertTriangle,
  CheckCircle,
  Users,
  Building2,
  ShieldCheck,
  Lock,
  ArrowRight,
  HandHeart,
  Stethoscope,
  Clock
} from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PLATFORM_ROLES } from '../../utils/constants';

export const AboutPage = () => {
  const problems = [
    {
      title: 'Critical Golden-Hour Delays',
      desc: 'Trauma, surgical, and postpartum hemorrhage cases frequently suffer fatal delays while family members frantically call unverified contacts.',
      icon: Clock,
    },
    {
      title: 'Donor Contact Privacy Violations',
      desc: 'Well-intentioned blood requests on social media expose donors’ private phone numbers to spam, fraud, and unwanted solicitation.',
      icon: Lock,
    },
    {
      title: 'Fragmented Blood Bank Inventories',
      desc: 'Hospital blood banks often lack centralized visibility into reserve levels at neighboring facilities, leading to localized stockouts alongside preventable wastage.',
      icon: AlertTriangle,
    },
  ];

  const solutions = [
    {
      title: 'Radius-Based Intelligent Matching',
      desc: 'Our coordinate system pinpoints active, eligible volunteer donors within the closest travel radius of the requesting trauma care unit.',
      icon: Target,
    },
    {
      title: 'Privacy-Preserving Contact Relays',
      desc: 'Donors receive authenticated emergency alerts without their private mobile numbers, residential addresses, or personal records ever being displayed publicly.',
      icon: ShieldCheck,
    },
    {
      title: 'Inter-Facility Inventory Visibility',
      desc: 'Equips accredited blood banks and hospitals with common protocols to track component shortages, platelet shelf-lives, and transfers.',
      icon: Building2,
    },
  ];

  return (
    <div className="w-full py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* 1. Header Banner & Platform Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-xs font-bold text-[#DC2626] border border-red-200">
            About MediConnect • Stage 1 Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Bridging the Critical Gap in Emergency Blood Logistics
          </h1>
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            MediConnect is an academic DBMS capstone project designed to transform voluntary blood donation from chaotic social media distress posts into an intelligent, secure, and privacy-first healthcare coordination platform.
          </p>
        </div>

        {/* 2. Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 border border-red-100 bg-gradient-to-br from-white to-red-50/30 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-[#DC2626] flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Our Mission</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              To eliminate preventable deaths caused by blood shortages and logistical delays by providing hospitals, patient representatives, and voluntary donors with an ethical, automated, and privacy-respecting emergency coordination bridge.
            </p>
          </Card>

          <Card className="p-8 border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Our Vision</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              A healthcare ecosystem where no patient family ever has to scramble alone for blood in critical moments, and where community volunteer donors can safely and reliably contribute to saving lives in their immediate vicinity.
            </p>
          </Card>
        </div>

        {/* 3. Problem Statement & How We Help */}
        <div className="space-y-12">
          <SectionHeading
            eyebrow="The Healthcare Challenge"
            title="The Problem We Are Solving"
            description="Blood emergency coordination in many urban sectors is hampered by severe communication fragmentation."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((prob, idx) => {
              const Icon = prob.icon;
              return (
                <Card key={idx} className="p-6 border border-slate-200 bg-white">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-2">{prob.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{prob.desc}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-soft">
            <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              <span>How MediConnect Delivers Measurable Relief</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {solutions.map((sol, idx) => {
                const Icon = sol.icon;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                      <Icon className="w-4 h-4 text-[#16A34A]" />
                      <span>{sol.title}</span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">{sol.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Main User Groups / Roles */}
        <div className="space-y-12">
          <SectionHeading
            eyebrow="Role-Based Ecosystem"
            title="Designed for Every Healthcare Stakeholder"
            description="MediConnect accommodates five specialized user roles, each equipped with tailored workflows in later stages."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_ROLES.map((role) => (
              <Card key={role.id} hoverEffect className="p-6 border border-[#E2E8F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                      Role Profile
                    </span>
                    <Badge variant="slate" size="sm">
                      Stage 1 Ready
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{role.label}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{role.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#DC2626]">
                  <span>Registration Available</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            ))}

            {/* Explanatory Stage Card */}
            <Card className="p-6 border border-dashed border-red-300 bg-red-50/40 flex flex-col justify-center items-center text-center">
              <HandHeart className="w-10 h-10 text-[#DC2626] mb-3" />
              <h3 className="text-base font-bold text-[#0F172A]">Multi-Role Ready</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-xs">
                In Stage 2, each role gains personalized role-based authentication and secure role-restricted dashboards.
              </p>
            </Card>
          </div>
        </div>

        {/* 5. Privacy, Ethics & Clinical Safety Principles */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Governance & Safety Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Our Privacy & Medical Principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              As a healthcare coordination tool, patient confidentiality, donor dignity, and strict adherence to clinical standards are our highest priorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">No Public Contact Sharing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Donor phone numbers, residential addresses, and exact geolocation coordinates are encrypted and never shown publicly on the web.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Clinical Precedence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform suggestions are logistical guides. Medical testing, antibody crossmatching, and blood draw authorization remain strictly under certified hospital physicians.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Non-Commercial Ethics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In compliance with World Health Organization (WHO) and National Blood Transfusion Council regulations, blood donation is strictly voluntary and non-remunerated.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 text-xs text-slate-400">
            <span>Academic Capstone Demonstration • Stage 1 Foundation</span>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Join the Network Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
