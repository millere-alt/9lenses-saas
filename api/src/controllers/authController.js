import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { generateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { createItem } from '../config/database.js';

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

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      user,
      organization,
      token
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

    // Debug: Check if passwordHash exists
    console.log('User found:', user.email);
    console.log('Password hash exists:', !!user.passwordHash);
    console.log('User object keys:', Object.keys(user));

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

    // Generate token
    const token = generateToken(userWithoutPassword);

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      organization,
      token
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
 * Logout user (client-side token removal)
 */
export async function logout(req, res) {
  res.json({
    message: 'Logout successful'
  });
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

    // Generate JWT token for API access
    const token = generateToken(user);

    res.json({
      message: 'User synced successfully',
      user,
      organization,
      token
    });
  } catch (error) {
    console.error('Auth0 sync error:', error);
    res.status(500).json({
      error: 'Failed to sync user',
      message: error.message
    });
  }
}
