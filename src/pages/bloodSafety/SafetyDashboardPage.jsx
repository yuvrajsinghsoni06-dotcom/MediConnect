import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  FlaskConical,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileText,
  Activity,
  HeartHandshake,
  Stethoscope
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge } from '../../components/ui/BloodGroupBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { DispositionBadge } from '../../components/bloodSafety/DispositionBadge';
import { ScreeningTestBadge } from '../../components/bloodSafety/ScreeningTestBadge';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const SafetyDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [catalogue, setCatalogue] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentRole } = useSafetyAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, catRes, donRes] = await Promise.all([
        bloodSafetyService.getScreeningStatistics(),
        bloodSafetyService.getTestCatalogue(),
        bloodSafetyService.getDonations(),
      ]);
      setStats(statsRes.data);
      setCatalogue(catRes.data);
      setRecentDonations(donRes.data);
    } catch (err) {
      console.error('Failed to load blood safety dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#991B1B] text-xs font-bold border border-red-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
              <span>Mandatory Transfusion Safety Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Blood Safety & Donor Health Verification
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              End-to-end clinical coordination: Donor assessment, infection screening, laboratory verification, quarantine bio-locks, and release authorization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/blood-safety/donor-assessment">
              <Button variant="primary" size="sm" icon={ClipboardCheck}>
                New Assessment
              </Button>
            </Link>
            <Link to="/blood-safety/quarantine">
              <Button variant="outline" size="sm" icon={Lock}>
                Quarantine Vault
              </Button>
            </Link>
          </div>
        </div>

        {/* Role Switcher Banner */}
        <SafetyRoleBanner />

        {/* Module Sub-Navigation */}
        <SafetyNavigation />

        {isLoading ? (
          <LoadingSpinner message="Loading blood safety surveillance metrics..." size="lg" />
        ) : (
          <>
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
              <Card className="p-4 border-l-4 border-l-slate-400 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Total Units</span>
                <div className="text-2xl font-black text-[#0F172A] mt-1">{stats?.donations.total || 0}</div>
                <span className="text-[10px] text-slate-400">Collected batches</span>
              </Card>

              <Card className="p-4 border-l-4 border-l-emerald-500 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Released</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{stats?.donations.approved || 0}</div>
                <span className="text-[10px] text-slate-400">100% Verified TTI-clear</span>
              </Card>

              <Card className="p-4 border-l-4 border-l-red-600 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 block">Quarantined</span>
                <div className="text-2xl font-black text-red-600 mt-1">{stats?.donations.quarantined || 0}</div>
                <span className="text-[10px] text-red-500 font-semibold">Strict Bio-Lock</span>
              </Card>

              <Card className="p-4 border-l-4 border-l-amber-500 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Investigation</span>
                <div className="text-2xl font-black text-amber-600 mt-1">{stats?.donations.underInvestigation || 0}</div>
                <span className="text-[10px] text-slate-400">Inconclusive repeat</span>
              </Card>

              <Card className="p-4 border-l-4 border-l-sky-500 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">Awaiting Tests</span>
                <div className="text-2xl font-black text-sky-600 mt-1">{stats?.donations.awaitingTesting || 0}</div>
                <span className="text-[10px] text-slate-400">Pending assay completion</span>
              </Card>

              <Card className="p-4 border-l-4 border-l-purple-500 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">Follow-Ups</span>
                <div className="text-2xl font-black text-purple-600 mt-1">{stats?.activeFollowUps || 0}</div>
                <span className="text-[10px] text-slate-400">Confidential cases</span>
              </Card>
            </div>

            {/* Quarantine & Safety Attention Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (8 cols): Units Requiring Clinical Attention */}
              <div className="lg:col-span-8 space-y-6">
                <Card className="p-6 border border-[#E2E8F0] bg-white">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
                      <h2 className="text-base font-bold text-[#0F172A]">
                        Current Blood Units Under Clinical Surveillance
                      </h2>
                    </div>
                    <span className="text-xs text-slate-500">
                      Auto-Quarantine Protocol Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recentDonations.map((item) => (
                      <div
                        key={item.donationId}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <BloodGroupBadge group={item.bloodGroup} size="sm" />
                            <span className="font-mono text-xs font-bold text-slate-800">
                              {item.donationId}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({item.bloodComponent})
                            </span>
                            <DispositionBadge status={item.dispositionStatus} size="sm" />
                          </div>
                          <p className="text-xs text-slate-600">
                            <strong>Reason:</strong> {item.dispositionReason}
                          </p>
                          <div className="text-[11px] text-slate-400">
                            Sample: {item.sampleReference} • {item.bloodCentreName}
                          </div>
                        </div>

                        <Link to={`/blood-safety/donation/${item.donationId}`} className="shrink-0">
                          <Button variant="outline" size="sm">
                            Inspect Lifecycle
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Statutory Test Catalogue Display */}
                <Card className="p-6 border border-[#E2E8F0] bg-white">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        Statutory Infection Screening Catalogue (India Standard)
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Mandatory under Drugs and Cosmetics Rules and National Blood Transfusion Council (NBTC) guidelines.
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      5/5 Mandatory
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catalogue.map((test) => (
                      <div
                        key={test.testCode}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-800">
                            {test.testCode}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              test.isRequired
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {test.isRequired ? 'Mandatory Assay' : 'Supplementary'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0F172A]">{test.testName}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{test.description}</p>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 flex justify-between">
                          <span>Specimen: {test.specimenType}</span>
                          <span>TAT: ~{test.standardTATMinutes} mins</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column (4 cols): Quick Safety Workflows & Rules */}
              <div className="lg:col-span-4 space-y-6">
                {/* Clinical Release Business Rule Card */}
                <Card className="p-5 border-2 border-red-200 bg-red-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                    <Lock className="w-4 h-4 text-[#DC2626]" />
                    <span>Unit Release Clinical Mandate</span>
                  </div>
                  <p className="text-xs text-red-950 leading-relaxed">
                    Under no circumstance can a blood unit be marked <strong>Approved for release</strong> unless:
                  </p>
                  <ul className="text-xs text-red-900 space-y-1.5 list-disc pl-4">
                    <li>Pre-donation assessment is clinically accepted.</li>
                    <li>Every statutory test is Non-Reactive on THIS specific donation.</li>
                    <li>No reactive, invalid, or inconclusive tests exist.</li>
                    <li>A licensed Transfusion Medical Officer (TMO) verifies and signs off.</li>
                  </ul>
                  <div className="pt-2 text-[11px] text-slate-500 font-medium">
                    Enforced at the service layer via <code className="text-red-700 font-bold">canApproveUnit()</code>.
                  </div>
                </Card>

                {/* Action Shortcuts */}
                <Card className="p-5 border border-[#E2E8F0] space-y-3">
                  <h3 className="text-sm font-bold text-[#0F172A]">Safety Module Navigation</h3>
                  <div className="space-y-2">
                    <Link
                      to="/blood-safety/donor-assessment"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-[#DC2626]" />
                        <span>Pre-Donation Assessment</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      to="/blood-safety/laboratory"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-[#DC2626]" />
                        <span>Laboratory Test Console</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      to="/blood-safety/quarantine"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#DC2626]" />
                        <span>Quarantine & Unit Release</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      to="/blood-safety/clinical-review"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[#DC2626]" />
                        <span>Confirmatory Clinical Review</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      to="/blood-safety/follow-up"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-[#DC2626]" />
                        <span>Confidential Donor Follow-Up</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      to="/blood-safety/audit-logs"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#DC2626]" />
                        <span>Regulatory Audit Trail</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom Regulatory Disclaimer */}
            <RegulatoryDisclaimer />
          </>
        )}
      </div>
    </div>
  );
};
