# 9Vectors Database Schema - Azure Cosmos DB

## Database Overview

**Database Name:** `9vectors`
**Technology:** Azure Cosmos DB (NoSQL)
**Architecture:** Multi-tenant SaaS with organization-level data isolation

---

## Containers (Collections)

### **1. Users Container** (`users`)
**Partition Key:** `/organizationId`

#### Data Stored:

**Identity & Authentication:**
- `id` - Unique user ID (format: `user_{uuid}`)
- `email` - User email address
- `passwordHash` - Bcrypt hashed password (salted, 10 rounds)
- `refreshTokens[]` - Array of hashed refresh tokens for multi-device sessions
  - `tokenHash` - Hashed refresh token
  - `deviceId` - Device identifier
  - `createdAt` - Token creation timestamp
  - `expiresAt` - Token expiration timestamp
  - `lastUsedAt` - Last usage timestamp
  - Max 5 tokens per user (session limit)

**Profile Information:**
- `profile.firstName` - User's first name
- `profile.lastName` - User's last name
- `profile.role` - User role (owner, admin, member)
- `profile.avatar` - Avatar URL

**Permissions:**
- `permissions.canCreateAssessments` - Boolean
- `permissions.canViewReports` - Boolean
- `permissions.canManageTeam` - Boolean
- `permissions.canManageBilling` - Boolean

**Password Reset:**
- `passwordResetToken` - Hashed reset token (32 bytes hex)
- `passwordResetExpires` - Reset token expiration (1 hour TTL)

**Metadata:**
- `status` - User status (active/inactive)
- `metadata.lastLogin` - Last login timestamp
- `metadata.loginCount` - Total login count
- `metadata.timezone` - User timezone
- `metadata.locale` - User locale (default: en-US)
- `organizationId` - Parent organization ID
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

---

### **2. Organizations Container** (`organizations`)
**Partition Key:** `/id`

#### Data Stored:

**Organization Identity:**
- `id` - Unique org ID (format: `org_{uuid}`)
- `name` - Organization name

**Subscription & Billing:**
- `subscription.plan` - Plan tier (free, starter, professional, enterprise)
- `subscription.status` - Subscription status (active, canceled, past_due)
- `subscription.currentPeriodStart` - Current billing period start
- `subscription.currentPeriodEnd` - Current billing period end
- `subscription.limits` - Plan-based limits:
  - **Free:** 3 users, 5 assessments, 10 participants
  - **Starter:** 10 users, 50 assessments, 100 participants
  - **Professional:** 50 users, 500 assessments, 1000 participants
  - **Enterprise:** Unlimited (-1)
- `billing.email` - Billing contact email
- `billing.customerId` - Stripe customer ID
- `billing.subscriptionId` - Stripe subscription ID

**Features (Plan-based):**
- `features.aiInsights` - AI coaching enabled (not on free plan)
- `features.exportPdf` - PDF export (all plans)
- `features.exportCsv` - CSV export (all plans)
- `features.apiAccess` - API access (enterprise only)
- `features.whiteLabel` - White labeling (enterprise only)
- `features.ssoEnabled` - SSO integration (enterprise only)

