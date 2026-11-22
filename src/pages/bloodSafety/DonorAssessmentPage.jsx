import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  User,
  Heart,
  Scale,
  Activity,
  Thermometer,
  FileCheck,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { BloodGroupBadge } from '../../components/ui/BloodGroupBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { OutcomeBadge } from '../../components/bloodSafety/OutcomeBadge';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { mockDonorAssessments } from '../../data/bloodSafetyData';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const DonorAssessmentPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { currentRole, currentUser, hasPermission } = useSafetyAuth();

  // New assessment form state
  const [formData, setFormData] = useState({
    donorRefId: 'dnr-001',
    donorFullName: 'Dr. Ananya Sharma',
    donorAge: '32',
    donorGender: 'Female',
    bloodGroup: 'O+',
    weightKg: '58.5',
    haemoglobinGdl: '13.4',
    pulseBpm: '72',
    bloodPressure: '120/80 mmHg',
    temperatureF: '98.4',
    previousDonationsCount: '8',
    lastDonationDate: '2026-07-28',
    questionnaire: {
      feelingWellToday: true,
      adequateSleepHours: '7.5',
      hadFoodWithin4Hours: true,
      takingPrescriptionAntibiotics: false,
      historyOfHepatitisOrJaundice: false,
      recentTattooOrPiercingInPast6Mo: false,
      recentDentalExtractionInPast72Hrs: false,
      historyOfCardiacOrPulmonaryDisease: false,
      recentVaccinationInPast14Days: false,
    },
    assessorNotes: '',
    outcome: 'Accepted for donation',
  });

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setIsLoading(true);
    try {
      const res = await bloodSafetyService.getDonorAssessments();
      setAssessments(res.data);
    } catch (err) {
      console.error('Failed to load donor assessments:', err);
      setAssessments([...mockDonorAssessments]);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time regulatory eligibility assessment
  const eligibilityEvaluation = bloodSafetyService.evaluateDonorEligibility(formData);

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        weightKg: Number(formData.weightKg),
        haemoglobinGdl: Number(formData.haemoglobinGdl),
        pulseBpm: Number(formData.pulseBpm),
        temperatureF: Number(formData.temperatureF),
        previousDonationsCount: Number(formData.previousDonationsCount),
      };

      const result = await bloodSafetyService.createDonorAssessment(payload, {
        name: currentUser.name,
        role: currentRole.id,
      });

      setAssessments((prev) => [result.data, ...prev]);
      setSubmitSuccess(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const canAssess = hasPermission('canAssessDonors');

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Phase 1 • Pre-Donation Clinical Clearance
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Donor Health Assessments
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Comprehensive physiological screening: Haemoglobin, body weight, vitals, medical questionnaire, and authorized deferral tracking.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            disabled={!canAssess}
            onClick={() => {
              setSubmitSuccess(false);
              setIsModalOpen(true);
            }}
          >
            {canAssess ? 'Perform Clinical Assessment' : 'Assessment Restricted (Staff Only)'}
          </Button>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Clinical Oversight Callout */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-3">
          <ClipboardCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Professional Clinical Assessment Mandate: </strong>
            <span>
              Pre-donation eligibility must never be calculated automatically by frontend logic or machine algorithms. In accordance with NBTC and regulatory phlebotomy standards, a qualified medical officer must examine the donor in person, assess veins, review questionnaire declarations, and record an authorized clinical determination.
            </span>
          </div>
        </div>

        {/* Assessments List Table */}
        <Card className="border border-[#E2E8F0] bg-white overflow-hidden shadow-soft">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">
              Completed Pre-Donation Clinical Assessments
            </h2>
            <span className="text-xs text-slate-500">
              Total Recorded: <strong>{assessments.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Assessment ID</th>
                  <th className="py-3.5 px-4">Donor Name & Group</th>
                  <th className="py-3.5 px-4">Physical Vitals</th>
                  <th className="py-3.5 px-4">Assessing Medical Officer</th>
                  <th className="py-3.5 px-4">Clinical Outcome</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {assessments.map((asm) => (
                  <tr key={asm.assessmentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {asm.assessmentId}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(asm.assessmentDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <BloodGroupBadge group={asm.bloodGroup} size="sm" />
                        <div>
                          <strong className="text-slate-900 block">{asm.donorFullName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">Ref: {asm.donorRefId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div>Hb: <strong>{asm.haemoglobinGdl} g/dL</strong> (Wt: {asm.weightKg} kg)</div>
                      <div className="text-[10px] text-slate-400">BP: {asm.bloodPressure} • Pulse: {asm.pulseBpm} bpm</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-semibold">{asm.assessingOfficer}</div>
                      <span className="text-[10px] text-slate-400">{asm.assessingFacility}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <OutcomeBadge outcome={asm.outcome} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedAssessment(asm)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Inspect Assessment Modal */}
        <Modal
          isOpen={selectedAssessment !== null}
          onClose={() => setSelectedAssessment(null)}
          title={`Clinical Assessment — ${selectedAssessment?.assessmentId}`}
          subtitle={`Donor: ${selectedAssessment?.donorFullName} (${selectedAssessment?.bloodGroup})`}
          maxWidth="max-w-2xl"
        >
          {selectedAssessment && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">Clinical Outcome</span>
                  <OutcomeBadge outcome={selectedAssessment.outcome} size="md" />
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">Assessing Officer</span>
                  <strong className="text-slate-900">{selectedAssessment.assessingOfficer}</strong>
                </div>
              </div>

              {/* Vitals Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl border border-slate-200 bg-white text-center">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Body Weight</span>
                  <strong className="text-sm text-slate-900">{selectedAssessment.weightKg} kg</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Haemoglobin</span>
                  <strong className="text-sm text-slate-900">{selectedAssessment.haemoglobinGdl} g/dL</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
                  <strong className="text-sm text-slate-900">{selectedAssessment.bloodPressure}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Pulse</span>
                  <strong className="text-sm text-slate-900">{selectedAssessment.pulseBpm} bpm</strong>
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <strong className="text-slate-800 block mb-1">Assessor Clinical Notes:</strong>
                <p className="text-slate-600 leading-relaxed">{selectedAssessment.assessorNotes}</p>
              </div>

              {/* Questionnaire Highlights */}
              <div>
                <strong className="text-slate-800 block mb-2 font-bold uppercase tracking-wider text-[11px]">
                  Donor Questionnaire Declarations
                </strong>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Feeling well today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adequate sleep (&gt; 6 hrs)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No recent tattoos / piercing (6 mo)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No antibiotics in past 72 hrs</span>
                  </div>
                </div>
              </div>

              {/* Linked Donation Action */}
              <div className="pt-3 border-t border-slate-200">
                {selectedAssessment.donationRecordId ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">Associated Donation Unit</span>
                      <strong className="text-emerald-950 font-mono text-sm">{selectedAssessment.donationRecordId}</strong>
                    </div>
                    <a
                      href={`/blood-safety/donation/${selectedAssessment.donationRecordId}`}
                      className="px-3 py-1.5 bg-[#DC2626] text-white rounded-lg font-bold text-xs hover:bg-red-700 transition-colors"
                    >
                      Inspect Unit & Lab Results →
                    </a>
                  </div>
                ) : selectedAssessment.outcome === 'Accepted for donation' ? (
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-sky-700 font-bold uppercase block">Phlebotomy Ready</span>
                      <span className="text-xs text-sky-950">Donor is clinically approved. Record collection & generate barcoded unit.</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!hasPermission('canRecordDonations')}
                      onClick={async () => {
                        try {
                          const res = await bloodSafetyService.createDonationFromAssessment(
                            selectedAssessment.assessmentId,
                            {},
                            { name: currentUser.name, role: currentRole.id }
                          );
                          setSelectedAssessment({ ...selectedAssessment, donationRecordId: res.data.donationId });
                          loadAssessments();
                          alert(`Blood collection recorded! Unit ${res.data.donationId} generated and placed in electronic quarantine.`);
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                    >
                      {hasPermission('canRecordDonations') ? 'Record Collection & Generate Unit' : 'Collection Restricted (Staff Only)'}
                    </Button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500 text-[11px] text-center italic">
                    Blood collection blocked due to deferred assessment outcome.
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* New Assessment Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Pre-Donation Clinical Health Examination"
          subtitle="Record donor vitals, questionnaire, and authorized clinical outcome"
          maxWidth="max-w-2xl"
        >
          {submitSuccess ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Clinical Assessment Recorded</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                The donor assessment has been officially logged with regulatory audit credentials. If accepted, phlebotomy collection can proceed.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Donor Reference ID"
                  required
                  value={formData.donorRefId}
                  onChange={(e) => setFormData({ ...formData, donorRefId: e.target.value })}
                />
                <Input
                  label="Donor Full Name"
                  required
                  value={formData.donorFullName}
                  onChange={(e) => setFormData({ ...formData, donorFullName: e.target.value })}
                />
                <Select
                  label="Blood Group"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Input
                  label="Weight (kg)"
                  type="number"
                  step="0.5"
                  required
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                />
                <Input
                  label="Haemoglobin (g/dL)"
                  type="number"
                  step="0.1"
                  required
                  value={formData.haemoglobinGdl}
                  onChange={(e) => setFormData({ ...formData, haemoglobinGdl: e.target.value })}
                />
                <Input
                  label="Pulse (bpm)"
                  type="number"
                  required
                  value={formData.pulseBpm}
                  onChange={(e) => setFormData({ ...formData, pulseBpm: e.target.value })}
                />
                <Input
                  label="Blood Pressure"
                  required
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Medical Notes & Vein Inspection
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record clinical assessment notes, inspection of antecubital veins, and any observations..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-[#DC2626]/20"
                  value={formData.assessorNotes}
                  onChange={(e) => setFormData({ ...formData, assessorNotes: e.target.value })}
                />
              </div>

              <div>
                <Select
                  label="Clinical Determination / Assessment Outcome"
                  required
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                >
                  <option value="Accepted for donation">Accepted for donation</option>
                  <option value="Temporarily deferred">Temporarily deferred (Vitals/Interval)</option>
                  <option value="Referred for medical review">Referred for medical review</option>
                  <option value="Permanently deferred">Permanently deferred (Regulatory)</option>
                </Select>
              </div>

              {/* Real-time Regulatory Vitals Clearance Guidance */}
              {eligibilityEvaluation.isEligible ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Statutory Parameters Satisfied:</strong> Donor vitals and intervals comply with DGHS / NBTC statutory criteria.
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Regulatory Eligibility Advisory (DGHS / Drugs & Cosmetics Rules):</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-900">
                    {eligibilityEvaluation.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <div className="text-[10px] text-amber-700 italic pt-0.5">
                    Recommended determination: <strong>{eligibilityEvaluation.recommendedOutcome}</strong>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full">
                  Authorize & Sign Clinical Assessment
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
