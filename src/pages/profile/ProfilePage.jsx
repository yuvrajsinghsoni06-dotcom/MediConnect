import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Heart,
  Save,
  Edit3,
  RefreshCw,
  Building2,
  Activity,
  FileCheck2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BloodGroupBadge } from '../../components/ui/BloodGroupBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import { useSafetyAuth } from '../../context/SafetyAuthContext';
import { MAJOR_CITIES, BLOOD_GROUPS } from '../../utils/constants';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSafetyAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'history' | 'requests'

  // Edit / Onboarding state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    bloodGroup: 'O+',
    dateOfBirth: '1998-05-15',
    gender: 'Male',
    phone: '',
    city: 'Mumbai',
    state: 'Maharashtra'
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/profile');
      if (response.data && response.data.success) {
        setProfileData(response.data);
        const donor = response.data.donorProfile;
        const user = response.data.user;

        setFormData({
          fullName: donor?.full_name || user?.name || '',
          bloodGroup: donor?.blood_group || 'O+',
          dateOfBirth: donor?.date_of_birth ? donor.date_of_birth.substring(0, 10) : '1998-05-15',
          gender: donor?.gender || 'Male',
          phone: donor?.phone || '',
          city: donor?.city || 'Mumbai',
          state: donor?.state || 'Maharashtra'
        });

        // If donor is not yet onboarded, open the onboarding form automatically
        if (!response.data.isOnboarded && user?.role === 'donor') {
          setIsEditing(true);
        }
      } else {
        throw new Error('Failed to retrieve profile data.');
      }
    } catch (err) {
      console.error('[ProfilePage] Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Error loading profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      errs.phone = 'Phone number must be at least 10 digits.';
    }
    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required.';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 18 || age > 65) {
        errs.dateOfBirth = 'Donor must be between 18 and 65 years of age (DGHS Standard).';
      }
    }
    if (!formData.city) {
      errs.city = 'Municipal city is required.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setSaveSuccess(null);
    try {
      const payload = {
        full_name: formData.fullName.trim(),
        blood_group: formData.bloodGroup,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone.trim(),
        city: formData.city,
        state: formData.state
      };

      const response = await api.post('/users/donor-onboarding', payload);
      if (response.data && response.data.success) {
        setSaveSuccess(response.data.message || 'Profile saved successfully!');
        setIsEditing(false);
        await fetchProfile();
      }
    } catch (err) {
      console.error('[ProfilePage] Save error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setFormErrors({ submit: msg || 'Failed to save profile changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12">
        <LoadingSpinner message="Loading your verified healthcare profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Could Not Load Profile"
          message={error}
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  const { user, donorProfile, isOnboarded, donationHistory = [], matchingRequests = [] } = profileData || {};

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Page Title & Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-white/20">
              {donorProfile?.blood_group ? donorProfile.blood_group : <User className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {user?.name || donorProfile?.full_name}
                </h1>
                <Badge variant={user?.role === 'donor' ? 'primary' : 'secondary'} className="text-[10px] font-bold uppercase">
                  {user?.role}
                </Badge>
                {isOnboarded ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Onboarded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <AlertCircle className="w-3.5 h-3.5" /> Onboarding Incomplete
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{user?.email}</span>
                <span>•</span>
                <span>ID: <code className="text-slate-200">{user?.userId}</code></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProfile}
              icon={RefreshCw}
              className="text-white border-white/30 hover:bg-white/10"
            >
              Refresh
            </Button>
            {user?.role === 'donor' && !isEditing && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                icon={Edit3}
              >
                {isOnboarded ? 'Edit Profile' : 'Complete Onboarding'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications / Success alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess(null)} className="text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          Donor Profile & Health Details
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          Donation History ({donationHistory.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-red-500" />
          Matching Emergency Requests ({matchingRequests.length})
        </button>
      </div>

      {/* Tab 1: Profile & Onboarding */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card: Details / Onboarding Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {isEditing ? (isOnboarded ? 'Edit Donor Information' : 'Donor Onboarding Form') : 'Verified Donor Profile'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isEditing
                      ? 'Ensure all vital identity details match your government photo identification.'
                      : 'Your information is protected under MediConnect Healthcare Privacy rules.'}
                  </p>
                </div>
                {!isEditing && isOnboarded && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={Edit3}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                /* Edit & Onboarding Form */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {formErrors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{formErrors.submit}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Legal Name"
                      placeholder="e.g. Rahul Sharma"
                      required
                      icon={User}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      error={formErrors.fullName}
                    />

                    <div>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                        ABO / Rh Blood Group <span className="text-red-600">*</span>
                      </label>
                      <Select
                        icon={Droplet}
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Date of Birth"
                      type="date"
                      required
                      icon={Calendar}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      error={formErrors.dateOfBirth}
                      helperText="Must be 18 to 65 years (DGHS Statutory Donor Age Threshold)"
                    />

                    <div>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                        Gender <span className="text-red-600">*</span>
                      </label>
                      <Select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Phone Number"
                      placeholder="10-digit mobile number"
                      required
                      icon={Phone}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={formErrors.phone}
                      helperText="Private: Never published or shared publicly"
                    />

                    <div>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                        Municipal City <span className="text-red-600">*</span>
                      </label>
                      <Select
                        icon={MapPin}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        error={formErrors.city}
                      >
                        {MAJOR_CITIES.filter((c) => c !== 'All Cities').map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    {isOnboarded && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="md"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={saving}
                      icon={Save}
                    >
                      {isOnboarded ? 'Save Profile Changes' : 'Complete Onboarding'}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Read-Only Profile Overview */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Full Name
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {donorProfile?.full_name || user?.name}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Blood Group
                      </span>
                      <div className="flex items-center gap-2">
                        <BloodGroupBadge bloodGroup={donorProfile?.blood_group || 'O+'} />
                        <span className="text-xs text-slate-600 font-medium">Standard Immunohematology Verified</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Date of Birth & Age
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {donorProfile?.date_of_birth ? donorProfile.date_of_birth.substring(0, 10) : 'Not specified'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Gender
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {donorProfile?.gender || 'Not specified'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Verified Contact Phone
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {donorProfile?.phone || 'Not provided'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                        Protected by Privacy Shield
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Location & Zone
                      </span>
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {donorProfile?.city || 'Mumbai'}, {donorProfile?.state || 'Maharashtra'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-800 leading-relaxed">
                      <span className="font-bold">DGHS Blood Safety Privacy Commitment:</span> Your phone number, email address, and exact date of birth are confidential and are never published in public donor directories. Coordinating blood banks connect via secure platform alerts only.
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar: Donor Impact Stats */}
          <div className="space-y-6">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Your Lifesaver Impact
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Droplet className="w-5 h-5 text-red-600 fill-red-600" />
                    <span className="text-xs font-semibold text-slate-700">Total Donations</span>
                  </div>
                  <span className="text-xl font-black text-red-700">
                    {donorProfile?.total_donations || 0}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700">Last Donation Date</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {donorProfile?.last_donation_date ? donorProfile.last_donation_date.substring(0, 10) : 'None'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700">Interval Status</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    {donorProfile?.last_donation_date ? 'Standard Interval Active' : 'Eligible to Donate'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate('/campaigns')}
                >
                  Browse Upcoming Blood Camps
                </Button>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-red-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                DGHS Donor Guidelines
              </h4>
              <p className="leading-relaxed text-slate-600">
                Minimum interval between whole blood donations is 90 days for men and 120 days for women. Hemoglobin check ($\ge 12.5\text{ g/dL}$) and vitals are confirmed on-site before every donation.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Donation History */}
      {activeTab === 'history' && (
        <Card className="p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recorded Donation Units</h2>
              <p className="text-xs text-slate-500">
                Official transfusion medicine accession records linked to your donor identity.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {donationHistory.length} Record(s) in Database
            </span>
          </div>

          {donationHistory.length === 0 ? (
            <EmptyState
              title="No Past Donations Recorded"
              description="You have not participated in a blood collection drive yet. Complete your first donation at an affiliated blood center or camp!"
              actionLabel="View Active Campaigns"
              onAction={() => navigate('/campaigns')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Unit Number</th>
                    <th className="py-3 px-3">Donation Date</th>
                    <th className="py-3 px-3">Type & Volume</th>
                    <th className="py-3 px-3">Blood Group</th>
                    <th className="py-3 px-3">Collection Center</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donationHistory.map((unit) => (
                    <tr key={unit.unit_number} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {unit.unit_number}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {unit.donation_date ? new Date(unit.donation_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {unit.donation_type || 'Whole Blood'} ({unit.volume_ml || 450} mL)
                      </td>
                      <td className="py-3 px-3">
                        <BloodGroupBadge bloodGroup={unit.blood_group} />
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {unit.location}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          unit.quarantine_status === 'Released'
                            ? 'bg-emerald-100 text-emerald-800'
                            : unit.quarantine_status === 'Bio_Lock'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {unit.quarantine_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab 3: Matching Emergency Requests */}
      {activeTab === 'requests' && (
        <Card className="p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hospital Emergency Match Grid</h2>
              <p className="text-xs text-slate-500">
                Live critical requests requiring your compatible blood type ({donorProfile?.blood_group || 'O+'}).
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/find-donors')}
              className="text-xs"
            >
              Public Donor Directory
            </Button>
          </div>

          {matchingRequests.length === 0 ? (
            <EmptyState
              title="No Pending Emergency Requests"
              description="No acute emergency requests currently match your blood group. Hospital reserves are currently stable."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingRequests.map((req) => (
                <div
                  key={req.request_id}
                  className="p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50/60 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">{req.request_id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      req.urgency === 'Critical'
                        ? 'bg-red-600 text-white'
                        : req.urgency === 'Urgent'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {req.urgency}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{req.hospital_name}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-red-600" />
                      Units Needed: <span className="font-bold text-red-600">{req.units_needed} units</span> ({req.blood_group})
                    </p>
                  </div>

                  <div className="pt-2 border-t border-red-100/60 flex items-center justify-between text-xs text-slate-500">
                    <span>Contact: {req.contact_person}</span>
                    <span className="font-mono">{req.contact_phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
export default ProfilePage;
