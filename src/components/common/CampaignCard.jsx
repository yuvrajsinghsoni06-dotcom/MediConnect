import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Calendar, Clock, MapPin, Building, Users, CheckCircle, HeartHandshake } from 'lucide-react';

export const CampaignCard = ({ campaign }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [donorCount, setDonorCount] = useState(campaign.registeredDonors);

  const {
    id,
    title,
    organizer,
    organizerType,
    date,
    time,
    venue,
    city,
    category,
    targetUnits,
    description,
    urgencyPriority,
    guidelines = [],
  } = campaign;

  const percentProgress = Math.min(Math.round((donorCount / targetUnits) * 100), 100);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!isRegistered) {
      setIsRegistered(true);
      setDonorCount((prev) => prev + 1);
    }
  };

  return (
    <>
      <Card hoverEffect className="flex flex-col justify-between overflow-hidden border border-[#E2E8F0]">
        <div className="p-5 sm:p-6">
          {/* Header row with badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {category}
            </span>
            <Badge
              variant={urgencyPriority === 'Critical' ? 'red' : urgencyPriority === 'High' ? 'amber' : 'blue'}
              size="sm"
            >
              {urgencyPriority} Priority
            </Badge>
          </div>

          <h3 className="text-lg font-bold text-[#0F172A] leading-snug mb-2 hover:text-[#DC2626] transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#DC2626] font-semibold mb-4">
            <Building className="w-3.5 h-3.5 shrink-0" />
            <span>{organizer}</span>
            <span className="text-slate-400 font-normal">({organizerType})</span>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>

          {/* Logistics meta */}
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span className="font-semibold text-slate-800">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-slate-700">{venue}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Donors Registered
              </span>
              <span className="font-bold text-[#0F172A]">
                {donorCount} / {targetUnits} units
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#DC2626] h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card footer CTA */}
        <div className="p-4 bg-slate-50/70 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {percentProgress}% Target Met
          </span>
          <Button
            variant={isRegistered ? 'success' : 'primary'}
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={isRegistered ? CheckCircle : HeartHandshake}
          >
            {isRegistered ? 'Registered' : 'Register as Donor'}
          </Button>
        </div>
      </Card>

      {/* Registration & Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        subtitle={`${date} • ${time} • ${city}`}
      >
        <div className="space-y-4 text-sm">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm">
              <Building className="w-4 h-4 text-[#DC2626]" />
              Organized by {organizer}
            </div>
            <p className="text-slate-600">Location: {venue}</p>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            {description}
          </p>

          {/* Pre-donation guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Donor Preparation Guidelines
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {guidelines.map((g, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Registration form simulation */}
          {isRegistered ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#16A34A]">Demonstration Registration Confirmed!</h4>
              <p className="text-xs text-slate-600">
                You are registered for slot <strong>{date} at {time}</strong>. In the production app, a calendar invite and QR pass will be issued.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="mt-2"
              >
                Close Dialog
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="pt-2 border-t border-slate-100 space-y-3">
              <div className="p-3 bg-red-50/60 rounded-lg border border-red-100 text-xs text-red-900">
                <strong>Illustrative Registration:</strong> Clicking register increments the demo participant counter and demonstrates slot reservation.
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                icon={HeartHandshake}
              >
                Confirm Donor Participation (Demo)
              </Button>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};
