/**
 * API Helper Utilities
 * Provides common functions for API calls, error handling, and data transformation
 */

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';

  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return filtered ? `?${filtered}` : '';
};

/**
 * Handle API errors consistently
 * @param {Error} error - API error object
 * @returns {Object} - Normalized error object
 */
export const handleAPIError = (error) => {
  const normalized = {
    message: 'An unexpected error occurred',
    status: null,
    code: null,
    details: null
  };

  if (error.response) {
    // Server responded with error status
    normalized.status = error.response.status;
    normalized.message = error.response.data?.message || error.message;
    normalized.code = error.response.data?.code;
    normalized.details = error.response.data?.details;
  } else if (error.request) {
    // Request made but no response
    normalized.message = 'No response from server. Please check your connection.';
    normalized.code = 'NO_RESPONSE';
  } else {
    // Error setting up request
    normalized.message = error.message || 'Request setup failed';
    normalized.code = 'REQUEST_SETUP_ERROR';
  }

  return normalized;
};

/**
 * Create standardized API response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} - Standardized response
 */
export const createAPIResponse = (data, message = 'Success') => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
});

/**
 * Validate required fields in request data
 * @param {Object} data - Request data
 * @param {Array<string>} requiredFields - Required field names
 * @throws {Error} - If validation fails
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === null || value === undefined || value === '';
  });

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

/**
 * Retry async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Result of function call
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Batch multiple API calls with concurrency control
 * @param {Array<Function>} apiCalls - Array of API call functions
 * @param {number} batchSize - Number of concurrent calls
 * @returns {Promise<Array>} - Array of results
 */
export const batchAPICalls = async (apiCalls, batchSize = 5) => {
  const results = [];

  for (let i = 0; i < apiCalls.length; i += batchSize) {
    const batch = apiCalls.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(fn => fn()));
    results.push(...batchResults);
  }

  return results.map((result, index) => ({
    index,
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
};

/**
 * Debounce API call to prevent excessive requests
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounceAPICall = (fn, delay = 300) => {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

/**
 * Transform API response data
 * @param {Object} response - Axios response object
 * @returns {*} - Transformed data
 */
export const transformResponse = (response) => {
  // Extract data from response
  const data = response?.data;

  // Handle different response formats
  if (data && typeof data === 'object') {
    // If response has a data property, return that
    if ('data' in data) return data.data;
    // Otherwise return the whole data object
    return data;
  }

  return data;
};

/**
 * Check if error is retryable
 * @param {Error} error - Error object
 * @returns {boolean} - True if retryable
 */
export const isRetryableError = (error) => {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  const retryableCodes = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'];

  return (
    retryableStatuses.includes(error.response?.status) ||
    retryableCodes.includes(error.code) ||
    error.message?.includes('timeout') ||
    error.message?.includes('network')
  );
};

/**
 * Format file upload for multipart/form-data
 * @param {File|Blob} file - File to upload
 * @param {Object} additionalData - Additional form fields
 * @returns {FormData} - Formatted FormData object
 */
export const formatFileUpload = (file, additionalData = {}) => {
  const formData = new FormData();

  formData.append('file', file);

  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  return formData;
};

/**
 * Cancel token source for aborting requests
 */
export class CancelTokenSource {
  constructor() {
    this.controller = new AbortController();
  }

  get signal() {
    return this.controller.signal;
  }

  cancel(message = 'Request cancelled') {
    this.controller.abort(message);
  }
}

export default {
  buildQueryString,
  handleAPIError,
  createAPIResponse,
  validateRequiredFields,
  retryWithBackoff,
  batchAPICalls,
  debounceAPICall,
  transformResponse,
  isRetryableError,
  formatFileUpload,
  CancelTokenSource
};
