import axios from 'axios';

const API_BASE = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Create a separate instance for auth endpoints
const authApi = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Request interceptor for main API instance
api.interceptors.request.use(
  (config) => {
    // Always set content type
    config.headers['Content-Type'] = 'application/json';
    
    // Add auth token for non-auth endpoints
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for auth API instance (NO AUTH TOKENS EVER)
authApi.interceptors.request.use(
  (config) => {
    // Always set content type
    config.headers['Content-Type'] = 'application/json';
    
    // IMPORTANT: Explicitly remove any authorization header
    delete config.headers['Authorization'];
    delete config.headers['authorization'];
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for main API
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      if (window.location.pathname !== '/login' && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export both instances
export { api, authApi };
export default api;