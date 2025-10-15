import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler.js';

/**
 * Get current organization
 * GET /api/organizations/me
 */
export const getCurrentOrganization = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;

  const organization = await Organization.findById(organizationId);

  if (!organization) {
    throw new NotFoundError('Organization');
  }

  // Get member count
  const users = await User.findByOrganization(organizationId);
  const activeUsers = users.filter(u => u.status === 'active');

  res.json({
    organization: {
      ...organization,
      memberCount: activeUsers.length,
      totalMembers: users.length
    }
  });
});

/**
 * Update organization
 * PATCH /api/organizations/me
 */
export const updateOrganization = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const updates = req.body;

  // Check if user has permission (only CEO and admins)
  const user = await User.findById(req.user.id, organizationId);
  if (!user || !['ceo', 'admin'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to update organization settings');
  }

  // Prevent updating sensitive fields
  delete updates.id;
  delete updates.plan;
  delete updates.subscription;
  delete updates.ownerEmail;

  const updatedOrganization = await Organization.update(organizationId, updates);

  res.json({
    message: 'Organization updated successfully',
    organization: updatedOrganization
  });
});

/**
 * Get organization statistics
 * GET /api/organizations/stats
 */
export const getOrganizationStats = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new NotFoundError('Organization');
  }

  // Get users
  const users = await User.findByOrganization(organizationId);
  const activeUsers = users.filter(u => u.status === 'active');

  // Count by role
  const roleCount = {};
  users.forEach(user => {
    roleCount[user.role] = (roleCount[user.role] || 0) + 1;
  });

  // Count by department
  const departmentCount = {};
  users.forEach(user => {
    const dept = user.profile?.department || 'Unassigned';
    departmentCount[dept] = (departmentCount[dept] || 0) + 1;
  });

  // Get assessments (would need to import Assessment model)
  // For now, return basic stats
  const stats = {
    organization: {
      id: organization.id,
      name: organization.name,
      plan: organization.plan,
      createdAt: organization.createdAt
    },
    users: {
      total: users.length,
      active: activeUsers.length,
      inactive: users.length - activeUsers.length,
      byRole: roleCount,
      byDepartment: departmentCount
    },
    lastUpdated: new Date().toISOString()
  };

  res.json({ stats });
});

/**
 * Update organization settings
 * PATCH /api/organizations/settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const { settings } = req.body;

  // Check if user has permission
  const user = await User.findById(req.user.id, organizationId);
  if (!user || !['ceo', 'admin'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to update organization settings');
  }

  const updatedOrganization = await Organization.update(organizationId, {
    settings: {
      ...settings
    }
  });

  res.json({
    message: 'Settings updated successfully',
    settings: updatedOrganization.settings
  });
});

export default {
  getCurrentOrganization,
  updateOrganization,
  getOrganizationStats,
  updateSettings
};
