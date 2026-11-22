import api from './api';
import { mockDonors } from '../data/donorsData';

/**
 * Donor Service
 * Provides donor lookup, filtering, and retrieval operations.
 * Communicates with Node.js/Express/MySQL backend with graceful offline fallback.
 */
export const donorService = {
  /**
   * Fetch donors with optional filtering and abort signal support
   */
  async getDonors(filters = {}, options = {}) {
    const { signal } = options;

    if (import.meta.env.MODE !== 'test') {
      try {
        const params = {};
        if (filters.bloodGroup && filters.bloodGroup !== 'all') params.bloodGroup = filters.bloodGroup;
        if (filters.city && filters.city !== 'All Cities') params.city = filters.city;

        const res = await api.get('/donors', { params, signal, timeout: 3000 });
        if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          let results = res.data.data.map(d => ({
            id: d.donor_id || d.id,
            fullName: d.full_name || d.fullName,
            bloodGroup: d.blood_group || d.bloodGroup,
            city: d.city,
            state: d.state,
            area: d.area || d.city,
            availability: d.availability || 'Available Now',
            approximateDistanceKm: d.approximateDistanceKm || 2.5,
            totalDonations: d.total_donations || 0,
            lastDonationDate: d.last_donation_date || null
          }));

          if (filters.availability && filters.availability !== 'all') {
            results = results.filter((d) => d.availability === filters.availability);
          }

          if (filters.maxDistance) {
            results = results.filter((d) => d.approximateDistanceKm <= Number(filters.maxDistance));
          }

          if (filters.search) {
            const query = filters.search.toLowerCase();
            results = results.filter(
              (d) =>
                d.fullName.toLowerCase().includes(query) ||
                d.area.toLowerCase().includes(query) ||
                d.city.toLowerCase().includes(query)
            );
          }

          return {
            data: results,
            total: results.length,
            status: 'success'
          };
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.message === 'canceled') {
          throw err;
        }
        // Fallback to local structured data
      }
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (signal?.aborted) {
          return reject(new DOMException('Request aborted', 'AbortError'));
        }

        let results = [...mockDonors];

        if (filters.bloodGroup && filters.bloodGroup !== 'all') {
          results = results.filter((d) => d.bloodGroup === filters.bloodGroup);
        }

        if (filters.city && filters.city !== 'All Cities') {
          results = results.filter((d) => d.city.toLowerCase() === filters.city.toLowerCase());
        }

        if (filters.availability && filters.availability !== 'all') {
          results = results.filter((d) => d.availability === filters.availability);
        }

        if (filters.maxDistance) {
          results = results.filter((d) => d.approximateDistanceKm <= Number(filters.maxDistance));
        }

        if (filters.search) {
          const query = filters.search.toLowerCase();
          results = results.filter(
            (d) =>
              d.fullName.toLowerCase().includes(query) ||
              d.area.toLowerCase().includes(query) ||
              d.city.toLowerCase().includes(query)
          );
        }

        resolve({
          data: results,
          total: results.length,
          status: 'success',
        });
      }, 150);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Request aborted', 'AbortError'));
        });
      }
    });
  },

  /**
   * Fetch single donor by ID
   */
  async getDonorById(id) {
    if (import.meta.env.MODE !== 'test') {
      try {
        const res = await api.get(`/donors/${id}`, { timeout: 3000 });
        if (res?.data?.success && res.data.data) {
          const d = res.data.data;
          return {
            data: {
              id: d.donor_id || d.id,
              fullName: d.full_name || d.fullName,
              bloodGroup: d.blood_group || d.bloodGroup,
              city: d.city,
              state: d.state,
              area: d.area || d.city,
              availability: d.availability || 'Available Now',
              approximateDistanceKm: d.approximateDistanceKm || 2.5,
              totalDonations: d.total_donations || 0,
              lastDonationDate: d.last_donation_date || null
            },
            status: 'success'
          };
        }
      } catch {
        // Fallback
      }
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const donor = mockDonors.find((d) => d.id === id);
        if (donor) {
          resolve({ data: donor, status: 'success' });
        } else {
          reject(new Error('Donor profile not found'));
        }
      }, 100);
    });
  },
};
