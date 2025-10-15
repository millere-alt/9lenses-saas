import { v4 as uuidv4 } from 'uuid';
import { createItem, queryItems, getItemById, updateItem } from '../config/database.js';

const CONTAINER_NAME = process.env.COSMOS_CONTAINER_ORGANIZATIONS || 'organizations';

export class Organization {
  constructor(data) {
    this.id = data.id || `org_${uuidv4()}`;
    this.type = 'organization';
    this.name = data.name;
    this.subscription = {
      plan: data.plan || 'free',
      status: data.subscriptionStatus || 'active',
      currentPeriodStart: data.currentPeriodStart || new Date().toISOString(),
      currentPeriodEnd: data.currentPeriodEnd || null,
      limits: this.getPlanLimits(data.plan || 'free')
    };
    this.billing = {
      email: data.billingEmail || data.ownerEmail || '',
      customerId: data.customerId || null,
      subscriptionId: data.subscriptionId || null
    };
    this.features = {
      aiInsights: data.plan !== 'free',
      exportPdf: true,
      exportCsv: true,
      apiAccess: data.plan === 'enterprise',
      whiteLabel: data.plan === 'enterprise',
      ssoEnabled: data.plan === 'enterprise'
    };
    this.settings = {
      timezone: data.timezone || 'UTC',
      locale: data.locale || 'en-US',
      branding: {
        logo: data.logo || null,
        primaryColor: data.primaryColor || '#1e40af',
        companyName: data.name
      }
    };
    this.metadata = {
      ownerId: data.ownerId,
      industry: data.industry || null,
      size: data.size || null,
      website: data.website || null
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Get plan limits based on subscription tier
   */
  getPlanLimits(plan) {
    const limits = {
      free: { maxUsers: 3, maxAssessments: 5, maxParticipants: 10 },
      starter: { maxUsers: 10, maxAssessments: 50, maxParticipants: 100 },
      professional: { maxUsers: 50, maxAssessments: 500, maxParticipants: 1000 },
      enterprise: { maxUsers: -1, maxAssessments: -1, maxParticipants: -1 } // unlimited
    };
    return limits[plan] || limits.free;
  }

  /**
   * Create a new organization
   */
  static async create(organizationData) {
    const organization = new Organization(organizationData);
    return createItem(CONTAINER_NAME, organization);
  }

  /**
   * Find organization by ID
   */
  static async findById(organizationId) {
    return getItemById(CONTAINER_NAME, organizationId, organizationId);
  }

  /**
   * Find organization by name
   */
  static async findByName(name) {
    const query = 'SELECT * FROM c WHERE c.name = @name AND c.type = "organization"';
    const parameters = [{ name: '@name', value: name }];
    const orgs = await queryItems(CONTAINER_NAME, query, parameters);
    return orgs[0] || null;
  }

  /**
   * Update organization
   */
  static async update(organizationId, updates) {
    return updateItem(CONTAINER_NAME, organizationId, organizationId, updates);
  }

  /**
   * Update subscription plan
   */
  static async updateSubscription(organizationId, plan, subscriptionData = {}) {
    const organization = new Organization({ plan });
    const updates = {
      'subscription.plan': plan,
      'subscription.limits': organization.getPlanLimits(plan),
      'features.aiInsights': plan !== 'free',
      'features.apiAccess': plan === 'enterprise',
      'features.whiteLabel': plan === 'enterprise',
      'features.ssoEnabled': plan === 'enterprise',
      ...subscriptionData
    };
    return Organization.update(organizationId, updates);
  }
}
