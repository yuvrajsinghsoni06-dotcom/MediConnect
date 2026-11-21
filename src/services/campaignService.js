import { mockCampaigns } from '../data/campaignsData';

/**
 * Campaign Service
 * Provides donation drive and campaign event queries.
 */
export const campaignService = {
  async getCampaigns(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...mockCampaigns];

        if (filters.city && filters.city !== 'All Cities') {
          results = results.filter((c) => c.city.toLowerCase() === filters.city.toLowerCase());
        }

        if (filters.status && filters.status !== 'all') {
          results = results.filter((c) => c.status.toLowerCase() === filters.status.toLowerCase());
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(
            (c) =>
              c.title.toLowerCase().includes(q) ||
              c.organizer.toLowerCase().includes(q) ||
              c.venue.toLowerCase().includes(q)
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

  async getCampaignById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = mockCampaigns.find((c) => c.id === id);
        if (item) {
          resolve({ data: item, status: 'success' });
        } else {
          reject(new Error('Campaign not found'));
        }
      }, 100);
    });
  },
};
