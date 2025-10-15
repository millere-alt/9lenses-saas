import { createItem, queryItems, getItemById, updateItem, deleteItem } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const CONTAINER_NAME = 'invitations';

/**
 * Invitation Model
 * Manages user invitations for organizations
 */
export class Invitation {
  /**
   * Create a new invitation
   */
  static async create(invitationData) {
    const invitationId = `invitation_${uuidv4()}`;
    const token = crypto.randomBytes(32).toString('hex');

    const invitation = {
      id: invitationId,
      type: 'invitation',
      organizationId: invitationData.organizationId,
      email: invitationData.email,
      role: invitationData.role || 'member',
      invitedBy: invitationData.invitedBy, // User ID of inviter
      invitedByName: invitationData.invitedByName || '',
      token,
      status: 'pending', // pending, accepted, expired, revoked
      expiresAt: invitationData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      metadata: {
        firstName: invitationData.firstName || '',
        lastName: invitationData.lastName || '',
        title: invitationData.title || '',
        department: invitationData.department || '',
        message: invitationData.message || ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await createItem(CONTAINER_NAME, invitation);
  }

  /**
   * Find invitation by ID
   */
  static async findById(invitationId, organizationId) {
    return await getItemById(CONTAINER_NAME, invitationId, organizationId);
  }

  /**
   * Find invitation by token
   */
  static async findByToken(token) {
    const query = `SELECT * FROM c WHERE c.token = @token AND c.type = 'invitation'`;
    const parameters = [{ name: '@token', value: token }];
    const invitations = await queryItems(CONTAINER_NAME, query, parameters);
    return invitations.length > 0 ? invitations[0] : null;
  }

  /**
   * Find invitation by email and organization
   */
  static async findByEmail(email, organizationId) {
    const query = `
      SELECT * FROM c
      WHERE c.email = @email
      AND c.organizationId = @organizationId
      AND c.type = 'invitation'
      ORDER BY c.createdAt DESC
    `;
    const parameters = [
      { name: '@email', value: email },
      { name: '@organizationId', value: organizationId }
    ];
    return await queryItems(CONTAINER_NAME, query, parameters);
  }

  /**
   * Get all pending invitations for an organization
   */
  static async findPendingByOrganization(organizationId) {
    const query = `
      SELECT * FROM c
      WHERE c.organizationId = @organizationId
      AND c.type = 'invitation'
      AND c.status = 'pending'
      AND c.expiresAt > @now
      ORDER BY c.createdAt DESC
    `;
    const parameters = [
      { name: '@organizationId', value: organizationId },
      { name: '@now', value: new Date().toISOString() }
    ];
    return await queryItems(CONTAINER_NAME, query, parameters);
  }

  /**
   * Get all invitations for an organization (any status)
   */
  static async findByOrganization(organizationId, status = null) {
    let query = `
      SELECT * FROM c
      WHERE c.organizationId = @organizationId
      AND c.type = 'invitation'
    `;
    const parameters = [{ name: '@organizationId', value: organizationId }];

    if (status) {
      query += ` AND c.status = @status`;
      parameters.push({ name: '@status', value: status });
    }

    query += ` ORDER BY c.createdAt DESC`;

    return await queryItems(CONTAINER_NAME, query, parameters);
  }

  /**
   * Update invitation status
   */
  static async updateStatus(invitationId, organizationId, status, acceptedBy = null) {
    const updates = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (acceptedBy) {
      updates.acceptedBy = acceptedBy;
      updates.acceptedAt = new Date().toISOString();
    }

    return await updateItem(CONTAINER_NAME, invitationId, organizationId, updates);
  }

  /**
   * Revoke invitation
   */
  static async revoke(invitationId, organizationId) {
    return await this.updateStatus(invitationId, organizationId, 'revoked');
  }

  /**
   * Accept invitation
   */
  static async accept(invitationId, organizationId, userId) {
    return await this.updateStatus(invitationId, organizationId, 'accepted', userId);
  }

  /**
   * Delete invitation
   */
  static async delete(invitationId, organizationId) {
    return await deleteItem(CONTAINER_NAME, invitationId, organizationId);
  }

  /**
   * Check if invitation is valid
   */
  static isValid(invitation) {
    if (!invitation) return false;
    if (invitation.status !== 'pending') return false;
    if (new Date(invitation.expiresAt) < new Date()) return false;
    return true;
  }

  /**
   * Clean up expired invitations
   */
  static async cleanupExpired(organizationId) {
    const query = `
      SELECT * FROM c
      WHERE c.organizationId = @organizationId
      AND c.type = 'invitation'
      AND c.status = 'pending'
      AND c.expiresAt < @now
    `;
    const parameters = [
      { name: '@organizationId', value: organizationId },
      { name: '@now', value: new Date().toISOString() }
    ];

    const expiredInvitations = await queryItems(CONTAINER_NAME, query, parameters);

    for (const invitation of expiredInvitations) {
      await this.updateStatus(invitation.id, organizationId, 'expired');
    }

    return expiredInvitations.length;
  }
}

export default Invitation;