**Settings & Branding:**
- `settings.timezone` - Organization timezone
- `settings.locale` - Organization locale
- `settings.branding.logo` - Custom logo URL
- `settings.branding.primaryColor` - Brand color (default: #1e40af)
- `settings.branding.companyName` - Display name

**Metadata:**
- `metadata.ownerId` - Organization owner user ID
- `metadata.industry` - Industry classification
- `metadata.size` - Company size
- `metadata.website` - Company website
- `createdAt` - Organization creation timestamp
- `updatedAt` - Last update timestamp

---

### **3. Assessments Container** (`assessments`)
**Partition Key:** `/organizationId`

#### Data Stored:

**Assessment Identity:**
- `id` - Unique assessment ID (format: `assessment_{uuid}`)
- `name` - Assessment name
- `assessmentType` - Type of assessment
- `description` - Assessment description

**Status & Lifecycle:**
- `status` - Current status (draft, active, completed, archived)
- `createdBy` - User ID who created assessment
- `launchedBy` - User ID who launched assessment
- `launchedAt` - Launch timestamp
- `completedAt` - Completion timestamp
- `dueDate` - Assessment due date

**Participants & Vectors:**
- `participants[]` - Array of participant user IDs
- `vectors[]` - Array of 9Vectors lens IDs being assessed

**Assessment Data:**
- `responses{}` - Nested object of user responses:
  - Format: `{ userId: { vectorId: { scores, notes, documents } } }`
- `results` - Calculated results and scores

**Metadata:**
- `metadata.lastResponseAt` - Last response submission timestamp
- `metadata.responseCount` - Total responses submitted
- `metadata.completionPercentage` - Calculated completion %
- `organizationId` - Parent organization ID
- `createdAt` - Assessment creation timestamp
- `updatedAt` - Last update timestamp

---

### **4. Invitations Container** (`invitations`)
**Partition Key:** `/organizationId`

#### Data Stored:

**Invitation Identity:**
- `id` - Unique invitation ID (format: `invitation_{uuid}`)
- `email` - Invitee email address
- `token` - Secure invitation token (32 bytes hex)

**Invitation Details:**
- `role` - Invited user role (member, admin, etc.)
- `invitedBy` - User ID of inviter
- `invitedByName` - Inviter's display name
- `status` - Invitation status (pending, accepted, expired, revoked)
- `expiresAt` - Expiration timestamp (default: 7 days)

**Metadata:**
- `metadata.firstName` - Invitee first name (optional)
- `metadata.lastName` - Invitee last name (optional)
- `metadata.title` - Job title (optional)
- `metadata.department` - Department (optional)
- `metadata.message` - Custom invitation message (optional)
- `acceptedBy` - User ID who accepted (if accepted)
- `acceptedAt` - Acceptance timestamp (if accepted)
- `organizationId` - Parent organization ID
- `createdAt` - Invitation creation timestamp
- `updatedAt` - Last update timestamp

---

### **5. Benchmarks Container** (`benchmarks`)
**Partition Key:** `/id`

#### Data Stored:

**Benchmark Identity:**
- `id` - Unique benchmark ID (format: `benchmark_{uuid}`)
- `industry` - Industry classification
- `companySize` - Company size (small, medium, large, enterprise)
- `region` - Geographic region (default: global)
- `year` - Benchmark data year

**Benchmark Data:**
- `vectorScores{}` - Object mapping vector IDs to statistical data:
  - `mean` - Average score
  - `median` - Median score
  - `stdDev` - Standard deviation
  - Used for percentile calculations
- `participantCount` - Number of organizations in benchmark sample

**Metadata:**
- `metadata.source` - Data source (internal/external)
- `metadata.dataQuality` - Quality rating (high/medium/low)
- `metadata.lastUpdated` - Last data update timestamp
- `createdAt` - Benchmark creation timestamp
- `updatedAt` - Last update timestamp

---

## Security & Design Patterns

### **Security:**
- **Password Storage:** Bcrypt with 10 salt rounds, passwords never stored in plain text
- **Refresh Tokens:** Hashed before storage, max 5 per user
- **Reset Tokens:** SHA-256 hashed, 1-hour expiration
- **Partition Strategy:** Multi-tenant isolation using `organizationId`

### **Data Retention:**
- **Expired Tokens:** Automatic cleanup of expired refresh tokens
- **Expired Invitations:** Status updated to 'expired', not deleted
- **Soft Deletes:** Status field used instead of hard deletes where applicable

### **Relationships:**
- Users → Organizations (many-to-one)
- Assessments → Organizations (many-to-one)
- Assessments → Users (many-to-many via participants array)
- Invitations → Organizations (many-to-one)

---

## Database Operations

### **Create Operations:**
- User registration (User.create)
- Organization creation (Organization.create)
- Assessment creation (Assessment.create)
- Invitation creation (Invitation.create)
- Benchmark creation (Benchmark.create)

### **Read Operations:**
- Find by email (User.findByEmail)
- Find by organization (User.findByOrganization, Assessment.findByOrganization)
- Find by ID (all models support findById)
- Query by status (Assessment.findByStatus, Invitation.findPendingByOrganization)

### **Update Operations:**
- Profile updates (User.update)
- Password changes (User.changePassword)
- Password resets (User.resetPassword)
- Subscription updates (Organization.updateSubscription)
- Assessment updates (Assessment.update)
- Invitation status updates (Invitation.updateStatus)

### **Delete Operations:**
- Soft deletes via status field (preferred)
- Hard deletes available (Assessment.delete, Invitation.delete)

---

## Notes

This is a **multi-tenant SaaS architecture** with:
- Organization-level data isolation via partition keys
- Subscription-based feature gating
- Comprehensive audit trails (createdAt/updatedAt)
- All timestamps use ISO 8601 format
- All sensitive data (passwords, tokens) is cryptographically hashed before storage