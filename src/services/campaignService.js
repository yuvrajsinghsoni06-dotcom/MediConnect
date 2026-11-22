import api from './api';
import { mockCampaigns } from '../data/campaignsData';

/**
 * Campaign Service
 * Provides donation drive and campaign event queries.
 * Communicates with Node.js/Express/MySQL backend with graceful offline fallback.
 */
export const campaignService = {
  async getCampaigns(filters = {}, options = {}) {
    const { signal } = options;

    if (import.meta.env.MODE !== 'test') {
      try {
        const res = await api.get('/campaigns', { signal, timeout: 3000 });
        if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          let results = res.data.data.map(c => ({
            id: c.campaign_id || c.id,
            title: c.title,
            organizer: c.organizer,
            venue: c.location,
            city: (c.location || '').split(',').pop()?.trim() || 'New Delhi',
            date: c.date,
            time: `${(c.start_time || '09:00').slice(0, 5)} - ${(c.end_time || '17:00').slice(0, 5)}`,
            targetUnits: c.target_units || 100,
            collectedUnits: c.collected_units || 0,
            status: c.status?.toLowerCase() || 'upcoming',
            description: c.description
          }));

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

          return {
            data: results,
            total: results.length,
            status: 'success',
          };
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.message === 'canceled') {
          throw err;
        }
        // Fallback
      }
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (signal?.aborted) {
          return reject(new DOMException('Request aborted', 'AbortError'));
        }

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

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Request aborted', 'AbortError'));
        });
      }
    });
  },

  async getCampaignById(id) {
    if (import.meta.env.MODE !== 'test') {
      try {
        const res = await api.get('/campaigns', { timeout: 3000 });
        if (res?.data?.success && Array.isArray(res.data.data)) {
          const c = res.data.data.find(x => x.campaign_id === id || x.id === id);
          if (c) {
            return {
              data: {
                id: c.campaign_id || c.id,
                title: c.title,
                organizer: c.organizer,
                venue: c.location,
                city: (c.location || '').split(',').pop()?.trim() || 'New Delhi',
                date: c.date,
                time: `${(c.start_time || '09:00').slice(0, 5)} - ${(c.end_time || '17:00').slice(0, 5)}`,
                targetUnits: c.target_units || 100,
                collectedUnits: c.collected_units || 0,
                status: c.status?.toLowerCase() || 'upcoming',
                description: c.description
              },
              status: 'success'
            };
          }
        }
      } catch {
        // Fallback
      }
    }

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
