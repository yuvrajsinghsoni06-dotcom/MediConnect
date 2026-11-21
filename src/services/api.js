import axios from 'axios';

/**
 * MediConnect Axios Client Instance
 * Configured for future Node.js / Express.js / MySQL backend integration.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (ready for JWT tokens in later stages)
api.interceptors.request.use(
  (config) => {
    // In later stages, authentication tokens will be attached here
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In later stages, standard backend error normalization will occur here
    return Promise.reject(error);
  }
);

export default api;
