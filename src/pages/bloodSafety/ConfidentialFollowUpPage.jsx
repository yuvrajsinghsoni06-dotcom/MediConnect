import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle
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
import { mockFollowUps } from '../../data/bloodSafetyData';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const ConfidentialFollowUpPage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [completionStatus, setCompletionStatus] = useState('Appointment Scheduled');
  const [appointmentRef, setAppointmentRef] = useState('');
  const [counsellorNotes, setCounsellorNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const { currentRole, currentUser, hasPermission } = useSafetyAuth();

  useEffect(() => {
    loadFollowUps();
  }, [currentRole.id]);

  const loadFollowUps = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await bloodSafetyService.getFollowUps(currentRole.id);
      setFollowUps(res.data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingFollowUp(item);
    setCompletionStatus(item.completionStatus);
    setAppointmentRef(item.appointmentReference);
    setCounsellorNotes(item.confidentialNotes);
  };

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    try {
      await bloodSafetyService.updateFollowUpStatus(
        editingFollowUp.followUpId,
        {
          completionStatus,
          appointmentReference: appointmentRef,
          confidentialNotes: counsellorNotes,
        },
        { name: currentUser.name, role: currentRole.id }
      );

      loadFollowUps();
      setEditingFollowUp(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Phase 6 • Confidential Donor Health Guidance & Counselling
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Confidential Donor Follow-Up
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Restricted medical outreach: Respectful, non-stigmatizing donor communication, confirmatory testing referrals, and post-donation clinical guidance.
            </p>
          </div>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Strict Confidentiality Banner */}
        <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200 text-xs text-purple-950 flex items-start gap-3">
          <Lock className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-purple-900 font-bold">Strict Healthcare Privacy Enforcement: </strong>
            <span>
              Infection screening results are strictly confidential under National AIDS Control Organisation (NACO) and biomedical privacy guidelines. Sensitive laboratory findings are NEVER displayed on donor public profiles, donor search results, hospital portals, or automated emails. Outreach is conducted exclusively through confidential registered correspondence and in-person physician counselling.
            </span>
          </div>
        </div>

        {errorMsg ? (
          <Card className="p-8 text-center bg-red-50/60 border border-red-200">
            <AlertCircle className="w-10 h-10 text-[#DC2626] mx-auto mb-2" />
            <h3 className="text-base font-bold text-red-950">Access Restricted</h3>
            <p className="text-xs text-red-800 max-w-md mx-auto mt-1">{errorMsg}</p>
            <p className="text-[11px] text-slate-500 mt-3">
              Switch role to <strong>Transfusion Medical Officer</strong> or <strong>Blood Bank Staff</strong> in the banner above to inspect confidential follow-up records.
            </p>
          </Card>
        ) : isLoading ? (
          <LoadingSpinner message="Accessing encrypted donor communication vault..." />
        ) : (
          <div className="space-y-4">
            {followUps.map((item) => (
              <Card key={item.followUpId} className="p-6 border border-[#E2E8F0] bg-white space-y-4 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-purple-900">{item.followUpId}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="font-mono text-xs font-bold text-slate-800">Donation: {item.donationId}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700">Donor: {item.donorMaskedName}</span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      item.completionStatus === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-900'
                    }`}
                  >
                    {item.completionStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Clinical Trigger</span>
                    <strong className="text-slate-900 leading-snug block">{item.triggerReason}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Confidential Notification</span>
                    <strong className="text-slate-900 leading-snug block">{item.confidentialNotificationStatus}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Counselling Desk Reference</span>
                    <strong className="text-purple-900 font-mono font-bold leading-snug block">{item.appointmentReference}</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200 text-xs">
                  <strong className="text-slate-900 block mb-1">Counsellor Interaction Record:</strong>
                  <p className="text-slate-600 leading-relaxed">{item.confidentialNotes}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Assigned Counsellor: <strong>{item.responsibleCounsellor}</strong></span>
                    <span>Dispatched: {new Date(item.communicationDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                    Update Follow-Up Status
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Update Follow-Up Modal */}
        <Modal
          isOpen={editingFollowUp !== null}
          onClose={() => setEditingFollowUp(null)}
          title={`Confidential Follow-Up — ${editingFollowUp?.followUpId}`}
          subtitle={`Donation: ${editingFollowUp?.donationId} • Donor: ${editingFollowUp?.donorMaskedName}`}
          maxWidth="max-w-lg"
        >
          {editingFollowUp && (
            <form onSubmit={handleSaveFollowUp} className="space-y-4 text-xs">
              <div>
                <Select
                  label="Follow-Up Completion Status"
                  required
                  value={completionStatus}
                  onChange={(e) => setCompletionStatus(e.target.value)}
                >
                  <option value="Confidential Notification Dispatched">Confidential Notification Dispatched</option>
                  <option value="Appointment Scheduled">Appointment Scheduled</option>
                  <option value="Counselling Conducted">Counselling Conducted (In Person)</option>
                  <option value="Follow-Up Sample Pending">Follow-Up Sample Pending</option>
                  <option value="Completed">Completed (Clinical Resolution Logged)</option>
                </Select>
              </div>

              <Input
                label="Confirmatory Appointment Reference Code"
                required
                value={appointmentRef}
                onChange={(e) => setAppointmentRef(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Confidential Progress & Referral Notes
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-[#DC2626]/20"
                  value={counsellorNotes}
                  onChange={(e) => setCounsellorNotes(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="md" onClick={() => setEditingFollowUp(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Update Follow-Up Record
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
