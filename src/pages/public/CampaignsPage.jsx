import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  MapPin,
  Building,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  PlusCircle
} from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { CampaignCard } from '../../components/common/CampaignCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { campaignService } from '../../services/campaignService';
import { MAJOR_CITIES } from '../../utils/constants';

export const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [searchQuery, selectedCity]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await campaignService.getCampaigns({
        city: selectedCity,
        search: searchQuery,
      });
      setCampaigns(response.data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
  };

  return (
    <div className="w-full py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-xs font-bold text-[#DC2626] border border-red-200">
              Community Health Drives
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Voluntary Blood Donation Campaigns
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
              Explore scheduled blood collection drives organized by certified hospitals, Red Cross chapters, and student volunteer leagues.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            icon={PlusCircle}
            onClick={() => setIsSuggestModalOpen(true)}
            className="shrink-0"
          >
            Host / Suggest a Camp
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <SlidersHorizontal className="w-4 h-4 text-[#DC2626]" />
              <span>Filter Campaigns</span>
            </div>
            {(searchQuery || selectedCity !== 'All Cities') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#DC2626] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search by drive title, organizer, or venue..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                icon={MapPin}
              >
                {MAJOR_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Campaigns Count */}
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>
            Showing <strong className="text-[#0F172A] font-bold">{campaigns.length}</strong> upcoming donation drives
          </span>
          <span className="text-[11px] text-slate-400">
            Illustrative sample donation camps
          </span>
        </div>

        {/* Campaigns Grid */}
        {isLoading ? (
          <LoadingSpinner message="Loading upcoming healthcare campaigns..." size="lg" />
        ) : campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns match your filters"
            description="No donation drives were found for the selected city or keyword query. Try resetting filters or browsing other metropolitan sectors."
            actionLabel="Reset Search"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        )}
      </div>

      {/* Suggest a Campaign Modal (Frontend Demonstration) */}
      <Modal
        isOpen={isSuggestModalOpen}
        onClose={() => {
          setIsSuggestModalOpen(false);
          setSuggestSuccess(false);
        }}
        title="Host or Suggest a Blood Camp"
        subtitle="Submit a community donation drive proposal for coordination support"
      >
        {suggestSuccess ? (
          <div className="p-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#0F172A] text-lg">Proposal Received (Demo)</h4>
            <p className="text-xs text-slate-600">
              Thank you for taking initiative. In Stage 2, our hospital coordination team will review venue logistics and dispatch medical phlebotomists.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSuggestModalOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSuggestSuccess(true);
            }}
            className="space-y-3.5 text-xs"
          >
            <Input label="Proposed Event Title" required placeholder="e.g. Green Valley Residents Blood Camp" />
            <Input label="Organizer / Organization Name" required placeholder="e.g. Youth Rotary Club" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" required placeholder="City name" />
              <Input label="Tentative Date" type="date" required />
            </div>
            <Input label="Target Donor Count (Estimate)" type="number" min="20" placeholder="e.g. 100" />
            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" className="w-full">
                Submit Camp Proposal (Demo)
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
