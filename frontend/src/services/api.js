import axios from 'axios';

// In Docker environment, use relative URLs since nginx proxies /api/* to backend
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection.',
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      
      // Token expired - try to refresh or redirect to login
      if (errorCode === 'TOKEN_EXPIRED') {
        localStorage.removeItem('authToken');
        
        // Dispatch custom event for token expiration
        window.dispatchEvent(new CustomEvent('tokenExpired'));
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?reason=expired';
        }
      } else if (errorCode === 'TOKEN_INVALID' || errorCode === 'USER_NOT_FOUND') {
        localStorage.removeItem('authToken');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?reason=invalid';
        }
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
      return Promise.reject({
        ...error,
        message: 'Server error. Please try again later.',
      });
    }

    return Promise.reject(error);
  }
);

// Helper function to set auth token
api.setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.Authorization;
  }
};

// Helper function to clear auth
api.clearAuth = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.Authorization;
};

export default api;
