import axios from 'axios';

const API_BASE = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  // Don't add auth token for registration endpoints
  if (!config.url.includes('/auth/register')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;