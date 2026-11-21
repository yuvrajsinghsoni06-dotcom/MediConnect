import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { mockClinicalReviews, mockDonationRecords } from '../../data/bloodSafetyData';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const ClinicalReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    donationId: 'DON-2026-0894',
    initialScreeningSummary: 'Inconclusive HIV-1/2 p24 ELISA optical density reading.',
    confirmatoryTestingRequired: true,
    confirmatoryStatus: 'In Progress (Western Blot & Molecular RNA NAT Requested)',
    clinicalDecision: 'Quarantine Under Investigation',
    dispositionSigned: 'Under investigation',
    clinicalNotes: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { currentRole, currentUser, hasPermission } = useSafetyAuth();

  useEffect(() => {
    setReviews([...mockClinicalReviews]);
    setIsLoading(false);
  }, []);

  const handleRecordReview = async (e) => {
    e.preventDefault();
    try {
      const res = await bloodSafetyService.recordClinicalReview(reviewFormData, {
        name: currentUser.name,
        role: currentRole.id,
      });

      setReviews((prev) => [res.data, ...prev]);
      setSubmitSuccess(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const canReview = hasPermission('canClinicalReview');

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Phase 4 • Confirmatory Testing & Medical Decision Ledger
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Confirmatory Testing & Clinical Review
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Formal physician oversight for flagged screening assays, duplicate verification, and biological safety sign-offs.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            disabled={!canReview}
            onClick={() => {
              setSubmitSuccess(false);
              setIsModalOpen(true);
            }}
          >
            {canReview ? 'Record Clinical Review Decision' : 'Review Restricted (TMO Only)'}
          </Button>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Clinical Protocol Statement */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-3">
          <Stethoscope className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Confirmatory Protocol Governance: </strong>
            <span>
              Initial screening assays prioritize sensitivity over specificity. An initial reactive or inconclusive finding requires duplicate re-testing and validated supplemental confirmatory methods (e.g. Western Blot for HIV, Neutralization / DNA NAT for Hepatitis B). A confirmed medical diagnosis is never made without formal sign-off by an authorized Transfusion Medical Officer.
            </span>
          </div>
        </div>

        {/* Clinical Review Cards */}
        {isLoading ? (
          <LoadingSpinner message="Retrieving clinical review records..." />
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <Card key={rev.reviewId} className="p-6 border border-[#E2E8F0] bg-white space-y-4 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-[#DC2626]">{rev.reviewId}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <Link
                      to={`/blood-safety/donation/${rev.donationId}`}
                      className="font-mono text-xs font-bold text-slate-800 hover:text-[#DC2626] hover:underline"
                    >
                      Donation: {rev.donationId}
                    </Link>
                  </div>
                  <div className="text-xs text-slate-500">
                    Reviewed: <strong>{new Date(rev.reviewDateTime).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Initial Trigger</span>
                    <strong className="text-slate-900 leading-snug block">{rev.initialScreeningSummary}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Confirmatory Status</span>
                    <strong className="text-slate-900 leading-snug block">{rev.confirmatoryStatus}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Clinical Determination</span>
                    <strong className="text-[#DC2626] font-bold leading-snug block">{rev.clinicalDecision}</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <strong className="text-slate-900 block mb-1">Transfusion Medical Officer Findings:</strong>
                  <p className="text-slate-600 leading-relaxed">{rev.clinicalNotes}</p>
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                    <span>Officer: <strong>{rev.reviewerName}</strong> ({rev.reviewerTitle})</span>
                    <span>Disposition Enforced: <strong>{rev.dispositionSigned}</strong></span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Record New Clinical Review Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Transfusion Medical Officer Confirmatory Review"
          subtitle="Formally sign off on confirmatory testing progress and final disposition"
          maxWidth="max-w-xl"
        >
          {submitSuccess ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Clinical Review Logged</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your medical decision and confirmatory testing orders have been permanently stamped to the regulatory audit log.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRecordReview} className="space-y-4 text-xs">
              <Select
                label="Target Blood Donation Reference"
                required
                value={reviewFormData.donationId}
                onChange={(e) => setReviewFormData({ ...reviewFormData, donationId: e.target.value })}
              >
                {mockDonationRecords.map((d) => (
                  <option key={d.donationId} value={d.donationId}>
                    {d.donationId} • {d.bloodComponent} ({d.dispositionStatus})
                  </option>
                ))}
              </Select>

              <Input
                label="Initial Screening Assay Trigger"
                required
                value={reviewFormData.initialScreeningSummary}
                onChange={(e) => setReviewFormData({ ...reviewFormData, initialScreeningSummary: e.target.value })}
              />

              <Input
                label="Confirmatory Testing Protocol Status"
                required
                placeholder="e.g. In Progress (Western Blot / Neutralization / DNA NAT)"
                value={reviewFormData.confirmatoryStatus}
                onChange={(e) => setReviewFormData({ ...reviewFormData, confirmatoryStatus: e.target.value })}
              />

              <div>
                <Select
                  label="Clinical Decision & Unit Action"
                  required
                  value={reviewFormData.clinicalDecision}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, clinicalDecision: e.target.value })}
                >
                  <option value="Quarantine Under Investigation">Quarantine Under Investigation (Hold)</option>
                  <option value="Permanent Quarantine / Pending Confirmation">Permanent Quarantine (Non-Conforming)</option>
                  <option value="Discard Approved (Confirmed TTI)">Discard Approved (Bio-Hazard Incineration)</option>
                  <option value="Release Approved (All Assays Non-Reactive)">Release Approved (Certified Negative)</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Physician Diagnostic Findings & Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record optical density values, supplemental lab references, counselling orders, and formal justification..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-[#DC2626]/20"
                  value={reviewFormData.clinicalNotes}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, clinicalNotes: e.target.value })}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Commit Review Decision
                </Button>
              </div>
            </form>
          )}
        </Modal>

        <RegulatoryDisclaimer />
      </div>
    </div>
  );
};
