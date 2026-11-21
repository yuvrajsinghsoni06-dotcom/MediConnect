import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Trash2,
  Ban,
  CheckCircle2,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { BloodGroupBadge } from '../../components/ui/BloodGroupBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { DispositionBadge } from '../../components/bloodSafety/DispositionBadge';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const QuarantineManagementPage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('quarantined_investigation');
  const [actionModalUnit, setActionModalUnit] = useState(null);
  const [dispositionChoice, setDispositionChoice] = useState('Approved for release');
  const [dispositionReason, setDispositionReason] = useState('');
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const { currentRole, currentUser, hasPermission } = useSafetyAuth();

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    setIsLoading(true);
    try {
      const res = await bloodSafetyService.getDonations();
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDonations = donations.filter((d) => {
    if (selectedFilter === 'quarantined_investigation') {
      return d.dispositionStatus === 'Quarantined' || d.dispositionStatus === 'Under investigation';
    }
    if (selectedFilter === 'awaiting') {
      return d.dispositionStatus === 'Awaiting testing';
    }
    if (selectedFilter === 'approved') {
      return d.dispositionStatus === 'Approved for release';
    }
    if (selectedFilter === 'discarded') {
      return d.dispositionStatus === 'Discarded' || d.dispositionStatus === 'Not for transfusion';
    }
    return true;
  });

  const handleOpenActionModal = (unit) => {
    setActionModalUnit(unit);
    setDispositionChoice(unit.dispositionStatus === 'Approved for release' ? 'Quarantined' : 'Approved for release');
    setDispositionReason('');
    setActionError(null);
    setActionSuccess(null);
  };

  const handleSaveDisposition = async (e) => {
    e.preventDefault();
    setActionError(null);
    try {
      await bloodSafetyService.updateUnitDisposition(
        actionModalUnit.donationId,
        dispositionChoice,
        dispositionReason || `Disposition updated to ${dispositionChoice} by TMO order.`,
        { name: currentUser.name, role: currentRole.id }
      );

      setActionSuccess(`Donation ${actionModalUnit.donationId} successfully updated to '${dispositionChoice}'.`);
      loadDonations();
      setTimeout(() => {
        setActionModalUnit(null);
      }, 1200);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const canApprove = hasPermission('canApproveRelease');

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Phase 5 • Bio-Hazard Quarantine & Blood Unit Disposition
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Quarantine & Unit Release Management
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Rigorous component custody control: Quarantined units, investigation holds, discard orders, and certified release approvals.
            </p>
          </div>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Quarantine Business Rule Notice */}
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-xs text-red-950 flex items-start gap-3 shadow-xs">
          <Lock className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-red-900 font-bold">Quarantine Lockout Policy: </strong>
            <span>
              Blood units with pending, reactive, inconclusive, or invalid screening assays are automatically sealed in temperature-monitored quarantine storage bays. No unit can be released without unanimous non-reactive statutory assay verification and formal authorization by a Transfusion Medical Officer.
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFilter('quarantined_investigation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'quarantined_investigation'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Quarantined & Under Investigation ({donations.filter((d) => d.dispositionStatus === 'Quarantined' || d.dispositionStatus === 'Under investigation').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('awaiting')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'awaiting'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Awaiting Lab Testing ({donations.filter((d) => d.dispositionStatus === 'Awaiting testing').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'approved'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Approved for Release ({donations.filter((d) => d.dispositionStatus === 'Approved for release').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('discarded')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'discarded'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Discarded / Non-Conforming ({donations.filter((d) => d.dispositionStatus === 'Discarded' || d.dispositionStatus === 'Not for transfusion').length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Units ({donations.length})
          </button>
        </div>

        {/* Units Grid */}
        {isLoading ? (
          <LoadingSpinner message="Inspecting blood repository quarantine bays..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDonations.map((unit) => (
              <Card
                key={unit.donationId}
                className={`p-5 border-2 flex flex-col justify-between ${
                  unit.dispositionStatus === 'Quarantined'
                    ? 'border-red-300 bg-red-50/30'
                    : unit.dispositionStatus === 'Approved for release'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : unit.dispositionStatus === 'Under investigation'
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <BloodGroupBadge group={unit.bloodGroup} size="md" />
                      <div>
                        <strong className="text-slate-900 font-mono text-sm block">
                          {unit.donationId}
                        </strong>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {unit.bloodComponent} ({unit.volumeMl} mL)
                        </span>
                      </div>
                    </div>
                    <DispositionBadge status={unit.dispositionStatus} size="sm" />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs space-y-1">
                    <div>
                      <span className="text-slate-400">Barcode:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">{unit.unitBarCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Vault Location:</span>{' '}
                      <span className="font-semibold text-slate-700">{unit.storageLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Disposition Reason:</span>{' '}
                      <span className="text-slate-700">{unit.dispositionReason}</span>
                    </div>
                  </div>

                  {unit.authorizedBy && (
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span>Authorized: {unit.authorizedBy}</span>
                      <span>{new Date(unit.authorizationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200/60 mt-4 flex items-center justify-between gap-2">
                  <Link to={`/blood-safety/donation/${unit.donationId}`}>
                    <Button variant="secondary" size="sm">
                      Inspect All Assays
                    </Button>
                  </Link>

                  <Button
                    variant={canApprove ? 'outline' : 'ghost'}
                    size="sm"
                    disabled={!canApprove}
                    onClick={() => handleOpenActionModal(unit)}
                  >
                    {canApprove ? 'Alter Disposition' : 'Review Restricted (TMO Only)'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Alter Disposition Modal */}
        <Modal
          isOpen={actionModalUnit !== null}
          onClose={() => setActionModalUnit(null)}
          title={`Clinical Disposition Order — ${actionModalUnit?.donationId}`}
          subtitle={`Component: ${actionModalUnit?.bloodComponent} (${actionModalUnit?.bloodGroup})`}
          maxWidth="max-w-lg"
        >
          {actionModalUnit && (
            <form onSubmit={handleSaveDisposition} className="space-y-4 text-xs">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg font-semibold">
                  {actionSuccess}
                </div>
              )}

              {actionError && (
                <div className="p-3 bg-red-50 text-red-900 border border-red-300 rounded-lg whitespace-pre-line font-medium leading-relaxed">
                  {actionError}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Custody Status</span>
                <DispositionBadge status={actionModalUnit.dispositionStatus} size="md" />
              </div>

              <div>
                <Select
                  label="New Target Disposition Order"
                  required
                  value={dispositionChoice}
                  onChange={(e) => setDispositionChoice(e.target.value)}
                >
                  <option value="Approved for release">Approved for release (Requires all assays Non-reactive)</option>
                  <option value="Quarantined">Quarantined (Enforce Bio-Lock)</option>
                  <option value="Under investigation">Under investigation (Repeat assay required)</option>
                  <option value="Not for transfusion">Not for transfusion (Clinical hold)</option>
                  <option value="Discarded">Discarded (Bio-waste decommissioning)</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Transfusion Medical Officer Clinical Justification
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-[#DC2626]/20"
                  placeholder="Record formal clinical justification, confirmatory assay references, or incineration manifest number..."
                  value={dispositionReason}
                  onChange={(e) => setDispositionReason(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="md" onClick={() => setActionModalUnit(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Sign & Enforce Disposition Order
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
