import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { generateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

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
