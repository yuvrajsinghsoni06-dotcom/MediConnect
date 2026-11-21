import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Stethoscope,
  ClipboardCheck,
  Building,
  Calendar,
  Clock,
  HeartHandshake,
  FileText,
  User,
  Scale
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge } from '../../components/ui/BloodGroupBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { DispositionBadge } from '../../components/bloodSafety/DispositionBadge';
import { ScreeningTestBadge } from '../../components/bloodSafety/ScreeningTestBadge';
import { OutcomeBadge } from '../../components/bloodSafety/OutcomeBadge';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const DonationDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentRole, currentUser, hasPermission } = useSafetyAuth();

  useEffect(() => {
    loadDonationDetails();
  }, [id]);

  const loadDonationDetails = async () => {
    setIsLoading(true);
    try {
      const res = await bloodSafetyService.getDonationById(id);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRelease = async () => {
    setIsUpdating(true);
    setActionMessage(null);
    try {
      await bloodSafetyService.updateUnitDisposition(
        id,
        'Approved for release',
        'All statutory screening assays non-reactive and medically certified for transfusion.',
        { name: currentUser.name, role: currentRole.id }
      );
      setActionMessage({ type: 'success', text: 'Blood unit successfully certified and approved for release!' });
      loadDonationDetails();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuarantine = async () => {
    setIsUpdating(true);
    setActionMessage(null);
    try {
      await bloodSafetyService.updateUnitDisposition(
        id,
        'Quarantined',
        'Quarantine bio-lock engaged by clinical review order.',
        { name: currentUser.name, role: currentRole.id }
      );
      setActionMessage({ type: 'success', text: 'Blood unit moved to quarantine status.' });
      loadDonationDetails();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message={`Loading clinical records for donation ${id}...`} className="py-24" />;
  }

  if (!data || !data.donation) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Donation Record Not Found</h2>
        <Link to="/blood-safety/donations" className="mt-4 inline-block">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>Back to Donations</Button>
        </Link>
      </div>
    );
  }

  const { donation, assessment, tests, clinicalReview, followUp, releaseAudit } = data;
  const canRelease = hasPermission('canApproveRelease');

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <Link
              to="/blood-safety/donations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Donation Records</span>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Donation Record: <span className="font-mono text-[#DC2626]">{donation.donationId}</span>
              </h1>
              <BloodGroupBadge group={donation.bloodGroup} size="lg" />
              <DispositionBadge status={donation.dispositionStatus} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unit Barcode: <span className="font-mono font-semibold text-slate-700">{donation.unitBarCode}</span> • Sample Reference: <span className="font-mono font-semibold text-slate-700">{donation.sampleReference}</span>
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block">Collection Facility</span>
            <strong className="text-slate-900 block">{donation.bloodCentreName}</strong>
            <span className="text-slate-500">{new Date(donation.collectionDateTime).toLocaleString()}</span>
          </div>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Action Message Alert */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-red-50 text-red-900 border border-red-300'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <div className="space-y-1">
              <p>{actionMessage.text}</p>
            </div>
          </div>
        )}

        {/* Main Grid: Left (Clinical Details) and Right (Unit Disposition Engine) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Pre-Donation Assessment + Lab Testing Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Pre-Donation Clinical Health Assessment */}
            <Card className="p-5 sm:p-6 border border-[#E2E8F0] bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-[#DC2626]" />
                  <h2 className="text-base font-bold text-[#0F172A]">
                    Phase 1: Pre-Donation Clinical Assessment
                  </h2>
                </div>
                {assessment ? (
                  <OutcomeBadge outcome={assessment.outcome} size="sm" />
                ) : (
                  <span className="text-xs text-slate-400">Not recorded</span>
                )}
              </div>

              {assessment ? (
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Donor Reference</span>
                      <strong className="text-slate-900 font-mono">{assessment.donorRefId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Body Weight</span>
                      <strong className="text-slate-900">{assessment.weightKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Haemoglobin</span>
                      <strong className="text-slate-900">{assessment.haemoglobinGdl} g/dL</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
                      <strong className="text-slate-900">{assessment.bloodPressure}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-100 bg-white">
                    <strong className="text-slate-800 block mb-1">Assessor Clinical Observations:</strong>
                    <p className="text-slate-600 leading-relaxed">{assessment.assessorNotes}</p>
                    <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5">
                      <span>Assessed by: {assessment.assessingOfficer}</span>
                      <span>Date: {new Date(assessment.assessmentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No pre-donation assessment linked to this unit.</p>
              )}
            </Card>

            {/* 2. Mandatory Laboratory Infection Screening Results */}
            <Card className="p-5 sm:p-6 border border-[#E2E8F0] bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#DC2626]" />
                  <h2 className="text-base font-bold text-[#0F172A]">
                    Phase 3: Statutory Infection Screening Results
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {tests.length} Assays Configured
                </span>
              </div>

              <div className="space-y-3">
                {tests.map((test) => (
                  <div
                    key={test.testId}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800">{test.testCode}</span>
                          <span className="font-semibold text-slate-900">{test.testName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Sample ID: {test.sampleReference} • Lab Ref: {test.laboratoryReference}
                        </span>
                      </div>
                      <ScreeningTestBadge status={test.resultStatus} size="sm" />
                    </div>

                    <div className="p-2 rounded bg-white border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Optical Density / Ratio:</span>{' '}
                        <strong className="text-slate-800">{test.opticalDensityRatio}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Report Ref:</span>{' '}
                        <span className="font-mono text-slate-700">{test.reportReference}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                      <span>Entered by: {test.enteredBy || 'Pending'}</span>
                      <span>Verified by: {test.reviewedBy || 'Pending Clinical Verification'}</span>
                      {test.reviewTimestamp && (
                        <span>Verified: {new Date(test.reviewTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 3. Clinical Review & Confirmatory Decisions (if applicable) */}
            {clinicalReview && (
              <Card className="p-5 sm:p-6 border-2 border-slate-300 bg-slate-50/50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-slate-800" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Phase 4: Confirmatory Clinical Review Record
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600">
                    {clinicalReview.reviewId}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Initial Screening Trigger</span>
                    <strong className="text-slate-900">{clinicalReview.initialScreeningSummary}</strong>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Confirmatory Protocol Status</span>
                      <strong className="text-slate-900">{clinicalReview.confirmatoryStatus}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Clinical Decision</span>
                      <strong className="text-slate-900">{clinicalReview.clinicalDecision}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Medical Officer Clinical Notes</span>
                    <p className="text-slate-600 leading-relaxed">{clinicalReview.clinicalNotes}</p>
                    <div className="mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                      <span>Reviewed by: {clinicalReview.reviewerName} ({clinicalReview.reviewerTitle})</span>
                      <span>{new Date(clinicalReview.reviewDateTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column (4 cols): Release Prerequisite Verification Engine */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Clinical Release Audit Engine Card */}
            <Card className="p-5 border-2 border-slate-300 bg-white shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#DC2626]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Unit Release Safety Audit
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    releaseAudit.canRelease
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {releaseAudit.canRelease ? 'Safe for Release' : 'Release Prohibited'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Before any blood component is issued for transfusion, all 6 mandatory statutory checkpoints must be met on this specific unit sample:
              </p>

              {/* Checklist */}
              <div className="space-y-2 text-xs">
                {releaseAudit.reasons.length === 0 ? (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All Clinical Safety Criteria Verified</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Pre-donation assessment is accepted, and all 5 mandatory infection screening tests are verified non-reactive on this unit.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-red-50/80 border border-red-200 text-red-950 space-y-2">
                    <strong className="block text-red-900 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Unmet Safety Checkpoints ({releaseAudit.reasons.length}):</span>
                    </strong>
                    <ul className="space-y-1 text-[11px] list-disc pl-4 text-red-900">
                      {releaseAudit.reasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Disposition Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-[#16A34A] hover:bg-emerald-700"
                  disabled={!releaseAudit.canRelease || !canRelease || isUpdating || donation.dispositionStatus === 'Approved for release'}
                  onClick={handleApproveRelease}
                  icon={CheckCircle2}
                >
                  {donation.dispositionStatus === 'Approved for release'
                    ? 'Unit Already Certified & Released'
                    : canRelease
                    ? 'Authorize Unit Release for Transfusion'
                    : 'Release Authorization (TMO Only)'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-700 border-red-300 hover:bg-red-50"
                  disabled={!canRelease || isUpdating || donation.dispositionStatus === 'Quarantined'}
                  onClick={handleQuarantine}
                  icon={Lock}
                >
                  Enforce Bio-Hazard Quarantine Lock
                </Button>

                {!canRelease && (
                  <p className="text-[11px] text-slate-400 text-center italic">
                    Current active persona ({currentRole.name}) cannot authorize blood unit release. Switch to Transfusion Medical Officer (Clinical Reviewer) to test release sign-off.
                  </p>
                )}
              </div>
            </Card>

            {/* Confidential Donor Notification (Restricted View) */}
            {donation.hasConfidentialFlag && (
              <Card className="p-5 border-2 border-purple-200 bg-purple-50/50 space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4 text-purple-700" />
                  <span>Confidential Donor Health Follow-Up</span>
                </div>

                <p className="text-xs text-purple-950 leading-relaxed">
                  Infection screening reactivity requires confidential medical outreach, confirmatory follow-up, and non-stigmatizing donor counselling.
                </p>

                {followUp ? (
                  <div className="p-3 bg-white rounded-lg border border-purple-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <strong className="text-purple-900">{followUp.completionStatus}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Appointment Ref:</span>
                      <span className="font-mono font-bold text-slate-700">{followUp.appointmentReference}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      Counsellor: {followUp.responsibleCounsellor}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Follow-up file initiated.</p>
                )}

                <Link to="/blood-safety/follow-up" className="block pt-1">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    View Confidential Follow-Up Registry
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        <RegulatoryDisclaimer />
      </div>
    </div>
  );
};
