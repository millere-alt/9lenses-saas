import axios from 'axios';
import logger from '../utils/logger';

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

// Create enhanced axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// LRU Cache implementation
const MAX_CACHE_SIZE = 50;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

// Clean up expired cache entries
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
};

// Add to cache with LRU eviction
const setCacheEntry = (key, value) => {
  // Clean expired entries first
  if (cache.size >= MAX_CACHE_SIZE) {
    cleanExpiredCache();
  }

  // If still over limit, remove oldest entry (first in Map)
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }

  // Delete and re-add to move to end (most recent)
  cache.delete(key);
  cache.set(key, value);
};

// Periodic cleanup (every 5 minutes)
setInterval(cleanExpiredCache, CACHE_DURATION);

// Retry configuration for failed requests
const retryableStatuses = [408, 429, 500, 502, 503, 504];

// Request interceptor - add auth token and request ID
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID();

    // Add timestamp
    config.metadata = { startTime: new Date() };

    // Check cache for GET requests
    if (config.method === 'get' && config.cache !== false) {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cached = cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        config.adapter = () => Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: cached.headers,
          config
        });
      }
    }

    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - enhanced error handling and caching
api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get' && response.config.cache !== false) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      setCacheEntry(cacheKey, {
        data: response.data,
        headers: response.headers,
        timestamp: Date.now()
      });
    }

    return response;
  },
  async (error) => {
    const config = error.config;

    // Handle network errors
    if (!error.response) {
      logger.error('Network error:', error);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        originalError: error
      });
    }

    const { status } = error.response;

    // Handle 401 Unauthorized
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('unauthorized'));

      // Prevent redirect loop
      if (!window.location.pathname.includes('login')) {
        window.location.href = '/';
      }
      return Promise.reject(error);
    }

    // Implement retry logic
    if (retryableStatuses.includes(status) && (!config._retry || config._retry < MAX_RETRIES)) {
      config._retry = (config._retry || 0) + 1;

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, config._retry), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }

    // Enhanced error message
    const enhancedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: status,
      data: error.response?.data,
      requestId: config.headers['X-Request-ID'],
      originalError: error
    };

    logger.error('API Error:', enhancedError);
    return Promise.reject(enhancedError);
  }
);

// Clear cache utility
export const clearCache = () => {
  cache.clear();
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  syncAuth0: (data) => api.post('/auth/sync-auth0', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
};

// User API
export const userAPI = {
  getMe: () => api.get('/users/me'),
  getOrganizationUsers: () => api.get('/users/organization'),
  updateProfile: (data) => api.put('/users/me', data)
};

// Assessment API
export const assessmentAPI = {
  getAll: () => api.get('/assessments'),
  getById: (id) => api.get(`/assessments/${id}`),
  create: (data) => api.post('/assessments', data),
  update: (id, data) => api.put(`/assessments/${id}`, data),
  delete: (id) => api.delete(`/assessments/${id}`),
  submitResponse: (id, answers) => api.post(`/assessments/${id}/responses`, { answers })
};

// Document API
export const documentAPI = {
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  upload: (formData) => {
    // Validate file before upload
    const file = formData.get('file');
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Allowed types: PDF, TXT, Excel, Word');
      }
    }

    return api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/documents/${id}`)
};

// AI API
export const aiAPI = {
  strategyAdvisor: (assessmentData, context) =>
    api.post('/ai/strategy-advisor', { assessmentData, context }),
  predictiveAnalytics: (historicalData, timeframe) =>
    api.post('/ai/predictive-analytics', { historicalData, timeframe }),
  documentAnalysis: (documentText, analysisType) =>
    api.post('/ai/document-analysis', { documentText, analysisType }),
  assistant: (message, conversationHistory) =>
    api.post('/ai/assistant', { message, conversationHistory }),
  chat: (message, context, systemPrompt, maxTokens) =>
    api.post('/ai/chat', { message, context, systemPrompt, maxTokens }),
  analyze: (content, analysisType, maxTokens) =>
    api.post('/ai/analyze', { content, analysisType, maxTokens }),
  coach: (context, workflow, mode, maxTokens) =>
    api.post('/ai/coach', { context, workflow, mode, maxTokens })
};

// Stripe API
export const stripeAPI = {
  createCheckoutSession: (tier) => api.post('/stripe/create-checkout-session', { tier }),
  getSubscription: () => api.get('/stripe/subscription'),
  cancelSubscription: () => api.post('/stripe/cancel-subscription')
};

// Notification API
export const notificationAPI = {
  getAll: (unreadOnly = false) => api.get('/notifications', { params: { unreadOnly } }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all')
};

// Analytics API
export const analyticsAPI = {
  track: (eventName, properties) => api.post('/analytics/track', { eventName, properties }),
  getDashboard: (startDate, endDate) =>
    api.get('/analytics/dashboard', { params: { startDate, endDate } })
};

export default api;
