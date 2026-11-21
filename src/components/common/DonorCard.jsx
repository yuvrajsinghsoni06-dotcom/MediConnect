import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { BloodGroupBadge } from '../ui/BloodGroupBadge';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { MapPin, CheckCircle, Clock, ShieldCheck, Heart, Send, AlertCircle } from 'lucide-react';

export const DonorCard = ({ donor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const {
    id,
    fullName,
    bloodGroup,
    city,
    area,
    approximateDistanceKm,
    availability,
    isVerified,
    totalDonations,
    lastDonatedDaysAgo,
    readinessScore,
    badges = [],
  } = donor;

  const isAvailableNow = availability === 'Available Now';

  const handleSendCoordinationRequest = () => {
    setRequestSent(true);
    setTimeout(() => {
      // Auto-reset state after demo confirmation
    }, 4000);
  };

  return (
    <>
      <Card hoverEffect className="p-5 flex flex-col justify-between border border-[#E2E8F0]">
        <div>
          {/* Top header row */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <BloodGroupBadge group={bloodGroup} size="lg" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[#0F172A] text-base leading-snug">
                    {fullName}
                  </h3>
                  {isVerified && (
                    <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" title="Verified Volunteer Donor" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#64748B] mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{area}, {city}</span>
                </div>
              </div>
            </div>

            <Badge
              variant={isAvailableNow ? 'green' : 'amber'}
              dot
              size="sm"
            >
              {availability}
            </Badge>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 gap-2 my-3.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[#64748B] block">Approx. Distance</span>
              <span className="font-semibold text-[#0F172A]">~{approximateDistanceKm} km away</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Total Donations</span>
              <span className="font-semibold text-[#0F172A]">{totalDonations} times</span>
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {badges.map((b, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Privacy Relay Protected</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            View Profile
          </Button>
        </div>
      </Card>

      {/* Profile & Coordination Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRequestSent(false);
        }}
        title={`Donor Profile — ${fullName}`}
        subtitle="Privacy-Preserving Volunteer Coordination Relay"
      >
        <div className="space-y-4 text-sm">
          {/* Blood group and readiness overview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BloodGroupBadge group={bloodGroup} size="xl" />
              <div>
                <span className="text-xs uppercase tracking-wide font-bold text-slate-500">Readiness Score</span>
                <div className="text-xl font-extrabold text-[#0F172A] flex items-center gap-1.5">
                  <span>{readinessScore}%</span>
                  <span className="text-xs font-normal text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Optimal</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#64748B] block">Status</span>
              <Badge variant={isAvailableNow ? 'green' : 'amber'} dot size="md">
                {availability}
              </Badge>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">Donor Privacy Protected: </strong>
              To prevent unsolicited contact and harassment, personal phone numbers and home addresses are never published. When you request coordination, MediConnect's automated relay sends a verified alert to the donor.
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs border border-slate-200 rounded-lg p-3">
            <div>
              <span className="text-slate-500 block">Metropolitan Area</span>
              <span className="font-semibold text-slate-900">{area}, {city}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Approx. Distance</span>
              <span className="font-semibold text-slate-900">~{approximateDistanceKm} km from query center</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Lifetime Donations</span>
              <span className="font-semibold text-slate-900">{totalDonations} verified units</span>
            </div>
            <div>
              <span className="text-slate-500 block">Last Donated</span>
              <span className="font-semibold text-slate-900">{lastDonatedDaysAgo} days ago (Eligible)</span>
            </div>
          </div>

          {/* Request Coordination Demo Action */}
          {requestSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#16A34A]">Coordination Ping Sent (Demo)</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                In the complete system, an SMS/push notification is routed to {fullName} with your verified hospital case ID.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRequestSent(false)}
                className="mt-2"
              >
                Send Another Alert
              </Button>
            </div>
          ) : (
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                icon={Send}
                onClick={handleSendCoordinationRequest}
              >
                Request Emergency Coordination (Demo)
              </Button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Demonstration mode: No real SMS or push notification is sent.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
