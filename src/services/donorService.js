import { mockDonors } from '../data/donorsData';

/**
 * Donor Service
 * Provides donor lookup, filtering, and retrieval operations.
 * Currently uses structured mock data; designed for seamless migration to Node/Express/MySQL API.
 */
export const donorService = {
  /**
   * Fetch donors with optional filtering
   */
  async getDonors(filters = {}) {
    // Simulate slight asynchronous query resolution
    return new Promise((resolve) => {
      setTimeout(() => {
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
    });
  },

  /**
   * Fetch single donor by ID
   */
  async getDonorById(id) {
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
