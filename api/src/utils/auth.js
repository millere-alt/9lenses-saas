/**
 * JWT Authentication Utility for Azure Functions
 * Validates JWT tokens from Authorization header
 */

const jwt = require('jsonwebtoken');
const { unauthorized } = require('./response');

/**
 * Validates JWT token from request Authorization header
 * @param {HttpRequest} request - Azure Functions request object
 * @returns {Promise<{valid: boolean, user?: object, response?: object}>}
 */
async function validateAuth(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return {
      valid: false,
      response: unauthorized('No authorization header provided')
    };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      response: unauthorized('Invalid authorization header format')
    };
  }

  const token = authHeader.substring(7);

  if (!token) {
    return {
      valid: false,
      response: unauthorized('No token provided')
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify token hasn't expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return {
        valid: false,
        response: unauthorized('Token has expired')
      };
    }

    return {
      valid: true,
      user: decoded
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return {
        valid: false,
        response: unauthorized('Token has expired')
      };
    }

    if (err.name === 'JsonWebTokenError') {
      return {
        valid: false,
        response: unauthorized('Invalid token')
      };
    }

    return {
      valid: false,
      response: unauthorized('Token validation failed')
    };
  }
}

/**
 * Validates refresh token
 * @param {HttpRequest} request - Azure Functions request object
 * @returns {Promise<{valid: boolean, user?: object, response?: object}>}
 */
async function validateRefreshToken(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      response: unauthorized('No refresh token provided')
    };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    return {
      valid: true,
      user: decoded
    };
  } catch (err) {
    return {
      valid: false,
      response: unauthorized('Invalid refresh token')
    };
  }
}

module.exports = {
  validateAuth,
  validateRefreshToken
};
