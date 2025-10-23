import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { createItem, queryItems, getItemById, updateItem } from '../config/database.js';

const CONTAINER_NAME = process.env.COSMOS_CONTAINER_USERS || 'users';

export class User {
  constructor(data) {
    this.id = data.id || `user_${uuidv4()}`;
    this.type = 'user';
    this.organizationId = data.organizationId;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.profile = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: data.role || 'member',
      avatar: data.avatar || null
    };
    this.permissions = data.permissions || {
      canCreateAssessments: false,
      canViewReports: true,
      canManageTeam: false,
      canManageBilling: false
    };
    this.status = data.status || 'active';
    this.metadata = {
      lastLogin: data.lastLogin || null,
      loginCount: data.loginCount || 0,
      timezone: data.timezone || 'UTC',
      locale: data.locale || 'en-US'
    };
    // Refresh token storage (stores hashed tokens)
    this.refreshTokens = data.refreshTokens || [];
    // Password reset token fields
    this.passwordResetToken = data.passwordResetToken || null;
    this.passwordResetExpires = data.passwordResetExpires || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Hash password
   */
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Create a new user
   */
  static async create(userData) {
    // Hash password
    const passwordHash = await User.hashPassword(userData.password);

    const user = new User({
      ...userData,
      passwordHash
    });

    // Convert to plain object for Cosmos DB
    const userObj = JSON.parse(JSON.stringify(user));
    const created = await createItem(CONTAINER_NAME, userObj);

    // Remove password hash from returned object
    const { passwordHash: _, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM c WHERE c.email = @email AND c.type = "user"';
    const parameters = [{ name: '@email', value: email }];
    const users = await queryItems(CONTAINER_NAME, query, parameters);
    return users[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(userId, organizationId) {
    return getItemById(CONTAINER_NAME, userId, organizationId);
  }

  /**
   * Update user
   */
  static async update(userId, organizationId, updates) {
    const updated = await updateItem(CONTAINER_NAME, userId, organizationId, updates);
    const { passwordHash: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  /**
   * Update last login
   */
  static async updateLastLogin(userId, organizationId) {
    const user = await User.findById(userId, organizationId);
    if (!user) return null;

    return User.update(userId, organizationId, {
      'metadata.lastLogin': new Date().toISOString(),
      'metadata.loginCount': (user.metadata?.loginCount || 0) + 1
    });
  }

  /**
   * Get all users in organization
   */
  static async findByOrganization(organizationId) {
    const query = 'SELECT * FROM c WHERE c.organizationId = @orgId AND c.type = "user"';
    const parameters = [{ name: '@orgId', value: organizationId }];
    const users = await queryItems(CONTAINER_NAME, query, parameters);

    // Remove password hashes
    return users.map(({ passwordHash: _, ...user }) => user);
  }

  /**
   * Add refresh token to user
   * @param {string} tokenHash - Hashed refresh token
   * @param {string} deviceId - Device identifier
   * @param {number} expiresAt - Token expiration timestamp
   */
  static async addRefreshToken(userId, organizationId, tokenHash, deviceId, expiresAt) {
    const user = await User.findById(userId, organizationId);
    if (!user) return null;

    const refreshTokens = user.refreshTokens || [];

    // Add new token
    refreshTokens.push({
      tokenHash,
      deviceId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      lastUsedAt: new Date().toISOString()
    });

    // Keep only the last 5 refresh tokens per user (limit active sessions)
    const limitedTokens = refreshTokens.slice(-5);

    return User.update(userId, organizationId, {
      refreshTokens: limitedTokens,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Verify refresh token exists and is valid
   * @param {string} userId - User ID
   * @param {string} organizationId - Organization ID
   * @param {string} tokenHash - Hashed refresh token
   * @returns {boolean} True if token is valid
   */
  static async verifyRefreshToken(userId, organizationId, tokenHash) {
    const user = await User.findById(userId, organizationId);
    if (!user) return false;

    const refreshTokens = user.refreshTokens || [];
    const token = refreshTokens.find(t => t.tokenHash === tokenHash);

    if (!token) return false;

    // Check if token is expired
    const expiresAt = new Date(token.expiresAt).getTime();
    if (Date.now() > expiresAt) {
      // Remove expired token
      await User.removeRefreshToken(userId, organizationId, tokenHash);
      return false;
    }

    // Update last used timestamp
    const updatedTokens = refreshTokens.map(t =>
      t.tokenHash === tokenHash
        ? { ...t, lastUsedAt: new Date().toISOString() }
        : t
    );

    await User.update(userId, organizationId, {
      refreshTokens: updatedTokens,
      updatedAt: new Date().toISOString()
    });

    return true;
  }

  /**
   * Remove specific refresh token (logout from single device)
   * @param {string} userId - User ID
   * @param {string} organizationId - Organization ID
   * @param {string} tokenHash - Hashed refresh token
   */
  static async removeRefreshToken(userId, organizationId, tokenHash) {
    const user = await User.findById(userId, organizationId);
    if (!user) return null;

    const refreshTokens = (user.refreshTokens || []).filter(
      t => t.tokenHash !== tokenHash
    );

    return User.update(userId, organizationId, {
      refreshTokens,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Remove all refresh tokens (logout from all devices)
   * @param {string} userId - User ID
   * @param {string} organizationId - Organization ID
   */
  static async removeAllRefreshTokens(userId, organizationId) {
    return User.update(userId, organizationId, {
      refreshTokens: [],
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Clean up expired refresh tokens
   * @param {string} userId - User ID
   * @param {string} organizationId - Organization ID
   */
  static async cleanExpiredTokens(userId, organizationId) {
    const user = await User.findById(userId, organizationId);
    if (!user) return null;

    const now = Date.now();
    const validTokens = (user.refreshTokens || []).filter(token => {
      const expiresAt = new Date(token.expiresAt).getTime();
      return now < expiresAt;
    });

    if (validTokens.length !== user.refreshTokens.length) {
      return User.update(userId, organizationId, {
        refreshTokens: validTokens,
        updatedAt: new Date().toISOString()
      });
    }

    return user;
  }

  /**
   * Generate password reset token
   * @param {string} userId - User ID
   * @param {string} organizationId - Organization ID
   * @returns {string} - Reset token (unhashed, to be sent via email)
   */
  static async generatePasswordResetToken(userId, organizationId) {
    const user = await User.findById(userId, organizationId);
    if (!user) return null;

    // Generate random token (32 bytes = 64 hex characters)
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing
    const hashedToken = await User.hashPassword(resetToken);

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await User.update(userId, organizationId, {
      passwordResetToken: hashedToken,
      passwordResetExpires: expiresAt,
      updatedAt: new Date().toISOString()
    });

    // Return unhashed token to be sent via email
    return resetToken;
  }

  /**
   * Find user by password reset token
   * @param {string} resetToken - Unhashed reset token from email
   * @returns {Object|null} - User object if token is valid
   */
  static async findByResetToken(resetToken) {
    // Query all users (we need to check hashed tokens)
    const query = 'SELECT * FROM c WHERE c.type = "user" AND c.passwordResetToken != null AND c.passwordResetExpires != null';
    const users = await queryItems(CONTAINER_NAME, query);

    // Find user with matching token hash
    for (const user of users) {
      // Check if token is expired
      const expiresAt = new Date(user.passwordResetExpires).getTime();
      if (Date.now() > expiresAt) {
        continue;
      }

      // Compare token with stored hash
      const isValid = await User.comparePassword(resetToken, user.passwordResetToken);
      if (isValid) {
        return user;
      }
    }

    return null;
  }

  /**
   * Reset password using reset token
   * @param {string} resetToken - Unhashed reset token from email
   * @param {string} newPassword - New password
   * @returns {Object|null} - Updated user object or null if token invalid
   */
  static async resetPassword(resetToken, newPassword) {
    const user = await User.findByResetToken(resetToken);
    if (!user) return null;

    // Hash new password
    const passwordHash = await User.hashPassword(newPassword);

    // Update password and clear reset token
    const updated = await User.update(user.id, user.organizationId, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      updatedAt: new Date().toISOString()
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  /**
   * Change password (requires current password verification)
   * @param {string} userId - User ID
   * @param {string} organizationId - Organization ID
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password
   * @returns {Object|null} - Updated user object or null if current password invalid
   */
  static async changePassword(userId, organizationId, currentPassword, newPassword) {
    const user = await User.findById(userId, organizationId);
    if (!user) return null;

    // Verify current password
    const isValid = await User.comparePassword(currentPassword, user.passwordHash);
    if (!isValid) return null;

    // Hash new password
    const passwordHash = await User.hashPassword(newPassword);

    // Update password
    const updated = await User.update(userId, organizationId, {
      passwordHash,
      updatedAt: new Date().toISOString()
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  /**
   * Clear password reset token (cleanup)
   * @param {string} userId - User ID
   * @param {string} organizationId - Organization ID
   */
  static async clearPasswordResetToken(userId, organizationId) {
    return User.update(userId, organizationId, {
      passwordResetToken: null,
      passwordResetExpires: null,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Convert to JSON (without sensitive data)
   */
  toJSON() {
    const { passwordHash: _, refreshTokens: __, passwordResetToken: ___, ...user } = this;
    return user;
  }
}
