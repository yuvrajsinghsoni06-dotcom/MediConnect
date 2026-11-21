import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  User,
  Clock,
  Terminal,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentRole } = useSafetyAuth();

  useEffect(() => {
    loadAuditLogs();
  }, [categoryFilter, searchQuery]);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const res = await bloodSafetyService.getAuditLogs({
        actionCategory: categoryFilter,
        search: searchQuery,
      });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryColor = (cat) => {
    switch (cat) {
      case 'DISPOSITION_APPROVAL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'CLINICAL_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'LAB_TEST_ENTRY':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DONOR_ASSESSMENT':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'CONFIDENTIAL_FOLLOWUP':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CATALOGUE_UPDATE':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Regulatory Traceability & Chain of Custody
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Safety & Clinical Audit Logs
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Immutable audit ledger documenting every donor assessment, laboratory entry, biological quarantine lock, and clinical release sign-off.
            </p>
          </div>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Filters */}
        <Card className="p-4 border border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Search audit trail by user name, reference ID, or details..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              icon={Filter}
            >
              <option value="all">All Action Categories</option>
              <option value="DISPOSITION_APPROVAL">Unit Disposition & Release Approvals</option>
              <option value="CLINICAL_REVIEW">Clinical & Confirmatory Reviews</option>
              <option value="LAB_TEST_ENTRY">Laboratory Assay Entries</option>
              <option value="DONOR_ASSESSMENT">Pre-Donation Assessments</option>
              <option value="CONFIDENTIAL_FOLLOWUP">Confidential Donor Notifications</option>
              <option value="CATALOGUE_UPDATE">Test Catalogue & Protocol Changes</option>
            </Select>
          </div>
        </Card>

        {/* Audit Log Table */}
        {isLoading ? (
          <LoadingSpinner message="Retrieving safety audit ledger..." />
        ) : (
          <Card className="border border-[#E2E8F0] bg-white overflow-hidden shadow-soft">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Audit Events Recorded: {logs.length}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                SHA-256 Chain of Custody Stamped
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Audit ID & Timestamp</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Officer & Role</th>
                    <th className="py-3 px-4">Record Reference</th>
                    <th className="py-3 px-4">Action Details</th>
                    <th className="py-3 px-4 text-right">Terminal Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {logs.map((log) => (
                    <tr key={log.auditId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-slate-900 block">{log.auditId}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${categoryColor(
                            log.actionCategory
                          )}`}
                        >
                          {log.actionCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{log.userRef}</div>
                        <span className="text-[10px] text-slate-400">{log.userRole}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {log.recordReference}
                      </td>
                      <td className="py-3 px-4 text-slate-600 leading-relaxed max-w-sm">
                        {log.actionDetails}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                        {log.terminalIp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <RegulatoryDisclaimer />
      </div>
    </div>
  );
};
