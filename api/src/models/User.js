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
   * Convert to JSON (without sensitive data)
   */
  toJSON() {
    const { passwordHash: _, refreshTokens: __, ...user } = this;
    return user;
  }
}
