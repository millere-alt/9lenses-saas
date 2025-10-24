/**
 * CORS Utilities for Azure Functions
 * Manages CORS headers and preflight requests
 */

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3005',
  'https://agreeable-bush-03cb6a40f.2.azurestaticapps.net',
  'https://www.9vectors.com',
  'https://9vectors.com',
  'https://www.9vectors.ai',
  'https://9vectors.ai'
].filter(Boolean);

/**
 * Get CORS headers for a given origin
 * @param {string|null} origin - Request origin
 * @returns {object} CORS headers
 */
function getCorsHeaders(origin) {
  // Check if origin is allowed
  const isAllowed = !origin || ALLOWED_ORIGINS.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '600'
  };
}

/**
 * Handle OPTIONS preflight request
 * @param {HttpRequest} request - Azure Functions request object
 * @returns {object} HTTP response
 */
function handlePreflight(request) {
  const origin = request.headers.get('origin');

  return {
    status: 204,
    headers: getCorsHeaders(origin),
    body: ''
  };
}

/**
 * Check if origin is allowed
 * @param {string} origin - Request origin
 * @returns {boolean}
 */
function isOriginAllowed(origin) {
  if (!origin) return true; // Allow requests with no origin (e.g., Postman)
  return ALLOWED_ORIGINS.includes(origin);
}

module.exports = {
  ALLOWED_ORIGINS,
  getCorsHeaders,
  handlePreflight,
  isOriginAllowed
};
