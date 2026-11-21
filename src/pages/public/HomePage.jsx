import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Droplet,
  Users,
  ShieldCheck,
  Building2,
  CalendarCheck,
  Search,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  PhoneCall,
  Activity,
  Award,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { BloodGroupBadge } from '../../components/ui/BloodGroupBadge';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { StatisticsCard } from '../../components/common/StatisticsCard';
import { CampaignCard } from '../../components/common/CampaignCard';
import { EmergencyRequestModal } from '../../components/common/EmergencyRequestModal';
import { mockStats, platformFeatures } from '../../data/statsData';
import { bloodGroupsData } from '../../data/bloodGroupsData';
import { mockCampaigns } from '../../data/campaignsData';
import { mockTestimonials } from '../../data/testimonialsData';

export const HomePage = () => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(bloodGroupsData[0]);
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'Register Profile',
      desc: 'Donors, patients, or hospital admins create a verified profile specifying blood group and location radius.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Find or Broadcast',
      desc: 'Search our privacy-preserving donor database or broadcast a high-urgency distress alert to nearby units.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Coordinate Match',
      desc: 'Our intelligent routing system connects compatible donors to the hospital facility without exposing personal contact details.',
      icon: Activity,
    },
    {
      step: '04',
      title: 'Complete Donation',
      desc: 'The donor visits the verified hospital blood bank, completes medical screening, and saves up to three lives.',
      icon: Award,
    },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-red-50/40 via-white to-slate-50 border-b border-[#E2E8F0]">
        {/* Subtle decorative background blur blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-xs font-bold text-[#DC2626] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                <span>Intelligent Healthcare Blood Network • Stage 1</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Every Second Counts.{' '}
                <span className="text-[#DC2626] relative inline-block">
                  Every Donation
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-red-300 -z-10"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="transparent" />
                  </svg>
                </span>{' '}
                Matters.
              </h1>

              <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                MediConnect unites volunteer blood donors, patient families, and hospital emergency wings in real time. We replace frantic social media appeals with secure, privacy-first healthcare coordination.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="w-full sm:w-auto shadow-md shadow-red-600/20"
                  icon={AlertCircle}
                >
                  Request Blood
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto"
                  icon={Heart}
                >
                  Become a Donor
                </Button>

                <Link
                  to="/find-donors"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-[#DC2626] px-3 py-2 transition-colors"
                >
                  <span>Explore Donors</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="flex items-center gap-1 text-[#DC2626] font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Privacy First</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">No phone number exposure</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#16A34A] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Zero Cost</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">100% voluntary initiative</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-800 font-bold text-sm">
                    <Clock className="w-4 h-4 text-[#DC2626]" />
                    <span>Fast Radius</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">District-based matching</p>
                </div>
              </div>
            </div>

            {/* Right Column: Modern Healthcare UI Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Featured Mockup Card */}
                <div className="bg-white rounded-2xl p-6 shadow-soft-lg border border-[#E2E8F0] relative z-10 space-y-5">
                  {/* Live Dispatch Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-[#DC2626] animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Live Emergency Radar (Simulation)
                      </span>
                    </div>
                    <Badge variant="red" size="sm">
                      Urgent Alert
                    </Badge>
                  </div>

                  {/* Simulated Emergency Card */}
                  <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BloodGroupBadge group="O-" size="md" />
                        <div>
                          <div className="text-sm font-bold text-[#0F172A]">Universal Red Cells Needed</div>
                          <div className="text-xs text-slate-500">Trauma ICU • City Central Hospital</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#DC2626]">
                        2 Units
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#DC2626]" /> Required &lt; 2 hrs
                      </span>
                      <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                        4 Eligible Donors Nearby
                      </span>
                    </div>
                  </div>

                  {/* Donor Match Preview */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Nearby Registered Donors
                    </span>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <BloodGroupBadge group="O+" size="sm" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Dr. Ananya S.</div>
                          <div className="text-[11px] text-slate-500">3.2 km away • Andheri West</div>
                        </div>
                      </div>
                      <Badge variant="green" size="sm" dot>
                        Available
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <BloodGroupBadge group="O-" size="sm" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Kavita R. Iyer</div>
                          <div className="text-[11px] text-slate-500">6.8 km away • Powai</div>
                        </div>
                      </div>
                      <Badge variant="green" size="sm" dot>
                        Available
                      </Badge>
                    </div>
                  </div>

                  {/* Interactive Trigger in Visual */}
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full text-xs"
                    onClick={() => setIsEmergencyModalOpen(true)}
                  >
                    Test Emergency Dispatch Simulation
                  </Button>
                </div>

                {/* Floating Secondary Healthcare Badge */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-soft-lg border border-[#E2E8F0] z-20 items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Hospital Grade Flow</div>
                    <div className="text-[11px] text-slate-500">Preliminary match verification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATISTICS */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">
              Platform Capacity (Demonstration Stage 1)
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mt-1">
              Building Trust Through Coordinated Community Healthcare
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStats.map((stat) => (
              <StatisticsCard key={stat.id} {...stat} />
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            * All figures presented above are illustrative demonstration metrics for this capstone project.
          </p>
        </div>
      </section>

      {/* 3. HOW MEDICONNECT WORKS */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Workflow Protocol"
            title="How MediConnect Works"
            description="A streamlined four-step pipeline designed to minimize life-threatening delays between blood request and donor transfusion."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-soft relative flex flex-col justify-between group hover:border-[#DC2626]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-[#DC2626]/40 group-hover:text-[#DC2626] transition-colors">
                        {st.step}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">{st.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">{st.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#DC2626]">
                    <span>Stage Protocol</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MAIN SERVICES */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Capabilities"
            title="Platform Services"
            description="Specialized healthcare modules addressing every touchpoint of voluntary blood supply and emergency logistics."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformFeatures.map((svc) => (
              <Card
                key={svc.id}
                hoverEffect
                className="p-8 border border-[#E2E8F0] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="red" size="sm">
                      {svc.tag}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2.5">
                    {svc.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    {svc.shortDesc}
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {svc.fullDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Stage 1 Architecture</span>
                  {svc.id === 'emergency' ? (
                    <button
                      onClick={() => setIsEmergencyModalOpen(true)}
                      className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1"
                    >
                      <span>Trigger Demo Alert</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : svc.id === 'discovery' ? (
                    <Link
                      to="/find-donors"
                      className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1"
                    >
                      <span>Search Donors</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : svc.id === 'campaigns' ? (
                    <Link
                      to="/campaigns"
                      className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1"
                    >
                      <span>Browse Drives</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400">Scheduled for Stage 2</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BLOOD GROUP INFORMATION SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Educational Reference"
            title="Blood Group Compatibility & Facts"
            description="Understand ABO and Rh blood group distribution. Informational guide only; clinical cross-matching must be performed by certified laboratory staff."
          />

          {/* Blood group selector pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {bloodGroupsData.map((bg) => (
              <button
                key={bg.group}
                type="button"
                onClick={() => setSelectedBloodGroup(bg)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedBloodGroup.group === bg.group
                    ? 'bg-[#DC2626] text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-[#E2E8F0]'
                }`}
              >
                {bg.group}
              </button>
            ))}
          </div>

          {/* Active Blood Group Detail Display */}
          <Card className="p-6 sm:p-8 border border-[#E2E8F0] shadow-soft max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <BloodGroupBadge group={selectedBloodGroup.group} size="xl" />
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">
                    {selectedBloodGroup.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#DC2626] uppercase tracking-wide">
                    {selectedBloodGroup.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Demographic Share:</span>
                <Badge variant="blue" size="md">
                  {selectedBloodGroup.prevalence}
                </Badge>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedBloodGroup.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Can Donate Red Cells To:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBloodGroup.canDonateTo.map((target, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2 py-1 bg-white rounded border border-slate-200 text-slate-800"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Can Receive Red Cells From:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBloodGroup.canReceiveFrom.map((source, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2 py-1 bg-white rounded border border-slate-200 text-slate-800"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Disclaimer Callout */}
            <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Disclaimer:</strong> Transfusion rules contain specialized exceptions including antibody screens, CMV status, and subtyping. MediConnect does not independently authorize transfusions.
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. EMERGENCY CALL-TO-ACTION SECTION */}
      <section className="py-16 bg-[#991B1B] text-white relative overflow-hidden">
        {/* Decorative backdrop graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-950/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-800 text-red-200 text-xs font-bold tracking-wider uppercase border border-red-700">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            Immediate Dispatch Desk
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Facing an Immediate Blood Shortage?
          </h2>

          <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
            Hospitals, ICU departments, and family representatives can submit a verified distress signal to nearby active volunteer donors in minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-[#DC2626] font-extrabold hover:bg-white"
              icon={AlertCircle}
            >
              Request Blood Immediately
            </Button>

            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white/10"
                icon={PhoneCall}
              >
                Contact Emergency Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. RECENT CAMPAIGNS PREVIEW */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">
                Community Initiatives
              </span>
              <h2 className="text-3xl font-extrabold text-[#0F172A] mt-1">
                Upcoming Donation Camps
              </h2>
              <p className="text-sm text-[#64748B] mt-1.5">
                Join organized voluntary drives and mobile camps in your city.
              </p>
            </div>

            <Link to="/campaigns">
              <Button variant="secondary" size="sm" icon={CalendarCheck}>
                View All Campaigns
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCampaigns.slice(0, 3).map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Community Stories"
            title="Voices of Impact"
            description="Illustrative user experiences highlighting the human difference made by rapid blood coordination."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t) => (
              <Card key={t.id} className="p-6 border border-[#E2E8F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <BloodGroupBadge group={t.bloodGroupInvolved} size="sm" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Demo Profile
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                  <div className="text-[11px] text-[#DC2626] font-medium mt-0.5">{t.city}</div>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            * All testimonials above are fictional illustrative narratives demonstrating user perspectives in Stage 1.
          </p>
        </div>
      </section>

      {/* Modal for Emergency Blood Request */}
      <EmergencyRequestModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
};
