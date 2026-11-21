import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  Clock,
  Edit,
  Eye,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { ScreeningTestBadge } from '../../components/bloodSafety/ScreeningTestBadge';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const LaboratoryTestingPage = () => {
  const [tests, setTests] = useState([]);
  const [catalogue, setCatalogue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTestCode, setSelectedTestCode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTest, setEditingTest] = useState(null);
  const [editFormData, setEditFormData] = useState({
    resultStatus: 'Non-reactive',
    opticalDensityRatio: '',
    reportReference: '',
    notes: '',
  });
  const [updateFeedback, setUpdateFeedback] = useState(null);
  const { currentRole, currentUser, hasPermission } = useSafetyAuth();

  useEffect(() => {
    loadLabData();
  }, [selectedStatus, selectedTestCode, searchQuery]);

  const loadLabData = async () => {
    setIsLoading(true);
    try {
      const [testsRes, catRes] = await Promise.all([
        bloodSafetyService.getLaboratoryTests({
          resultStatus: selectedStatus,
          testCode: selectedTestCode,
          search: searchQuery,
        }),
        bloodSafetyService.getTestCatalogue(),
      ]);
      setTests(testsRes.data);
      setCatalogue(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (test) => {
    setEditingTest(test);
    setEditFormData({
      resultStatus: test.resultStatus === 'Pending' ? 'Non-reactive' : test.resultStatus,
      opticalDensityRatio: test.opticalDensityRatio || '0.12 (Cutoff 1.00)',
      reportReference: test.reportReference === 'Awaiting' ? `REP-${test.testCode}-${Date.now().toString().slice(-4)}` : test.reportReference,
      notes: test.notes || '',
    });
    setUpdateFeedback(null);
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    try {
      await bloodSafetyService.updateTestResult(editingTest.testId, editFormData, {
        name: currentUser.name,
        role: currentRole.id,
      });

      setUpdateFeedback({
        type: 'success',
        message: `Assay record ${editingTest.testId} successfully logged with status: ${editFormData.resultStatus}`,
      });
      loadLabData();
      setTimeout(() => {
        setEditingTest(null);
      }, 1200);
    } catch (err) {
      setUpdateFeedback({ type: 'error', message: err.message });
    }
  };

  const canEditTests = hasPermission('canEnterLabResults');

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Phase 3 • Mandatory Transfusion Transmitted Infection (TTI) Testing
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Laboratory Screening Management
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Statutory serological and molecular testing logs for HIV, Hepatitis B, Hepatitis C, Syphilis, and Malaria.
            </p>
          </div>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Screening Result Non-Diagnostic Warning */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Non-Diagnostic Screening Principle: </strong>
            <span>
              Blood donor screening tests are designed for maximum sensitivity to prevent transfusion transmission. An initial reactive, inconclusive, or grey-zone screening result is NOT a confirmed medical diagnosis of infection. Such findings mandate immediate quarantine of the blood unit and referral to certified clinical laboratories for duplicate verification, Western Blot / NAT testing, and private physician follow-up.
            </span>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 border border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Search by test name, sample reference, or report..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              value={selectedTestCode}
              onChange={(e) => setSelectedTestCode(e.target.value)}
              icon={FlaskConical}
            >
              <option value="all">All Screening Assays</option>
              {catalogue.map((c) => (
                <option key={c.testCode} value={c.testCode}>
                  {c.testCode} • {c.testName}
                </option>
              ))}
            </Select>

            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Result Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Non-reactive">Non-reactive</option>
              <option value="Reactive">Reactive (Flagged)</option>
              <option value="Inconclusive">Inconclusive / Grey Zone</option>
              <option value="Invalid">Invalid (QC Failed)</option>
            </Select>
          </div>
        </Card>

        {/* Laboratory Tests Table */}
        {isLoading ? (
          <LoadingSpinner message="Retrieving laboratory assay ledger..." />
        ) : (
          <Card className="border border-[#E2E8F0] bg-white overflow-hidden shadow-soft">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Total Test Assays: {tests.length}
              </span>
              <span className="text-[11px] text-slate-500">
                {canEditTests ? 'Authorized to enter and review lab assays' : 'View-only mode (Lab staff or TMO required for edits)'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Test Code & Assay</th>
                    <th className="py-3 px-4">Donation ID & Sample</th>
                    <th className="py-3 px-4">Result Status</th>
                    <th className="py-3 px-4">Optical Density / Ratio</th>
                    <th className="py-3 px-4">Report Reference</th>
                    <th className="py-3 px-4">Entered / Verified</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tests.map((t) => (
                    <tr key={t.testId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <span className="font-mono text-[#DC2626] font-bold block">{t.testCode}</span>
                        <span>{t.testName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <Link
                          to={`/blood-safety/donation/${t.donationId}`}
                          className="font-bold text-slate-900 hover:text-[#DC2626] hover:underline block"
                        >
                          {t.donationId}
                        </Link>
                        <span className="text-[10px] text-slate-400">Sample: {t.sampleReference}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <ScreeningTestBadge status={t.resultStatus} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {t.opticalDensityRatio}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {t.reportReference}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        <div>Entered: {t.enteredBy || 'Pending'}</div>
                        <div>Verified: {t.reviewedBy || 'Pending'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant={canEditTests ? 'outline' : 'ghost'}
                          size="sm"
                          disabled={!canEditTests}
                          onClick={() => handleOpenEdit(t)}
                        >
                          {canEditTests ? 'Record Result' : 'View Only'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Record / Edit Laboratory Assay Modal */}
        <Modal
          isOpen={editingTest !== null}
          onClose={() => setEditingTest(null)}
          title={`Laboratory Assay Entry — ${editingTest?.testName}`}
          subtitle={`Donation ID: ${editingTest?.donationId} • Sample: ${editingTest?.sampleReference}`}
          maxWidth="max-w-xl"
        >
          {editingTest && (
            <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
              {updateFeedback && (
                <div
                  className={`p-3 rounded-lg font-semibold text-xs ${
                    updateFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                      : 'bg-red-50 text-red-900 border border-red-300'
                  }`}
                >
                  {updateFeedback.message}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assay Protocol</span>
                <strong className="text-slate-900">{editingTest.testName}</strong>
                <div className="text-[11px] text-slate-500 mt-0.5">Lab Ref: {editingTest.laboratoryReference}</div>
              </div>

              <div>
                <Select
                  label="Screening Assay Result Status"
                  required
                  value={editFormData.resultStatus}
                  onChange={(e) => setEditFormData({ ...editFormData, resultStatus: e.target.value })}
                >
                  <option value="Non-reactive">Non-reactive (Passed)</option>
                  <option value="Reactive">Reactive (Trigger Quarantine Lock)</option>
                  <option value="Inconclusive">Inconclusive / Grey Zone (Under Investigation)</option>
                  <option value="Invalid">Invalid (QC Failure / Repeat Required)</option>
                </Select>
              </div>

              <Input
                label="Assay Optical Density / Absorbance Ratio"
                required
                value={editFormData.opticalDensityRatio}
                placeholder="e.g. 0.14 (Cutoff 1.00) or S/CO: 2.45"
                onChange={(e) => setEditFormData({ ...editFormData, opticalDensityRatio: e.target.value })}
              />

              <Input
                label="Secure Laboratory Report Reference"
                required
                value={editFormData.reportReference}
                placeholder="e.g. REP-HIV-2026-901"
                onChange={(e) => setEditFormData({ ...editFormData, reportReference: e.target.value })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Technologist Analysis Notes
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-[#DC2626]/20"
                  placeholder="Record reagent lot number, control values, and assay validity notes..."
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                />
              </div>

              <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-xs text-red-900">
                <strong>Safety Lock Notice: </strong>
                Selecting 'Reactive', 'Inconclusive', or 'Invalid' will automatically update the blood unit's status in the repository and prevent unauthorized release.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="md" onClick={() => setEditingTest(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Commit Assay Record to Safety Ledger
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
