import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler.js';

/**
 * Get current user profile
 * GET /api/users/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const organizationId = req.user.organizationId;

  const user = await User.findById(userId, organizationId);

  if (!user) {
    throw new NotFoundError('User');
  }

  // Get organization details
  const organization = await Organization.findById(organizationId);

  res.json({
    user,
    organization
  });
});

/**
 * Update current user profile
 * PATCH /api/users/me
 */
export const updateCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const organizationId = req.user.organizationId;
  const updates = req.body;

  // Prevent updating sensitive fields
  delete updates.id;
  delete updates.email;
  delete updates.organizationId;
  delete updates.role;
  delete updates.passwordHash;
  delete updates.auth0Id;

  const updatedUser = await User.update(userId, organizationId, updates);

  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

/**
 * Get user by ID (requires proper permissions)
 * GET /api/users/:userId
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user.id;
  const organizationId = req.user.organizationId;

  // Users can only view users in their own organization
  const user = await User.findById(userId, organizationId);

  if (!user) {
    throw new NotFoundError('User');
  }

  res.json({ user });
});

/**
 * Get all users in organization
 * GET /api/users
 */
export const getOrganizationUsers = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const { role, department, status } = req.query;

  // Build filter
  const filter = {};
  if (role) filter.role = role;
  if (department) filter.department = department;
  if (status) filter.status = status;

  const users = await User.findByOrganization(organizationId);

  // Apply filters
  let filteredUsers = users;
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }
  if (department) {
    filteredUsers = filteredUsers.filter(u => u.profile?.department === department);
  }
  if (status) {
    filteredUsers = filteredUsers.filter(u => u.status === status);
  }

  res.json({
    users: filteredUsers,
    count: filteredUsers.length
  });
});

/**
 * Get leadership team
 * GET /api/users/leadership
 */
export const getLeadershipTeam = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;

  const users = await User.findByOrganization(organizationId);

  // Filter for leadership roles
  const leadershipRoles = ['ceo', 'executive', 'chairman'];
  const leadershipTeam = users.filter(user =>
    leadershipRoles.includes(user.role) && user.status === 'active'
  );

  // Sort by role hierarchy
  const roleOrder = { ceo: 0, chairman: 1, executive: 2 };
  leadershipTeam.sort((a, b) => {
    const aOrder = roleOrder[a.role] ?? 999;
    const bOrder = roleOrder[b.role] ?? 999;
    return aOrder - bOrder;
  });

  res.json({
    leadership: leadershipTeam,
    count: leadershipTeam.length
  });
});

/**
 * Update user role (admin only)
 * PATCH /api/users/:userId/role
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const requesterId = req.user.id;
  const organizationId = req.user.organizationId;

  // Check if requester has permission (only CEO and admins)
  const requester = await User.findById(requesterId, organizationId);
  if (!requester || !['ceo', 'admin'].includes(requester.role)) {
    throw new AuthorizationError('You do not have permission to update user roles');
  }

  // Validate role
  const validRoles = ['ceo', 'executive', 'manager', 'member', 'chairman', 'admin'];
  if (!validRoles.includes(role)) {
    throw new ValidationError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  // Prevent CEO from being demoted (unless by another CEO)
  const targetUser = await User.findById(userId, organizationId);
  if (targetUser.role === 'ceo' && requester.role !== 'ceo') {
    throw new AuthorizationError('Only a CEO can change another CEO\'s role');
  }

  // Update role
  const updatedUser = await User.update(userId, organizationId, { role });

  res.json({
    message: 'User role updated successfully',
    user: updatedUser
  });
});

/**
 * Deactivate user (admin only)
 * DELETE /api/users/:userId
 */
export const deactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user.id;
  const organizationId = req.user.organizationId;

  // Check if requester has permission
  const requester = await User.findById(requesterId, organizationId);
  if (!requester || !['ceo', 'admin'].includes(requester.role)) {
    throw new AuthorizationError('You do not have permission to deactivate users');
  }

  // Prevent self-deactivation
  if (userId === requesterId) {
    throw new ValidationError('You cannot deactivate your own account');
  }

  // Prevent deactivating CEO
  const targetUser = await User.findById(userId, organizationId);
  if (targetUser.role === 'ceo') {
    throw new AuthorizationError('Cannot deactivate a CEO account');
  }

  // Deactivate user
  const updatedUser = await User.update(userId, organizationId, {
    status: 'inactive',
    'metadata.deactivatedAt': new Date().toISOString(),
    'metadata.deactivatedBy': requesterId
  });

  res.json({
    message: 'User deactivated successfully',
    user: updatedUser
  });
});

/**
 * Reactivate user (admin only)
 * POST /api/users/:userId/reactivate
 */
export const reactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user.id;
  const organizationId = req.user.organizationId;

  // Check if requester has permission
  const requester = await User.findById(requesterId, organizationId);
  if (!requester || !['ceo', 'admin'].includes(requester.role)) {
    throw new AuthorizationError('You do not have permission to reactivate users');
  }

  // Reactivate user
  const updatedUser = await User.update(userId, organizationId, {
    status: 'active',
    'metadata.reactivatedAt': new Date().toISOString(),
    'metadata.reactivatedBy': requesterId
  });

  res.json({
    message: 'User reactivated successfully',
    user: updatedUser
  });
});

export default {
  getCurrentUser,
  updateCurrentUser,
  getUserById,
  getOrganizationUsers,
  getLeadershipTeam,
  updateUserRole,
  deactivateUser,
  reactivateUser
};
