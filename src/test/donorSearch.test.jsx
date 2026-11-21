import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FindDonorsPage } from '../pages/public/FindDonorsPage';
import { donorService } from '../services/donorService';

describe('Donor Search & Filtering', () => {
  it('correctly filters donors by blood group in donorService', async () => {
    const res = await donorService.getDonors({ bloodGroup: 'O-' });
    expect(res.data.length).toBeGreaterThan(0);
    res.data.forEach((d) => {
      expect(d.bloodGroup).toBe('O-');
    });
  });

  it('correctly filters donors by city in donorService', async () => {
    const res = await donorService.getDonors({ city: 'Mumbai' });
    expect(res.data.length).toBeGreaterThan(0);
    res.data.forEach((d) => {
      expect(d.city.toLowerCase()).toBe('mumbai');
    });
  });

  it('correctly filters donors by availability in donorService', async () => {
    const res = await donorService.getDonors({ availability: 'Available Now' });
    expect(res.data.length).toBeGreaterThan(0);
    res.data.forEach((d) => {
      expect(d.availability).toBe('Available Now');
    });
  });

  it('correctly filters donors by max distance in donorService', async () => {
    const maxDist = 4.0;
    const res = await donorService.getDonors({ maxDistance: maxDist });
    expect(res.data.length).toBeGreaterThan(0);
    res.data.forEach((d) => {
      expect(d.approximateDistanceKm).toBeLessThanOrEqual(maxDist);
    });
  });

  it('correctly performs multi-field text search (name, area, city)', async () => {
    const byName = await donorService.getDonors({ search: 'Ananya' });
    expect(byName.data.some((d) => d.fullName.includes('Ananya'))).toBe(true);

    const byArea = await donorService.getDonors({ search: 'Andheri' });
    expect(byArea.data.some((d) => d.area.includes('Andheri'))).toBe(true);

    const byCity = await donorService.getDonors({ search: 'Hyderabad' });
    expect(byCity.data.some((d) => d.city === 'Hyderabad')).toBe(true);
  });

  it('renders FindDonorsPage and displays matching donor cards', async () => {
    render(
      <MemoryRouter>
        <FindDonorsPage />
      </MemoryRouter>
    );

    // Initial loading indicator is shown
    expect(screen.getByText(/Searching verified donor pool/i)).toBeInTheDocument();

    // After async resolve, donors are rendered
    await waitFor(() => {
      expect(screen.getByText(/Dr. Ananya Sharma/i)).toBeInTheDocument();
    });
  });

  it('shows EmptyState when no donors match search filters', async () => {
    render(
      <MemoryRouter>
        <FindDonorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Dr. Ananya Sharma/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/Search by donor name, area, or city/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentDonorXYZ123' } });

    // Wait for debounced search and empty state
    await waitFor(
      () => {
        expect(screen.getByText(/No matching donors found/i)).toBeInTheDocument();
      },
      { timeout: 1500 }
    );

    // Clicking reset restores the donor list
    const resetButton = screen.getByRole('button', { name: /Reset Filters/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText(/Dr. Ananya Sharma/i)).toBeInTheDocument();
    });
  });

  it('displays ErrorState with retry when fetching fails instead of false empty state', async () => {
    const spy = vi.spyOn(donorService, 'getDonors').mockRejectedValueOnce(new Error('Network timeout'));

    render(
      <MemoryRouter>
        <FindDonorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to Load Donors/i)).toBeInTheDocument();
      expect(screen.getByText(/Network timeout/i)).toBeInTheDocument();
      expect(screen.queryByText(/No matching donors found/i)).not.toBeInTheDocument();
    });

    spy.mockRestore();
  });
});
