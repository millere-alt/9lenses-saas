import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import {
  generateTokenPair,
  generateAccessToken,
  verifyRefreshToken,
  generateDeviceId
} from '../middleware/auth.js';
import { hashToken, getTokenExpiration } from '../utils/tokenUtils.js';
import { body, validationResult } from 'express-validator';
import { createItem } from '../config/database.js';
import emailService from '../services/emailService.js';

/**
 * Validation rules for registration
 */
export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('organizationName').trim().notEmpty().withMessage('Organization name is required')
];

/**
 * Validation rules for login
 */
export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * Register a new user and organization
 */
export async function register(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName, organizationName } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
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
    const deviceId = generateDeviceId(req);
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

    res.status(201).json({
      message: 'Registration successful',
      user,
      organization,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
}

/**
 * Login user
 */
export async function login(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Check if user has a password (not an Auth0/SSO user)
    if (!user.passwordHash) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'This account uses SSO authentication. Please sign in with Auth0.'
      });
    }

    // Verify password
    const isValidPassword = await User.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account has been deactivated'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id, user.organizationId);

    // Get organization
    const organization = await Organization.findById(user.organizationId);

    // Remove password hash from user object
    const { passwordHash: _, ...userWithoutPassword } = user;

    // Generate access and refresh tokens
    const deviceId = generateDeviceId(req);
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

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      organization,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(req, res) {
  try {
    const organization = await Organization.findById(req.user.organizationId);

    res.json({
      user: req.user,
      organization
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    });
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(req, res) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Refresh token required',
        message: 'Please provide a refresh token',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    // Verify refresh token JWT signature
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Check if refresh token exists in database
    const tokenHash = hashToken(token);
    const isValid = await User.verifyRefreshToken(
      decoded.userId,
      decoded.organizationId,
      tokenHash
    );

    if (!isValid) {
      return res.status(401).json({
        error: 'Refresh token not found',
        message: 'Refresh token has been revoked or does not exist',
        code: 'REFRESH_TOKEN_REVOKED'
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

    // Remove old refresh token
    await User.removeRefreshToken(decoded.userId, decoded.organizationId, tokenHash);

    // Generate new token pair (token rotation)
    const deviceId = decoded.deviceId || generateDeviceId(req);
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

    res.json({
      message: 'Token refreshed successfully',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userWithoutSensitiveData,
      organization
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: error.message,
      code: 'REFRESH_ERROR'
    });
  }
}

/**
 * Logout user (revoke refresh token for current device)
 */
export async function logout(req, res) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      // Client-side only logout (no token to revoke)
      return res.json({
        message: 'Logout successful'
      });
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

    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    // Don't fail logout even if there's an error
    res.json({
      message: 'Logout successful'
    });
  }
}

/**
 * Logout user from all devices (revoke all refresh tokens)
 */
export async function logoutAll(req, res) {
  try {
    // User is already authenticated by middleware
    const userId = req.user.id;
    const organizationId = req.user.organizationId;

    // Remove all refresh tokens
    await User.removeAllRefreshTokens(userId, organizationId);

    res.json({
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error.message,
      code: 'LOGOUT_ALL_ERROR'
    });
  }
}

/**
 * Sync Auth0 user with Cosmos DB
 * This endpoint is called after Auth0 authentication
 */
export async function syncAuth0User(req, res) {
  try {
    const { email, auth0Id, name, picture } = req.body;

    if (!email || !auth0Id) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'email and auth0Id are required'
      });
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
    const deviceId = generateDeviceId(req);
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

    res.json({
      message: 'User synced successfully',
      user,
      organization,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Auth0 sync error:', error);
    res.status(500).json({
      error: 'Failed to sync user',
      message: error.message
    });
  }
}

/**
 * Validation rules for forgot password
 */
export const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

/**
 * Request password reset
 */
export async function forgotPassword(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);

    // Always return success (don't reveal if email exists)
    // This prevents email enumeration attacks
    if (!user) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    }

    // Check if user has a password (Auth0 users don't)
    if (!user.passwordHash) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = await User.generatePasswordResetToken(user.id, user.organizationId);

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't fail the request if email fails in mock mode
      if (!emailService.mockMode) {
        return res.status(500).json({
          error: 'Failed to send email',
          message: 'Could not send password reset email. Please try again later.'
        });
      }
    }

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Request failed',
      message: error.message
    });
  }
}

/**
 * Validation rules for reset password
 */
export const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
];

/**
 * Reset password using reset token
 */
export async function resetPassword(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { token, password } = req.body;

    // Reset password using token
    const user = await User.resetPassword(token, password);

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired token',
        message: 'This password reset link is invalid or has expired. Please request a new one.'
      });
    }

    // Send confirmation email
    try {
      await emailService.sendPasswordChangedEmail(user);
    } catch (emailError) {
      console.error('Failed to send password changed email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      message: 'Password reset successful',
      user
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      message: error.message
    });
  }
}

/**
 * Validation rules for change password
 */
export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one number')
];

/**
 * Change password (requires current password)
 */
export async function changePassword(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const organizationId = req.user.organizationId;

    // Check if current and new passwords are the same
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'New password must be different from current password'
      });
    }

    // Change password
    const user = await User.changePassword(
      userId,
      organizationId,
      currentPassword,
      newPassword
    );

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Current password is incorrect'
      });
    }

    // Send confirmation email
    try {
      await emailService.sendPasswordChangedEmail(user);
    } catch (emailError) {
      console.error('Failed to send password changed email:', emailError);
      // Don't fail the request if email fails
    }

    // Logout from all other devices for security
    await User.removeAllRefreshTokens(userId, organizationId);

    res.json({
      message: 'Password changed successfully',
      user
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: error.message
    });
  }
}
