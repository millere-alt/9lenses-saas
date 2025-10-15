# 9Vectors Database Schema & Implementation Guide

## 📊 Complete Database Design for Azure Cosmos DB

---

## Table of Contents
1. [Data Modeling Strategy](#data-modeling-strategy)
2. [Collections & Partition Strategy](#collections--partition-strategy)
3. [Schema Definitions](#schema-definitions)
4. [Indexing Strategy](#indexing-strategy)
5. [Query Patterns](#query-patterns)
6. [Data Migration Plan](#data-migration-plan)

---

## Data Modeling Strategy

### Cosmos DB Best Practices

```javascript
// Core Principles:
// 1. Denormalization: Store related data together
// 2. Partition Key: Choose carefully for scale
// 3. Hot Partition Avoidance: Distribute load evenly
// 4. Query Patterns: Design schema for your queries
// 5. Cost Optimization: Minimize RU consumption

// Anti-patterns to Avoid:
// ❌ Cross-partition queries
// ❌ Large documents (>2MB)
// ❌ Unbounded arrays
// ❌ Hot partitions
// ❌ No partition key strategy
```

### Partition Strategy

```javascript
/**
 * Partition Key: /organizationId
 *
 * Why:
 * - Natural tenant boundary
 * - Excellent load distribution
 * - Supports single-partition queries
 * - Enables multi-tenant isolation
 *
 * Considerations:
 * - Max 20GB per partition
 * - Max 10,000 RU/s per partition
 * - Plan for 1,000+ organizations
 */

const PARTITION_KEY = '/organizationId';

// Example partition distribution:
{
  "org_abc123": "20 users, 50 assessments = ~50MB", // Well distributed
  "org_def456": "200 users, 500 assessments = ~500MB", // Still good
  "org_ghi789": "2000 users, 5000 assessments = ~5GB", // Monitor closely
}
```

---

## Collections & Partition Strategy

### Container Structure

```javascript
const CONTAINERS = {
  organizations: {
    partitionKey: '/id',
    defaultTTL: null, // No auto-delete
    indexing: 'consistent',
    throughput: 'autoscale',
    maxRU: 4000
  },

  users: {
    partitionKey: '/organizationId',
    defaultTTL: null,
    indexing: 'consistent',
    throughput: 'shared', // Share with other containers
    uniqueKeys: [['/email']] // Email must be unique globally
  },

  assessments: {
    partitionKey: '/organizationId',
    defaultTTL: null,
    indexing: 'consistent',
    throughput: 'autoscale',
    maxRU: 10000,
    changeFeed: true // Enable for real-time sync
  },

  assessment_responses: {
    partitionKey: '/organizationId',
    defaultTTL: null,
    indexing: 'lazy', // Less frequent writes
    throughput: 'shared'
  },

  documents: {
    partitionKey: '/organizationId',
    defaultTTL: null,
    indexing: 'consistent',
    throughput: 'shared',
    changeFeed: true
  },

  ai_coaching_sessions: {
    partitionKey: '/organizationId',
    defaultTTL: 7776000, // 90 days
    indexing: 'lazy',
    throughput: 'shared'
  },

  metrics: {
    partitionKey: '/organizationId',
    defaultTTL: 2592000, // 30 days for time-series data
    indexing: 'lazy',
    throughput: 'autoscale',
    maxRU: 4000
  },

  audit_logs: {
    partitionKey: '/organizationId',
    defaultTTL: 31536000, // 1 year
    indexing: 'lazy',
    throughput: 'shared'
  }
};
```

---

## Schema Definitions

### 1. Organizations Collection

```typescript
interface Organization {
  id: string; // "org_{uuid}"
  type: "organization";
  name: string;
  slug: string; // URL-friendly identifier
  domain?: string; // Primary email domain
  industry?: string;
  size?: "1-10" | "11-50" | "51-200" | "201-1000" | "1001+";

  status: "trial" | "active" | "suspended" | "cancelled";
  createdAt: string; // ISO 8601
  updatedAt: string;

  // Subscription & Billing
  subscription: {
    plan: "free" | "starter" | "professional" | "enterprise";
    status: "trialing" | "active" | "past_due" | "cancelled";
    trialEndsAt?: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;

    // Stripe Integration
    stripeCustomerId?: string;
    stripePriceId?: string;
    stripeSubscriptionId?: string;

    // Usage Limits
    limits: {
      maxUsers: number;
      maxAssessments: number;
      maxStorageGB: number;
      maxAITokens: number;
    };

    // Current Usage
    usage: {
      users: number;
      assessments: number;
      storageGB: number;
      aiTokens: number;
      lastUpdated: string;
    };
  };

  // Feature Flags
  features: {
    aiCoaching: boolean;
    review360: boolean;
    benchmarking: boolean;
    documentAnalysis: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    sso: boolean;
    advancedAnalytics: boolean;
  };

  // Settings
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;

    // Security
    security: {
      requireMFA: boolean;
      passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
        expiryDays?: number;
      };
      sessionTimeout: number; // minutes
      ipWhitelist?: string[];
    };

    // Branding
    branding?: {
      logo?: string; // Blob URL
      favicon?: string;
      colors: {
        primary: string;
        secondary: string;
        accent: string;
      };
      customDomain?: string;
    };

    // Notifications
    notifications: {
      email: {
        enabled: boolean;
        fromName: string;
        replyTo: string;
      };
      slack?: {
        enabled: boolean;
        webhookUrl: string;
      };
      teams?: {
        enabled: boolean;
        webhookUrl: string;
      };
    };
  };

  // Contacts
  contacts: {
    billing: {
      email: string;
      name?: string;
      phone?: string;
    };
    technical: {
      email: string;
      name?: string;
      phone?: string;
    };
  };

  // Metadata
  metadata: {
    createdBy?: string; // userId
    source: "signup" | "invite" | "import" | "api";
    onboardingCompleted: boolean;
    onboardingSteps?: string[];
    tags?: string[];
    notes?: string;
  };
}

// Example Document
const exampleOrg: Organization = {
  id: "org_abc123def456",
  type: "organization",
  name: "Acme Corporation",
  slug: "acme-corp",
  domain: "acme.com",
  industry: "Technology",
  size: "201-1000",
  status: "active",
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-16T14:30:00.000Z",

  subscription: {
    plan: "professional",
    status: "active",
    currentPeriodStart: "2025-01-15T10:00:00.000Z",
    currentPeriodEnd: "2025-02-15T10:00:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_ABC123",
    stripePriceId: "price_DEF456",
    stripeSubscriptionId: "sub_GHI789",
    limits: {
      maxUsers: 200,
      maxAssessments: 100,
      maxStorageGB: 500,
      maxAITokens: 1000000
    },
    usage: {
      users: 45,
      assessments: 12,
      storageGB: 23.5,
      aiTokens: 45000,
      lastUpdated: "2025-01-16T00:00:00.000Z"
    }
  },

  features: {
    aiCoaching: true,
    review360: true,
    benchmarking: true,
    documentAnalysis: true,
    apiAccess: true,
    customBranding: true,
    sso: true,
    advancedAnalytics: true
  },

  settings: {
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    language: "en",
    security: {
      requireMFA: true,
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        expiryDays: 90
      },
      sessionTimeout: 480,
      ipWhitelist: ["203.0.113.0/24"]
    },
    branding: {
      logo: "https://9vectors.blob.core.windows.net/logos/org_abc123.png",
      colors: {
        primary: "#10b981",
        secondary: "#3b82f6",
        accent: "#f59e0b"
      }
    },
    notifications: {
      email: {
        enabled: true,
        fromName: "Acme 9Vectors",
        replyTo: "noreply@acme.com"
      }
    }
  },

  contacts: {
    billing: {
      email: "billing@acme.com",
      name: "Jane Smith",
      phone: "+1-555-0123"
    },
    technical: {
      email: "it@acme.com",
      name: "John Doe",
      phone: "+1-555-0124"
    }
  },

  metadata: {
    source: "signup",
    onboardingCompleted: true,
    tags: ["enterprise", "technology", "high-value"],
    notes: "VIP customer - executive sponsor is CEO"
  }
};
```

### 2. Users Collection

```typescript
interface User {
  id: string; // "user_{uuid}"
  type: "user";
  organizationId: string; // Partition key

  // Identity
  email: string; // Must be unique
  emailVerified: boolean;
  phone?: string;
  phoneVerified?: boolean;

  // Profile
  firstName: string;
  lastName: string;
  displayName?: string;
  title?: string;
  department?: string;
  location?: string;
  timezone?: string;
  language?: string;
  avatar?: string; // Blob URL
  bio?: string;

  // Authentication
  auth: {
    provider: "azure-ad" | "google" | "microsoft" | "email";
    providerId?: string; // External user ID
    passwordHash?: string; // Only for email auth
    mfaEnabled: boolean;
    mfaMethod?: "totp" | "sms" | "email";
    mfaSecret?: string;
    lastLogin?: string;
    lastPasswordChange?: string;
    passwordResetRequired: boolean;
  };

  // Authorization
  role: "super_admin" | "org_admin" | "manager" | "member" | "viewer";
  permissions: string[]; // Granular permissions
  customPermissions?: {
    [key: string]: boolean;
  };

  // Status
  status: "active" | "invited" | "suspended" | "deleted";
  invitedAt?: string;
  invitedBy?: string;
  activatedAt?: string;
  suspendedAt?: string;
  suspendedReason?: string;
  deletedAt?: string;

  // Preferences
  preferences: {
    notifications: {
      email: {
        assessmentInvites: boolean;
        assessmentReminders: boolean;
        assessmentCompleted: boolean;
        weeklyDigest: boolean;
        productUpdates: boolean;
      };
      inApp: {
        enabled: boolean;
        sound: boolean;
      };
    };
    ui: {
      theme: "light" | "dark" | "auto";
      compactMode: boolean;
      language: string;
    };
  };

  // Activity Tracking
  activity: {
    lastActive?: string;
    assessmentsCompleted: number;
    assessmentsCreated: number;
    documentsUploaded: number;
    aiCoachingSessions: number;
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tags?: string[];
  notes?: string;
}

// Example Document
const exampleUser: User = {
  id: "user_xyz789abc123",
  type: "user",
  organizationId: "org_abc123def456",

  email: "john.doe@acme.com",
  emailVerified: true,
  phone: "+1-555-0125",
  phoneVerified: true,

  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  title: "Chief Executive Officer",
  department: "Executive",
  location: "New York, NY",
  timezone: "America/New_York",
  language: "en",
  avatar: "https://9vectors.blob.core.windows.net/avatars/user_xyz789.jpg",

  auth: {
    provider: "azure-ad",
    providerId: "aad_user_12345",
    mfaEnabled: true,
    mfaMethod: "totp",
    lastLogin: "2025-01-16T14:30:00.000Z",
    passwordResetRequired: false
  },

  role: "org_admin",
  permissions: [
    "org.manage",
    "users.manage",
    "assessments.create",
    "assessments.delete",
    "billing.manage",
    "settings.modify"
  ],

  status: "active",
  activatedAt: "2025-01-10T09:00:00.000Z",

  preferences: {
    notifications: {
      email: {
        assessmentInvites: true,
        assessmentReminders: true,
        assessmentCompleted: true,
        weeklyDigest: true,
        productUpdates: false
      },
      inApp: {
        enabled: true,
        sound: true
      }
    },
    ui: {
      theme: "dark",
      compactMode: false,
      language: "en"
    }
  },

  activity: {
    lastActive: "2025-01-16T14:30:00.000Z",
    assessmentsCompleted: 15,
    assessmentsCreated: 8,
    documentsUploaded: 23,
    aiCoachingSessions: 12
  },

  createdAt: "2025-01-10T09:00:00.000Z",
  updatedAt: "2025-01-16T14:30:00.000Z",
  tags: ["executive", "power-user"],
  notes: "CEO - primary decision maker"
};
```

### 3. Assessments Collection

```typescript
interface Assessment {
  id: string; // "assessment_{uuid}"
  type: "assessment";
  organizationId: string; // Partition key

  // Basic Info
  name: string;
  description?: string;
  instructions?: string;

  // Status & Timeline
  status: "draft" | "published" | "in-progress" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  dueDate?: string;
  completedAt?: string;
  archivedAt?: string;

  // Ownership
  createdBy: string; // userId
  ownedBy: string; // userId
  managedBy?: string[]; // userIds with manage permissions

  // Assessment Type
  assessmentType: "individual" | "multi-participant" | "360-review" | "team" | "benchmark";

  // Participants
  participants: {
    userId: string;
    role: "owner" | "participant" | "reviewer" | "observer";
    status: "invited" | "in-progress" | "completed" | "declined";
    invitedAt: string;
    invitedBy: string;
    startedAt?: string;
    completedAt?: string;
    remindersSent: number;
    lastReminderAt?: string;
    responseId?: string; // Link to response document
  }[];

  // Configuration
  configuration: {
    // Vectors to assess
    vectors: number[]; // [1, 2, 3, 4, 5, 6, 7, 8, 9]

    // Features enabled
    enableAICoaching: boolean;
    enableDocumentCorrelation: boolean;
    enableBenchmarking: boolean;
    enableComments: boolean;
    enableEvidence: boolean;

    // Response Settings
    anonymousResponses: boolean;
    allowPartialSave: boolean;
    requireAllQuestions: boolean;
    allowSkip: boolean;

    // Scoring
    scoringScale: 1 | 5 | 10;
    requireConfidence: boolean;
    confidenceScale: 1 | 5;

    // Timing
    timeLimit?: number; // minutes
    reminderSchedule: number[]; // days before due date [7, 3, 1]
    autoCompleteOnDueDate: boolean;
  };

  // Analytics
  analytics: {
    // Participation
    totalInvited: number;
    totalStarted: number;
    totalCompleted: number;
    completionRate: number; // percentage

    // Timing
    avgTimeToStart: number; // seconds
    avgTimeToComplete: number; // seconds

    // Responses
    totalResponses: number;
    totalQuestions: number;
    totalComments: number;

    // Scores
    overallScore?: number;
    vectorScores?: {
      [vectorId: number]: number;
    };

    // Patterns
    strengthVectors?: number[];
    improvementVectors?: number[];
    consensusLevel?: number; // 0-1, for multi-participant

    lastCalculated?: string;
  };

  // Linked Resources
  linkedDocuments?: string[]; // documentIds
  linkedBenchmarks?: string[]; // benchmarkIds
  comparisonAssessments?: string[]; // Compare with previous assessments

  // AI Insights
  aiInsights?: {
    generated: boolean;
    generatedAt?: string;
    summary?: string;
    keyFindings?: string[];
    recommendations?: string[];
    risks?: string[];
    opportunities?: string[];
  };

  // Metadata
  tags?: string[];
  category?: string;
  template?: string; // templateId if created from template
  version?: number; // For assessment versioning
  parentAssessmentId?: string; // For recurring assessments
  notes?: string;
}

// Example Document
const exampleAssessment: Assessment = {
  id: "assessment_mno345pqr678",
  type: "assessment",
  organizationId: "org_abc123def456",

  name: "Q1 2025 Strategic Assessment",
  description: "Quarterly strategic review across all 9 vectors",
  instructions: "Please provide honest ratings based on current state, not aspirational goals.",

  status: "in-progress",
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-16T15:30:00.000Z",
  publishedAt: "2025-01-15T10:15:00.000Z",
  dueDate: "2025-01-31T23:59:59.000Z",

  createdBy: "user_xyz789abc123",
  ownedBy: "user_xyz789abc123",
  managedBy: ["user_xyz789abc123", "user_abc123def456"],

  assessmentType: "multi-participant",

  participants: [
    {
      userId: "user_xyz789abc123",
      role: "owner",
      status: "completed",
      invitedAt: "2025-01-15T10:00:00.000Z",
      invitedBy: "user_xyz789abc123",
      startedAt: "2025-01-15T10:30:00.000Z",
      completedAt: "2025-01-16T15:00:00.000Z",
      remindersSent: 0,
      responseId: "response_stu901vwx234"
    },
    {
      userId: "user_def456ghi789",
      role: "participant",
      status: "in-progress",
      invitedAt: "2025-01-15T10:05:00.000Z",
      invitedBy: "user_xyz789abc123",
      startedAt: "2025-01-15T14:00:00.000Z",
      remindersSent: 1,
      lastReminderAt: "2025-01-22T09:00:00.000Z"
    }
  ],

  configuration: {
    vectors: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    enableAICoaching: true,
    enableDocumentCorrelation: true,
    enableBenchmarking: true,
    enableComments: true,
    enableEvidence: true,
    anonymousResponses: false,
    allowPartialSave: true,
    requireAllQuestions: true,
    allowSkip: false,
    scoringScale: 5,
    requireConfidence: true,
    confidenceScale: 5,
    reminderSchedule: [7, 3, 1],
    autoCompleteOnDueDate: false
  },

  analytics: {
    totalInvited: 12,
    totalStarted: 8,
    totalCompleted: 3,
    completionRate: 25.0,
    avgTimeToStart: 14400, // 4 hours
    avgTimeToComplete: 3600, // 1 hour
    totalResponses: 3,
    totalQuestions: 135, // 9 vectors × 15 avg questions
    totalComments: 47,
    overallScore: 4.1,
    vectorScores: {
      1: 4.3, // Market
      2: 3.9, // People
      3: 3.5, // Financial
      4: 4.5, // Strategy
      5: 4.2, // Operations
      6: 3.8, // Execution
      7: 4.0, // Expectations
      8: 4.3, // Timing
      9: 4.1  // External Factors
    },
    strengthVectors: [1, 4, 5],
    improvementVectors: [3, 6],
    consensusLevel: 0.78,
    lastCalculated: "2025-01-16T15:00:00.000Z"
  },

  linkedDocuments: [
    "doc_jkl012mno345",
    "doc_pqr678stu901"
  ],

  aiInsights: {
    generated: true,
    generatedAt: "2025-01-16T15:05:00.000Z",
    summary: "Strong market position and strategic clarity, but financial planning and execution need attention.",
    keyFindings: [
      "Market vector shows 4.3 average - strong competitive position",
      "Financial vector at 3.5 - cash flow forecasting concerns",
      "Strategy is clear (4.5) but execution lagging (3.8)"
    ],
    recommendations: [
      "Implement monthly cash flow forecasting",
      "Create execution dashboard with KPIs",
      "Align execution metrics with strategic goals"
    ],
    risks: [
      "Gap between strategy and execution could widen",
      "Financial planning challenges may impact growth"
    ],
    opportunities: [
      "Strong market position can be leveraged for growth",
      "Clear strategy provides foundation for better execution"
    ]
  },

  tags: ["quarterly", "strategic", "executive"],
  category: "strategic-review",
  version: 1
};
```

---

## Query Patterns & Examples

### Common Queries

```javascript
// 1. Get all users in an organization
const query = {
  query: "SELECT * FROM c WHERE c.type = 'user' AND c.status = 'active'",
  parameters: [],
  partitionKey: "org_abc123" // Single partition query - efficient!
};

// 2. Get user by email (with unique key constraint)
const query = {
  query: "SELECT * FROM c WHERE c.type = 'user' AND c.email = @email",
  parameters: [{ name: "@email", value: "john@acme.com" }]
  // Cross-partition query but email has unique index
};

// 3. Get assessments for a user
const query = {
  query: `
    SELECT * FROM c
    WHERE c.type = 'assessment'
    AND ARRAY_CONTAINS(c.participants, {userId: @userId}, true)
    AND c.status != 'archived'
    ORDER BY c.createdAt DESC
  `,
  parameters: [{ name: "@userId", value: "user_xyz789" }],
  partitionKey: "org_abc123"
};

// 4. Get incomplete assessments (reminders)
const query = {
  query: `
    SELECT * FROM c
    WHERE c.type = 'assessment'
    AND c.status = 'in-progress'
    AND c.dueDate < @futureDate
    AND c.analytics.completionRate < 100
  `,
  parameters: [
    { name: "@futureDate", value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  partitionKey: "org_abc123"
};

// 5. Get organization usage for billing
const query = {
  query: `
    SELECT
      c.subscription.usage.users,
      c.subscription.usage.assessments,
      c.subscription.usage.storageGB,
      c.subscription.usage.aiTokens
    FROM c
    WHERE c.type = 'organization'
    AND c.id = @orgId
  `,
  parameters: [{ name: "@orgId", value: "org_abc123" }],
  partitionKey: "org_abc123"
};
```

---

## Indexing Strategy

```javascript
const indexingPolicy = {
  indexingMode: "consistent",
  automatic: true,

  includedPaths: [
    // Index frequently queried fields
    { path: "/type/?" },
    { path: "/status/?" },
    { path: "/email/?" },
    { path: "/createdAt/?" },
    { path: "/updatedAt/?" },
    { path: "/dueDate/?" },

    // Index nested frequently queried fields
    { path: "/participants/*/userId/?" },
    { path: "/participants/*/status/?" },
    { path: "/subscription/plan/?" },
    { path: "/subscription/status/?" },

    // Composite indexes for common queries
    { path: "/type/?", order: "ascending" },
    { path: "/createdAt/?", order: "descending" }
  ],

  excludedPaths: [
    // Don't index large text fields
    { path: "/description/*" },
    { path: "/instructions/*" },
    { path: "/notes/*" },
    { path: "/bio/*" },

    // Don't index binary/blob references
    { path: "/avatar/*" },
    { path: "/logo/*" },

    // Don't index AI-generated content (query infrequently)
    { path: "/aiInsights/*" },
    { path: "/content/extractedText/*" }
  ],

  compositeIndexes: [
    // For queries like: WHERE type = 'assessment' ORDER BY createdAt DESC
    [
      { path: "/type", order: "ascending" },
      { path: "/createdAt", order: "descending" }
    ],
    // For queries like: WHERE type = 'assessment' AND status = 'in-progress' ORDER BY dueDate
    [
      { path: "/type", order: "ascending" },
      { path: "/status", order: "ascending" },
      { path: "/dueDate", order: "ascending" }
    ]
  ]
};
```

---

## Data Migration Plan

### Phase 1: Setup (Week 1)

```bash
# 1. Create Cosmos DB Account
az cosmosdb create \
  --name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --kind GlobalDocumentDB \
  --locations regionName=eastus failoverPriority=0 \
  --default-consistency-level Session

# 2. Create Database
az cosmosdb sql database create \
  --account-name 9vectors-cosmos \
  --name 9vectors-db \
  --throughput 4000

# 3. Create Containers
az cosmosdb sql container create \
  --account-name 9vectors-cosmos \
  --database-name 9vectors-db \
  --name organizations \
  --partition-key-path "/id" \
  --throughput 1000

az cosmosdb sql container create \
  --account-name 9vectors-cosmos \
  --database-name 9vectors-db \
  --name users \
  --partition-key-path "/organizationId" \
  --throughput 1000

# ... repeat for other containers
```

### Phase 2: Initial Data Load (Week 2)

```javascript
// Migration Script
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database('9vectors-db');

async function migrateOrganizations() {
  const container = database.container('organizations');

  // Load from existing data source
  const orgs = await loadExistingOrganizations();

  for (const org of orgs) {
    const transformed = transformOrganization(org);
    await container.items.create(transformed);
  }
}

function transformOrganization(oldOrg) {
  return {
    id: `org_${oldOrg.id}`,
    type: "organization",
    name: oldOrg.name,
    // ... map old fields to new schema
    createdAt: new Date(oldOrg.created).toISOString(),
    // ... rest of transformation
  };
}
```

### Phase 3: Testing & Validation (Week 3)

```javascript
// Validation Tests
const tests = {
  async testOrganizationExists() {
    const { resource } = await container.item('org_test123', 'org_test123').read();
    assert(resource.type === 'organization');
  },

  async testUserQuery() {
    const { resources } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'user' AND c.organizationId = @orgId",
        parameters: [{ name: "@orgId", value: "org_test123" }]
      })
      .fetchAll();

    assert(resources.length > 0);
  },

  async testPerformance() {
    const start = Date.now();
    await container.items.query(...).fetchAll();
    const duration = Date.now() - start;
    assert(duration < 100); // Should be < 100ms
  }
};
```

---

This schema provides a solid foundation for a scalable, multi-tenant SaaS application with excellent query performance and clear data boundaries!
