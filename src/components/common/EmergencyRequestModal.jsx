import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { BloodGroupBadge } from '../ui/BloodGroupBadge';
import { AlertCircle, CheckCircle2, ShieldAlert, Building2, Droplet, User, Phone } from 'lucide-react';
import { BLOOD_GROUPS, MAJOR_CITIES } from '../../utils/constants';

export const EmergencyRequestModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsNeeded: '2',
    hospitalName: '',
    hospitalCity: 'Mumbai',
    urgencyLevel: 'Immediate (Within 2 Hours)',
    requesterName: '',
    requesterPhone: '',
    caseReferenceNumber: 'EMR-' + Math.floor(100000 + Math.random() * 900000),
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Emergency Blood Request"
      subtitle="Broadcast urgent blood requirement to nearby verified donors"
      maxWidth="max-w-xl"
    >
      {submitted ? (
        <div className="p-4 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#0F172A]">Demo Emergency Broadcast Logged</h4>
            <p className="text-xs text-[#DC2626] font-semibold mt-1">
              Case Reference: {formData.caseReferenceNumber}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Required Group:</span>
              <BloodGroupBadge group={formData.bloodGroup} size="sm" />
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Quantity Needed:</span>
              <span className="font-semibold text-slate-800">{formData.unitsNeeded} Units</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Hospital:</span>
              <span className="font-semibold text-slate-800">{formData.hospitalName || 'City Central Hospital'}, {formData.hospitalCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Urgency Level:</span>
              <span className="font-semibold text-[#DC2626]">{formData.urgencyLevel}</span>
            </div>
          </div>

          <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-lg text-xs text-left flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <strong>Demonstration Simulation:</strong> In Stage 2 with MySQL/Node backend, this request triggers automated radius geospatial matching and sends push pings to eligible registered donors in {formData.hospitalCity}.
            </div>
          </div>

          <Button variant="primary" size="md" className="w-full" onClick={handleReset}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Urgency Alert notice */}
          <div className="p-3 rounded-lg bg-red-50/80 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <strong>Emergency Dispatch Protocol:</strong> For life-threatening emergencies, always notify the attending ER surgeon and on-duty hospital blood bank first.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Blood Group Needed"
              required
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              icon={Droplet}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </Select>

            <Input
              label="Units Required (Bags)"
              type="number"
              min="1"
              max="10"
              required
              value={formData.unitsNeeded}
              onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Hospital Name"
              placeholder="e.g. Apollo Hospital / City General"
              required
              icon={Building2}
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
            />

            <Select
              label="City / District"
              required
              value={formData.hospitalCity}
              onChange={(e) => setFormData({ ...formData, hospitalCity: e.target.value })}
            >
              {MAJOR_CITIES.filter(c => c !== 'All Cities').map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
          </div>

          <Select
            label="Urgency Level"
            required
            value={formData.urgencyLevel}
            onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
          >
            <option value="Immediate (Within 2 Hours)">Immediate (Critical ICU / Surgery &lt; 2 Hours)</option>
            <option value="Urgent (Within 6 Hours)">Urgent (Within 6 Hours)</option>
            <option value="Within 24 Hours">Within 24 Hours (Scheduled Transfusion)</option>
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Patient Full Name"
              placeholder="Patient Name"
              required
              icon={User}
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            />

            <Input
              label="Contact Representative Phone"
              placeholder="10-digit mobile number"
              required
              icon={Phone}
              value={formData.requesterPhone}
              onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#DC2626] hover:bg-[#991B1B]"
              isLoading={isSubmitting}
            >
              Broadcast Emergency Blood Request (Demo)
            </Button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              University Capstone Project: Stage 1 frontend simulation.
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
};
