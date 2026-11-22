import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Search,
  Filter,
  SlidersHorizontal,
  Calendar,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { BloodGroupBadge } from '../../components/ui/BloodGroupBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SafetyRoleBanner } from '../../components/bloodSafety/SafetyRoleBanner';
import { SafetyNavigation } from '../../components/bloodSafety/SafetyNavigation';
import { DispositionBadge } from '../../components/bloodSafety/DispositionBadge';
import { RegulatoryDisclaimer } from '../../components/bloodSafety/RegulatoryDisclaimer';
import { bloodSafetyService } from '../../services/bloodSafetyService';
import { useSafetyAuth } from '../../context/SafetyAuthContext';
import { BLOOD_GROUPS } from '../../utils/constants';

export const DonationsListPage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedDisposition, setSelectedDisposition] = useState('all');
  const { currentRole, currentUser } = useSafetyAuth();

  useEffect(() => {
    fetchDonations();
  }, [searchQuery, selectedGroup, selectedDisposition, currentRole.id]);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const res = await bloodSafetyService.getDonations(
        {
          bloodGroup: selectedGroup,
          dispositionStatus: selectedDisposition,
          search: searchQuery,
        },
        currentRole.id,
        currentUser.id
      );
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Phase 2 • Component Processing & Registry
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Individual Blood Donation Records
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Every collected unit maintains an independent, non-transferable laboratory and clinical safety ledger.
            </p>
          </div>
        </div>

        <SafetyRoleBanner />
        <SafetyNavigation />

        {/* Role-Specific Capability Callouts */}
        {currentRole.id === 'hospital' && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
            <span className="font-bold uppercase px-2 py-0.5 rounded bg-blue-200 text-blue-950 text-[10px]">Hospital Requisition View</span>
            <span>Displaying certified transfusion-ready units approved by a Transfusion Medical Officer. Quarantined units and donor health identifiers are restricted.</span>
          </div>
        )}

        {currentRole.id === 'donor' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
            <span className="font-bold uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 text-[10px]">Volunteer Donor View</span>
            <span>Displaying your private donation record and release certification status. Peer records are confidential and hidden.</span>
          </div>
        )}

        {/* Filters */}
        <Card className="p-4 border border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Search by Donation ID, barcode, or centre..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              icon={Droplet}
            >
              <option value="all">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </Select>

            <Select
              value={selectedDisposition}
              onChange={(e) => setSelectedDisposition(e.target.value)}
              icon={Lock}
            >
              <option value="all">All Disposition Statuses</option>
              <option value="Approved for release">Approved for release</option>
              <option value="Quarantined">Quarantined</option>
              <option value="Under investigation">Under investigation</option>
              <option value="Awaiting testing">Awaiting testing</option>
              <option value="Discarded">Discarded</option>
            </Select>
          </div>
        </Card>

        {/* Donations Grid / Table */}
        {isLoading ? (
          <LoadingSpinner message="Retrieving donation log..." />
        ) : (
          <Card className="border border-[#E2E8F0] bg-white overflow-hidden shadow-soft">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Total Units Found: {donations.length}
              </span>
              <span className="text-[11px] text-slate-400">
                Click "Inspect Lifecycle" to review laboratory assays and release approvals
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Donation ID & Barcode</th>
                    <th className="py-3 px-4">Blood Group & Component</th>
                    <th className="py-3 px-4">Collection Date</th>
                    <th className="py-3 px-4">Blood Centre</th>
                    <th className="py-3 px-4">Disposition Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {donations.map((d) => (
                    <tr key={d.donationId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {d.donationId}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Barcode: {d.unitBarCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <BloodGroupBadge group={d.bloodGroup} size="sm" />
                          <div>
                            <span className="font-semibold text-slate-900 block">{d.bloodComponent}</span>
                            <span className="text-[10px] text-slate-400">{d.volumeMl} mL</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900">
                          {new Date(d.collectionDateTime).toLocaleDateString()}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(d.collectionDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{d.bloodCentreName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">Sample: {d.sampleReference}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <DispositionBadge status={d.dispositionStatus} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/blood-safety/donation/${d.donationId}`}>
                          <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                            Inspect
                          </Button>
                        </Link>
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
