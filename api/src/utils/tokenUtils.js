import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate access token (short-lived)
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
export function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.profile?.role,
    type: 'access'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
}

/**
 * Generate refresh token (long-lived)
 * @param {Object} user - User object
 * @param {string} deviceId - Device identifier
 * @returns {string} JWT refresh token
 */
export function generateRefreshToken(user, deviceId = 'unknown') {
  const payload = {
    userId: user.id,
    email: user.email,
    organizationId: user.organizationId,
    deviceId,
    type: 'refresh',
    // Add a unique token ID for revocation tracking
    jti: crypto.randomBytes(16).toString('hex')
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  });
}

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @param {string} deviceId - Device identifier
 * @returns {Object} { accessToken, refreshToken }
 */
export function generateTokenPair(user, deviceId = 'unknown') {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user, deviceId)
  };
}

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify token type
    if (decoded.type !== 'access') {
      return null;
    }

    return decoded;
  } catch (error) {
    // Token expired, invalid, or malformed
    return null;
  }
}

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    // Verify token type
    if (decoded.type !== 'refresh') {
      return null;
    }

    return decoded;
  } catch (error) {
    // Token expired, invalid, or malformed
    return null;
  }
}

/**
 * Hash refresh token for secure storage in database
 * Uses SHA-256 to create a one-way hash
 * @param {string} token - Refresh token to hash
 * @returns {string} Hashed token
 */
export function hashToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null if not found
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Get token expiration time in seconds
 * @param {string} token - JWT token
 * @returns {number|null} Expiration timestamp or null if invalid
 */
export function getTokenExpiration(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded?.exp || null;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired (without verifying signature)
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export function isTokenExpired(token) {
  const exp = getTokenExpiration(token);
  if (!exp) return true;

  return Date.now() >= exp * 1000;
}

/**
 * Generate device identifier from request
 * @param {Object} req - Express request object
 * @returns {string} Device identifier
 */
export function generateDeviceId(req) {
  const userAgent = req.headers['user-agent'] || 'unknown';
  const ip = req.ip || req.connection.remoteAddress || 'unknown';

  // Create a hash of user agent + IP for device identification
  return crypto
    .createHash('md5')
    .update(`${userAgent}-${ip}`)
    .digest('hex')
    .substring(0, 16);
}