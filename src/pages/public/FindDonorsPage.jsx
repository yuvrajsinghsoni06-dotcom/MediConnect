import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  RotateCcw,
  Users,
  ShieldCheck,
  Droplet,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { DonorCard } from '../../components/common/DonorCard';
import { EmergencyNoticeBanner } from '../../components/common/EmergencyNoticeBanner';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { donorService } from '../../services/donorService';
import { BLOOD_GROUPS, MAJOR_CITIES, AVAILABILITY_OPTIONS } from '../../utils/constants';

export const FindDonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [maxDistance, setMaxDistance] = useState('10'); // in km

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup, selectedCity, selectedAvailability, maxDistance, searchQuery]);

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const response = await donorService.getDonors({
        bloodGroup: selectedBloodGroup,
        city: selectedCity,
        availability: selectedAvailability,
        maxDistance: maxDistance ? Number(maxDistance) : undefined,
        search: searchQuery,
      });
      setDonors(response.data);
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBloodGroup('all');
    setSelectedCity('All Cities');
    setSelectedAvailability('all');
    setMaxDistance('10');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBloodGroup !== 'all') count++;
    if (selectedCity !== 'All Cities') count++;
    if (selectedAvailability !== 'all') count++;
    if (maxDistance !== '10') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedBloodGroup, selectedCity, selectedAvailability, maxDistance, searchQuery]);

  return (
    <div className="w-full py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-xs font-bold text-[#DC2626] border border-red-200">
            Privacy-Protected Donor Discovery
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Find Volunteer Blood Donors
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
            Locate nearby eligible volunteer donors by blood group, municipal sector, and approximate radius.
          </p>
        </div>

        {/* Mandatory Preliminary Matching Notice */}
        <EmergencyNoticeBanner />

        {/* Search & Filter Control Panel */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <SlidersHorizontal className="w-4 h-4 text-[#DC2626]" />
              <span>Donor Discovery Filters</span>
              {activeFiltersCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#DC2626]">
                  {activeFiltersCount} Active
                </span>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#DC2626] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Search input */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by donor name, area, or city..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Blood Group Select */}
            <div>
              <Select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                icon={Droplet}
              >
                <option value="all">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    Blood Group {bg}
                  </option>
                ))}
              </Select>
            </div>

            {/* City Select */}
            <div>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                icon={MapPin}
              >
                {MAJOR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>

            {/* Availability Select */}
            <div>
              <Select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Radius / Distance Slider Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span>
                Maximum Approximate Search Radius:{' '}
                <strong className="text-slate-900 font-bold">{maxDistance} km</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="2"
                max="25"
                step="1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-40 accent-[#DC2626] cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-700 w-10 text-right">{maxDistance} km</span>
            </div>
          </div>
        </div>

        {/* Results Count & Quick Bar */}
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <div>
            Showing <strong className="text-[#0F172A] font-bold">{donors.length}</strong> volunteer donor matches
          </div>
          <div className="text-[11px] text-slate-400">
            Sample mock database • No sensitive donor credentials exposed
          </div>
        </div>

        {/* Donors Grid */}
        {isLoading ? (
          <LoadingSpinner message="Searching verified donor pool..." size="lg" />
        ) : donors.length === 0 ? (
          <EmptyState
            title="No matching donors found"
            description="No volunteer donors currently meet the selected radius or blood group criteria. Try increasing the distance radius or resetting your search filters."
            actionLabel="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
