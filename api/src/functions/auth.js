/**
 * Authentication Functions for Azure Functions v4
 * Handles user registration, login, logout, password reset, and Auth0 sync
 */

import { app } from '@azure/functions';
import { success, created, error, badRequest, unauthorized } from '../utils/response.js';
import { getCorsHeaders, handlePreflight } from '../utils/cors.js';
import { validateAuth } from '../utils/auth.js';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import {
  generateTokenPair,
  verifyRefreshToken,
  generateDeviceId
} from '../middleware/auth.js';
import { hashToken, getTokenExpiration } from '../utils/tokenUtils.js';
import { body, validationResult } from 'express-validator';
import { createItem } from '../config/database.js';
import emailService from '../services/emailService.js';
import * as logger from '../utils/logger.js';

/**
 * Helper function to run express-validator on Azure Functions request
 */
async function validateRequest(request, validations) {
  const body = await request.json();

  // Create a mock express req/res for validation
  const mockReq = { body };
  const mockRes = {};

  // Run validations
  await Promise.all(validations.map(validation => validation.run(mockReq)));

  const errors = validationResult(mockReq);
  return { body, errors };
}

/**
 * Generate device ID for Azure Functions request
 * Azure Functions doesn't have req.connection, so we create a compatible object
 */
function getDeviceIdForAzureFunction(request) {
  const mockReq = {
    headers: Object.fromEntries(request.headers.entries()),
    connection: {
      remoteAddress: request.headers.get('x-forwarded-for') || 'unknown'
    },
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  };
  return generateDeviceId(mockReq);
}

