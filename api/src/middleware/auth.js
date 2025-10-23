import { User } from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  generateDeviceId
} from '../utils/tokenUtils.js';

// Re-export token generation functions for backward compatibility
export {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  generateDeviceId
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use generateAccessToken or generateTokenPair instead
 */
export function generateToken(user) {
  return generateAccessToken(user);
}

/**
 * Authentication middleware
 * Verifies access token and attaches user to request
 */
export async function authenticate(req, res, next) {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
    }

    // Verify access token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired',
        code: 'INVALID_TOKEN'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId, decoded.organizationId);
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User associated with token does not exist',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account has been deactivated',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Attach user to request
    req.user = user;
    req.organizationId = user.organizationId;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication',
      code: 'AUTH_ERROR'
    });
  }
}

/**
 * Check if user has specific permission
 */
export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!req.user.permissions || !req.user.permissions[permission]) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This action requires ${permission} permission`
      });
    }

    next();
  };
}

/**
 * Check if user has specific role
 */
export function requireRole(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const userRole = req.user.profile?.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}
