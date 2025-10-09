import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
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
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
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
    api.post('/ai/assistant', { message, conversationHistory })
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