// ==================== REGISTER ====================
app.http('authRegister', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/register',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      // Validation rules
      const validations = [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
        body('organizationName').trim().notEmpty().withMessage('Organization name is required')
      ];

      const { body: reqBody, errors: validationErrors } = await validateRequest(request, validations);

      if (!validationErrors.isEmpty()) {
        return {
          ...badRequest('Validation failed'),
          jsonBody: {
            success: false,
            error: 'Validation failed',
            details: validationErrors.array()
          },
          headers: getCorsHeaders(origin)
        };
      }

      const { email, password, firstName, lastName, organizationName } = reqBody;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return {
          ...error('User already exists', 409),
          headers: getCorsHeaders(origin)
        };
      }

      // Create organization first
      const organization = await Organization.create({
        name: organizationName,
        ownerEmail: email,
        plan: 'free'
      });

      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        organizationId: organization.id,
        role: 'owner',
        permissions: {
          canCreateAssessments: true,
          canViewReports: true,
          canManageTeam: true,
          canManageBilling: true
        }
      });

      // Update organization with owner ID
      await Organization.update(organization.id, {
        'metadata.ownerId': user.id
      });

      // Generate access and refresh tokens
      const deviceId = getDeviceIdForAzureFunction(request);
      const tokens = generateTokenPair(user, deviceId);

      // Store hashed refresh token in database
      const refreshTokenExpiry = getTokenExpiration(tokens.refreshToken);
      await User.addRefreshToken(
        user.id,
        user.organizationId,
        hashToken(tokens.refreshToken),
        deviceId,
        refreshTokenExpiry
      );

      logger.info('User registered successfully', { email, organizationId: organization.id });

      return {
        ...created({
          user,
          organization,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }, 'Registration successful'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Registration error', { error: err.message, stack: err.stack });
      return {
        ...error(err.message, 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== LOGIN ====================
app.http('authLogin', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      // Validation rules
      const validations = [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required')
      ];

      const { body: reqBody, errors: validationErrors } = await validateRequest(request, validations);

      if (!validationErrors.isEmpty()) {
        return {
          ...badRequest('Validation failed'),
          jsonBody: {
            success: false,
            error: 'Validation failed',
            details: validationErrors.array()
          },
          headers: getCorsHeaders(origin)
        };
      }

      const { email, password } = reqBody;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return {
          ...unauthorized('Invalid email or password'),
          headers: getCorsHeaders(origin)
        };
      }

      // Check if user has a password (not an Auth0/SSO user)
      if (!user.passwordHash) {
        return {
          ...unauthorized('This account uses SSO authentication. Please sign in with Auth0.'),
          headers: getCorsHeaders(origin)
        };
      }

      // Verify password
      const isValidPassword = await User.comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        return {
          ...unauthorized('Invalid email or password'),
          headers: getCorsHeaders(origin)
        };
      }

      // Check if user is active
      if (user.status !== 'active') {
        return {
          status: 403,
          jsonBody: {
            success: false,
            error: 'Your account has been deactivated'
          },
          headers: getCorsHeaders(origin)
        };
      }

      // Update last login
      await User.updateLastLogin(user.id, user.organizationId);

      // Get organization
      const organization = await Organization.findById(user.organizationId);

      // Remove password hash from user object
      const { passwordHash: _, ...userWithoutPassword } = user;

      // Generate access and refresh tokens
      const deviceId = getDeviceIdForAzureFunction(request);
      const tokens = generateTokenPair(userWithoutPassword, deviceId);

      // Store hashed refresh token in database
      const refreshTokenExpiry = getTokenExpiration(tokens.refreshToken);
      await User.addRefreshToken(
        user.id,
        user.organizationId,
        hashToken(tokens.refreshToken),
        deviceId,
        refreshTokenExpiry
      );

      logger.info('User logged in successfully', { email });

      return {
        ...success({
          user: userWithoutPassword,
          organization,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }, 'Login successful'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Login error', { error: err.message });
      return {
        ...error(err.message, 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== GET CURRENT USER ====================
app.http('authMe', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    // Protected endpoint - validate auth
    const authResult = await validateAuth(request);
    if (!authResult.valid) {
      return {
        ...authResult.response,
        headers: getCorsHeaders(origin)
      };
    }

    try {
      const organization = await Organization.findById(authResult.user.organizationId);

      return {
        ...success({
          user: authResult.user,
          organization
        }),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Get current user error', { error: err.message });
      return {
        ...error(err.message, 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== REFRESH TOKEN ====================
app.http('authRefresh', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/refresh',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      const reqBody = await request.json();
      const { refreshToken: token } = reqBody;

      if (!token) {
        return {
          ...badRequest('Refresh token required'),
          jsonBody: {
            success: false,
            error: 'Refresh token required',
            code: 'NO_REFRESH_TOKEN'
          },
          headers: getCorsHeaders(origin)
        };
      }

      // Verify refresh token JWT signature
      const decoded = verifyRefreshToken(token);
      if (!decoded) {
        return {
          ...unauthorized('Invalid refresh token'),
          jsonBody: {
            success: false,
            error: 'Invalid refresh token',
            code: 'INVALID_REFRESH_TOKEN'
          },
          headers: getCorsHeaders(origin)
        };
      }

      // Check if refresh token exists in database
      const tokenHash = hashToken(token);
      const isValid = await User.verifyRefreshToken(
        decoded.userId,
        decoded.organizationId,
        tokenHash
      );

      if (!isValid) {
        return {
          ...unauthorized('Refresh token not found'),
          jsonBody: {
            success: false,
            error: 'Refresh token has been revoked',
            code: 'REFRESH_TOKEN_REVOKED'
          },
          headers: getCorsHeaders(origin)
        };
      }

      // Get user from database
      const user = await User.findById(decoded.userId, decoded.organizationId);
      if (!user) {
        return {
          ...unauthorized('User not found'),
          jsonBody: {
            success: false,
            error: 'User not found',
            code: 'USER_NOT_FOUND'
          },
          headers: getCorsHeaders(origin)
        };
      }

      // Check if user is active
      if (user.status !== 'active') {
        return {
          status: 403,
          jsonBody: {
            success: false,
            error: 'Your account has been deactivated',
            code: 'ACCOUNT_INACTIVE'
          },
          headers: getCorsHeaders(origin)
        };
      }

      // Remove old refresh token
      await User.removeRefreshToken(decoded.userId, decoded.organizationId, tokenHash);

      // Generate new token pair (token rotation)
      const deviceId = decoded.deviceId || getDeviceIdForAzureFunction(request);
      const { passwordHash: _, refreshTokens: __, ...userWithoutSensitiveData } = user;
      const tokens = generateTokenPair(userWithoutSensitiveData, deviceId);

      // Store new hashed refresh token
      const refreshTokenExpiry = getTokenExpiration(tokens.refreshToken);
      await User.addRefreshToken(
        user.id,
        user.organizationId,
        hashToken(tokens.refreshToken),
        deviceId,
        refreshTokenExpiry
      );

      // Get organization for session storage
      const organization = await Organization.findById(user.organizationId);

      return {
        ...success({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: userWithoutSensitiveData,
          organization
        }, 'Token refreshed successfully'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Refresh token error', { error: err.message });
      return {
        ...error(err.message, 500),
        jsonBody: {
          success: false,
          error: 'Token refresh failed',
          code: 'REFRESH_ERROR'
        },
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== LOGOUT ====================
app.http('authLogout', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/logout',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      const reqBody = await request.json();
      const { refreshToken: token } = reqBody;

      if (!token) {
        // Client-side only logout (no token to revoke)
        return {
          ...success(null, 'Logout successful'),
          headers: getCorsHeaders(origin)
        };
      }

      // Verify and decode refresh token
      const decoded = verifyRefreshToken(token);
      if (decoded) {
        // Remove refresh token from database
        const tokenHash = hashToken(token);
        await User.removeRefreshToken(
          decoded.userId,
          decoded.organizationId,
          tokenHash
        );
      }

      return {
        ...success(null, 'Logout successful'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Logout error', { error: err.message });
      // Don't fail logout even if there's an error
      return {
        ...success(null, 'Logout successful'),
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== LOGOUT ALL ====================
app.http('authLogoutAll', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/logout-all',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    // Protected endpoint - validate auth
    const authResult = await validateAuth(request);
    if (!authResult.valid) {
      return {
        ...authResult.response,
        headers: getCorsHeaders(origin)
      };
    }

    try {
      const userId = authResult.user.id;
      const organizationId = authResult.user.organizationId;

      // Remove all refresh tokens
      await User.removeAllRefreshTokens(userId, organizationId);

      logger.info('User logged out from all devices', { userId });

      return {
        ...success(null, 'Logged out from all devices successfully'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Logout all error', { error: err.message });
      return {
        ...error(err.message, 500),
        jsonBody: {
          success: false,
          error: 'Logout failed',
          code: 'LOGOUT_ALL_ERROR'
        },
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== SYNC AUTH0 ====================
app.http('authSyncAuth0', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/sync-auth0',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      const reqBody = await request.json();
      const { email, auth0Id, name, picture } = reqBody;

      if (!email || !auth0Id) {
        return {
          ...badRequest('email and auth0Id are required'),
          headers: getCorsHeaders(origin)
        };
      }

      // Check if user already exists by email
      let user = await User.findByEmail(email);
      let organization;

      if (user) {
        // User exists, update Auth0 info if needed
        if (!user.auth0Id || user.auth0Id !== auth0Id) {
          user = await User.update(user.id, user.organizationId, {
            auth0Id,
            'profile.avatar': picture || user.profile?.avatar,
            'metadata.lastLogin': new Date().toISOString(),
            'metadata.loginCount': (user.metadata?.loginCount || 0) + 1
          });
        } else {
          // Just update last login
          await User.updateLastLogin(user.id, user.organizationId);
          user = await User.findById(user.id, user.organizationId);
        }

        // Get organization
        organization = await Organization.findById(user.organizationId);
      } else {
        // New user - create organization and user
        const nameParts = name ? name.split(' ') : email.split('@')[0].split('.');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Extract organization name from email domain
        const emailDomain = email.split('@')[1];
        const orgName = emailDomain.split('.')[0].charAt(0).toUpperCase() +
                       emailDomain.split('.')[0].slice(1);

        // Create organization
        organization = await Organization.create({
          name: orgName,
          ownerEmail: email,
          plan: 'free'
        });

        // Create user (without password since Auth0 handles authentication)
        const userObj = {
          id: `user_${auth0Id}`,
          type: 'user',
          organizationId: organization.id,
          email,
          auth0Id,
          passwordHash: null, // No password needed for Auth0 users
          profile: {
            firstName,
            lastName,
            role: 'owner',
            avatar: picture
          },
          permissions: {
            canCreateAssessments: true,
            canViewReports: true,
            canManageTeam: true,
            canManageBilling: true
          },
          status: 'active',
          metadata: {
            lastLogin: new Date().toISOString(),
            loginCount: 1,
            timezone: 'UTC',
            locale: 'en-US'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const createdUser = await createItem(process.env.COSMOS_CONTAINER_USERS || 'users', userObj);
        const { passwordHash: _, ...userWithoutPassword } = createdUser;
        user = userWithoutPassword;

        // Update organization with owner ID
        await Organization.update(organization.id, {
          'metadata.ownerId': user.id
        });
      }

      // Generate JWT tokens for API access
      const deviceId = getDeviceIdForAzureFunction(request);
      const tokens = generateTokenPair(user, deviceId);

      // Store hashed refresh token in database
      const refreshTokenExpiry = getTokenExpiration(tokens.refreshToken);
      await User.addRefreshToken(
        user.id,
        user.organizationId,
        hashToken(tokens.refreshToken),
        deviceId,
        refreshTokenExpiry
      );

      logger.info('Auth0 user synced successfully', { email });

      return {
        ...success({
          user,
          organization,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }, 'User synced successfully'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Auth0 sync error', { error: err.message });
      return {
        ...error(err.message, 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== FORGOT PASSWORD ====================
app.http('authForgotPassword', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/forgot-password',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      // Validation rules
      const validations = [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
      ];

      const { body: reqBody, errors: validationErrors } = await validateRequest(request, validations);

      if (!validationErrors.isEmpty()) {
        return {
          ...badRequest('Validation failed'),
          jsonBody: {
            success: false,
            error: 'Validation failed',
            details: validationErrors.array()
          },
          headers: getCorsHeaders(origin)
        };
      }

      const { email } = reqBody;

      // Find user by email
      const user = await User.findByEmail(email);

      // Always return success (don't reveal if email exists)
      const successMessage = 'If an account exists with this email, a password reset link has been sent';

      if (!user || !user.passwordHash) {
        return {
          ...success(null, successMessage),
          headers: getCorsHeaders(origin)
        };
      }

      // Generate reset token
      const resetToken = await User.generatePasswordResetToken(user.id, user.organizationId);

      // Send password reset email
      try {
        await emailService.sendPasswordResetEmail(user, resetToken);
      } catch (emailError) {
        logger.error('Failed to send password reset email', { error: emailError.message });
        // Don't fail the request if email fails in mock mode
        if (!emailService.mockMode) {
          return {
            ...error('Could not send password reset email. Please try again later.', 500),
            headers: getCorsHeaders(origin)
          };
        }
      }

      return {
        ...success(null, successMessage),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Forgot password error', { error: err.message });
      return {
        ...error(err.message, 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== RESET PASSWORD ====================
app.http('authResetPassword', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/reset-password',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      // Validation rules
      const validations = [
        body('token').notEmpty().withMessage('Reset token is required'),
        body('password')
          .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
          .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
          .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
          .matches(/[0-9]/).withMessage('Password must contain at least one number')
      ];

      const { body: reqBody, errors: validationErrors } = await validateRequest(request, validations);

      if (!validationErrors.isEmpty()) {
        return {
          ...badRequest('Validation failed'),
          jsonBody: {
            success: false,
            error: 'Validation failed',
            details: validationErrors.array()
          },
          headers: getCorsHeaders(origin)
        };
      }

      const { token, password } = reqBody;

      // Reset password using token
      const user = await User.resetPassword(token, password);

      if (!user) {
        return {
          ...badRequest('This password reset link is invalid or has expired. Please request a new one.'),
          headers: getCorsHeaders(origin)
        };
      }

      // Send confirmation email
      try {
        await emailService.sendPasswordChangedEmail(user);
      } catch (emailError) {
        logger.error('Failed to send password changed email', { error: emailError.message });
        // Don't fail the request if email fails
      }

      return {
        ...success({ user }, 'Password reset successful'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Reset password error', { error: err.message });
      return {
        ...error(err.message, 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});

// ==================== CHANGE PASSWORD ====================
app.http('authChangePassword', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/change-password',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    // Protected endpoint - validate auth
    const authResult = await validateAuth(request);
    if (!authResult.valid) {
      return {
        ...authResult.response,
        headers: getCorsHeaders(origin)
      };
    }

    try {
      // Validation rules
      const validations = [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword')
          .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
          .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
          .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
          .matches(/[0-9]/).withMessage('New password must contain at least one number')
      ];

      const { body: reqBody, errors: validationErrors } = await validateRequest(request, validations);

      if (!validationErrors.isEmpty()) {
        return {
          ...badRequest('Validation failed'),
          jsonBody: {
            success: false,
            error: 'Validation failed',
            details: validationErrors.array()
          },
          headers: getCorsHeaders(origin)
        };
      }

      const { currentPassword, newPassword } = reqBody;
      const userId = authResult.user.id;
      const organizationId = authResult.user.organizationId;

      // Check if current and new passwords are the same
      if (currentPassword === newPassword) {
        return {
          ...badRequest('New password must be different from current password'),
          headers: getCorsHeaders(origin)
        };
      }

      // Change password
      const user = await User.changePassword(
        userId,
        organizationId,
        currentPassword,
        newPassword
      );

      if (!user) {
        return {
          ...unauthorized('Current password is incorrect'),
          headers: getCorsHeaders(origin)
        };
      }

      // Send confirmation email
      try {
        await emailService.sendPasswordChangedEmail(user);
      } catch (emailError) {
        logger.error('Failed to send password changed email', { error: emailError.message });
        // Don't fail the request if email fails
      }

      // Logout from all other devices for security
      await User.removeAllRefreshTokens(userId, organizationId);

      logger.info('Password changed successfully', { userId });

      return {
        ...success({ user }, 'Password changed successfully'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      logger.error('Change password error', { error: err.message });
      return {
        ...error(err.message, 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});
