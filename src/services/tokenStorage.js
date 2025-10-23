/**
 * Token Storage Service
 * Manages access tokens, refresh tokens, and session data in localStorage and sessionStorage
 */

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const SESSION_KEY = 'userSession';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

/**
 * Store tokens in localStorage
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  // Calculate and store expiry time (JWT exp is in seconds, not ms)
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Failed to parse token expiry:', error);
  }
};

/**
 * Get access token from localStorage
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get token expiry time
 * @returns {number|null} Expiry timestamp in milliseconds or null
 */
export const getTokenExpiry = () => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

/**
 * Check if access token is expired or will expire soon
 * @param {number} bufferSeconds - Buffer time in seconds (default 60s)
 * @returns {boolean} True if token is expired or will expire soon
 */
export const isTokenExpired = (bufferSeconds = 60) => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;

  const now = Date.now();
  const bufferMs = bufferSeconds * 1000;

  return (expiry - now) <= bufferMs;
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Store user session data in sessionStorage for fast access
 * @param {Object} data - Session data (user, organization)
 */
export const setSession = (data) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store session data:', error);
  }
};

/**
 * Get user session data from sessionStorage
 * @returns {Object|null} Session data or null
 */
export const getSession = () => {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve session data:', error);
    return null;
  }
};

/**
 * Clear session data from sessionStorage
 */
export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
};

/**
 * Clear all auth data (tokens and session)
 */
export const clearAllAuthData = () => {
  clearTokens();
  clearSession();
  // Also clear legacy token storage for backward compatibility
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user has valid tokens
 * @returns {boolean} True if both access and refresh tokens exist
 */
export const hasValidTokens = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken && refreshToken);
};

/**
 * Get decoded token payload (without verification)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get user ID from access token
 * @returns {string|null} User ID or null
 */
export const getUserIdFromToken = () => {
  const token = getAccessToken();
  const payload = decodeToken(token);
  return payload?.userId || null;
};

/**
 * Get organization ID from access token
 * @returns {string|null} Organization ID or null
 */
export const getOrganizationIdFromToken = () => {
  const token = getAccessToken();
  const payload = decodeToken(token);
  return payload?.organizationId || null;
};

/**
 * Migration utility: Move legacy token to new storage
 * For backward compatibility with existing users
 */
export const migrateLegacyTokens = () => {
  const legacyToken = localStorage.getItem('token');

  if (legacyToken && !getAccessToken()) {
    // If there's a legacy token but no new tokens, treat it as access token
    // Note: This won't have a refresh token, so user will need to re-login eventually
    localStorage.setItem(TOKEN_KEY, legacyToken);
    console.log('Migrated legacy token to new storage');
  }
};

export default {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiry,
  isTokenExpired,
  clearTokens,
  setSession,
  getSession,
  clearSession,
  clearAllAuthData,
  hasValidTokens,
  decodeToken,
  getUserIdFromToken,
  getOrganizationIdFromToken,
  migrateLegacyTokens
};
