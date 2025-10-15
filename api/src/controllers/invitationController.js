import Invitation from '../models/Invitation.js';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler.js';

/**
 * Create and send invitation
 * POST /api/invitations
 */
export const createInvitation = asyncHandler(async (req, res) => {
  const { email, role, firstName, lastName, title, department, message } = req.body;
  const inviterId = req.user.id;
  const organizationId = req.user.organizationId;

  // Validate required fields
  if (!email) {
    throw new ValidationError('Email is required');
  }

  // Check if inviter has permission to invite users
  const inviter = await User.findById(inviterId, organizationId);
  if (!inviter || !['ceo', 'admin', 'executive'].includes(inviter.role)) {
    throw new AuthorizationError('You do not have permission to invite users');
  }

  // Check if user already exists in the organization
  const existingUser = await User.findByEmail(email);
  if (existingUser && existingUser.organizationId === organizationId) {
    throw new ValidationError('User already exists in this organization');
  }

  // Check if there's already a pending invitation
  const existingInvitations = await Invitation.findByEmail(email, organizationId);
  const pendingInvitation = existingInvitations.find(inv =>
    inv.status === 'pending' && new Date(inv.expiresAt) > new Date()
  );

  if (pendingInvitation) {
    throw new ValidationError('A pending invitation already exists for this email');
  }

  // Get organization details
  const organization = await Organization.findById(organizationId);

  // Create invitation
  const invitation = await Invitation.create({
    organizationId,
    email,
    role: role || 'member',
    invitedBy: inviterId,
    invitedByName: inviter.profile.fullName,
    firstName,
    lastName,
    title,
    department,
    message
  });

  // TODO: Send invitation email
  // For now, we'll just return the invitation with the token
  // In production, you would send an email with a link containing the token

  res.status(201).json({
    message: 'Invitation created successfully',
    invitation: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      invitationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invitation?token=${invitation.token}`,
      token: invitation.token // In production, only send via email
    }
  });
});

/**
 * Get all invitations for organization
 * GET /api/invitations
 */
export const getInvitations = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const { status } = req.query;

  // Check if user has permission to view invitations
  const user = await User.findById(req.user.id, organizationId);
  if (!user || !['ceo', 'admin', 'executive'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to view invitations');
  }

  // Clean up expired invitations first
  await Invitation.cleanupExpired(organizationId);

  // Get invitations
  const invitations = await Invitation.findByOrganization(organizationId, status);

  res.json({
    invitations: invitations.map(inv => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      invitedBy: inv.invitedByName,
      firstName: inv.metadata?.firstName,
      lastName: inv.metadata?.lastName,
      title: inv.metadata?.title,
      department: inv.metadata?.department,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      acceptedAt: inv.acceptedAt
    })),
    count: invitations.length
  });
});

/**
 * Get invitation by token (public endpoint)
 * GET /api/invitations/by-token/:token
 */
export const getInvitationByToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const invitation = await Invitation.findByToken(token);

  if (!invitation) {
    throw new NotFoundError('Invitation');
  }

  if (!Invitation.isValid(invitation)) {
    return res.status(400).json({
      error: 'Invalid invitation',
      message: invitation.status === 'accepted'
        ? 'This invitation has already been accepted'
        : invitation.status === 'revoked'
        ? 'This invitation has been revoked'
        : 'This invitation has expired'
    });
  }

  // Get organization details
  const organization = await Organization.findById(invitation.organizationId);

  res.json({
    invitation: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      organization: {
        id: organization.id,
        name: organization.name,
        industry: organization.industry
      },
      invitedBy: invitation.invitedByName,
      firstName: invitation.metadata?.firstName,
      lastName: invitation.metadata?.lastName,
      title: invitation.metadata?.title,
      department: invitation.metadata?.department,
      message: invitation.metadata?.message,
      expiresAt: invitation.expiresAt
    }
  });
});

/**
 * Accept invitation
 * POST /api/invitations/:invitationId/accept
 */
export const acceptInvitation = asyncHandler(async (req, res) => {
  const { invitationId } = req.params;
  const { token } = req.body;

  // Find invitation by token
  const invitation = await Invitation.findByToken(token);

  if (!invitation || invitation.id !== invitationId) {
    throw new NotFoundError('Invitation');
  }

  if (!Invitation.isValid(invitation)) {
    throw new ValidationError(
      invitation.status === 'accepted'
        ? 'This invitation has already been accepted'
        : invitation.status === 'revoked'
        ? 'This invitation has been revoked'
        : 'This invitation has expired'
    );
  }

  // Check if user already exists
  let user = await User.findByEmail(invitation.email);

  if (user) {
    // User exists, but might be in different organization
    if (user.organizationId === invitation.organizationId) {
      // Already in this organization, just mark invitation as accepted
      await Invitation.accept(invitation.id, invitation.organizationId, user.id);

      return res.json({
        message: 'Invitation accepted',
        user: {
          id: user.id,
          email: user.email,
          organizationId: user.organizationId
        }
      });
    } else {
      throw new ValidationError('This email is already associated with another organization');
    }
  }

  // User doesn't exist, return info needed to complete registration
  // The actual user creation will happen during Auth0 signup + sync
  res.json({
    message: 'Invitation is valid',
    requiresSignup: true,
    invitation: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      organizationId: invitation.organizationId,
      firstName: invitation.metadata?.firstName,
      lastName: invitation.metadata?.lastName,
      title: invitation.metadata?.title,
      department: invitation.metadata?.department
    }
  });
});

/**
 * Revoke invitation
 * DELETE /api/invitations/:invitationId
 */
export const revokeInvitation = asyncHandler(async (req, res) => {
  const { invitationId } = req.params;
  const organizationId = req.user.organizationId;

  // Check if user has permission
  const user = await User.findById(req.user.id, organizationId);
  if (!user || !['ceo', 'admin', 'executive'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to revoke invitations');
  }

  const invitation = await Invitation.findById(invitationId, organizationId);

  if (!invitation) {
    throw new NotFoundError('Invitation');
  }

  await Invitation.revoke(invitationId, organizationId);

  res.json({
    message: 'Invitation revoked successfully'
  });
});

/**
 * Resend invitation
 * POST /api/invitations/:invitationId/resend
 */
export const resendInvitation = asyncHandler(async (req, res) => {
  const { invitationId } = req.params;
  const organizationId = req.user.organizationId;

  // Check if user has permission
  const user = await User.findById(req.user.id, organizationId);
  if (!user || !['ceo', 'admin', 'executive'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to resend invitations');
  }

  const invitation = await Invitation.findById(invitationId, organizationId);

  if (!invitation) {
    throw new NotFoundError('Invitation');
  }

  if (invitation.status !== 'pending') {
    throw new ValidationError('Only pending invitations can be resent');
  }

  // TODO: Send invitation email again
  // For now, just return the invitation URL

  res.json({
    message: 'Invitation resent successfully',
    invitationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invitation?token=${invitation.token}`
  });
});

export default {
  createInvitation,
  getInvitations,
  getInvitationByToken,
  acceptInvitation,
  revokeInvitation,
  resendInvitation
};
