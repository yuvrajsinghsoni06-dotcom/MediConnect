import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  MapPin,
  RotateCcw,
  Droplet,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DonorCard } from '../../components/common/DonorCard';
import { EmergencyNoticeBanner } from '../../components/common/EmergencyNoticeBanner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { donorService } from '../../services/donorService';
import { BLOOD_GROUPS, MAJOR_CITIES, AVAILABILITY_OPTIONS } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';

export const FindDonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [maxDistance, setMaxDistance] = useState('10'); // in km
  const [retryCount, setRetryCount] = useState(0);

  // Debounce search input (300ms) to prevent excessive query calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDonors = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await donorService.getDonors(
          {
            bloodGroup: selectedBloodGroup,
            city: selectedCity,
            availability: selectedAvailability,
            maxDistance: maxDistance ? Number(maxDistance) : undefined,
            search: debouncedSearchQuery,
          },
          { signal: controller.signal }
        );

        setDonors(response.data);
      } catch (err) {
        // If aborted by a newer request or cleanup, don't update state
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          return;
        }
        console.error('Error fetching donors:', err);
        setError(
          err?.message || 'Failed to retrieve donor records. Please check your network connection and try again.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchDonors();

    return () => {
      controller.abort();
    };
  }, [
    selectedBloodGroup,
    selectedCity,
    selectedAvailability,
    maxDistance,
    debouncedSearchQuery,
    retryCount,
  ]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBloodGroup('all');
    setSelectedCity('All Cities');
    setSelectedAvailability('all');
    setMaxDistance('10');
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

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
                aria-label="Search by donor name, area, or city"
              />
            </div>

            {/* Blood Group Select */}
            <div>
              <Select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                icon={Droplet}
                aria-label="Filter by Blood Group"
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
                aria-label="Filter by City"
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
                aria-label="Filter by Availability"
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
                aria-label="Approximate search radius in kilometers"
              />
              <span className="text-[11px] font-bold text-slate-700 w-10 text-right">{maxDistance} km</span>
            </div>
          </div>
        </div>

        {/* Results Count & Quick Bar (Only shown when not loading and no error) */}
        {!error && !isLoading && (
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <div>
              Showing <strong className="text-[#0F172A] font-bold">{donors.length}</strong> volunteer donor matches
            </div>
            <div className="text-[11px] text-slate-400">
              Sample mock database • No sensitive donor credentials exposed
            </div>
          </div>
        )}

        {/* Donors Grid / Loading / Error / Empty States */}
        {isLoading ? (
          <LoadingSpinner message="Searching verified donor pool..." size="lg" />
        ) : error ? (
          <ErrorState
            title="Failed to Load Donors"
            message={error}
            onRetry={handleRetry}
          />
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
