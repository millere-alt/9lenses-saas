# 9Vectors - Azure Cosmos DB + Auth0 Integration Guide

This document explains how 9Vectors leverages Azure services (particularly Cosmos DB) with Auth0 authentication for a scalable, secure SaaS application.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   User Browser (React)                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │             Auth0 Provider (Frontend)                   │ │
│  │  - Handles login/logout                                │ │
│  │  - Manages tokens                                       │ │
│  │  - Provides user context                                │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├──── Auth Flow ────▶ Auth0
                       │                     (Authentication)
                       │
                       ├──── API Calls ────▶ Express API (Node.js)
                       │                     │
                       │                     ├─── POST /api/auth/sync-auth0
                       │                     │    (Sync Auth0 → Cosmos DB)
                       │                     │
                       │                     └─── Other API endpoints
                       │                          (Protected with JWT)
                       ▼
           ┌───────────────────────────────┐
           │   Azure Cosmos DB (NoSQL)     │
           │                                │
           │  ┌──────────────────────────┐ │
           │  │ users                    │ │
           │  │ - id, email, auth0Id    │ │
           │  │ - profile, permissions   │ │
           │  │ - organizationId         │ │
           │  └──────────────────────────┘ │
           │                                │
           │  ┌──────────────────────────┐ │
           │  │ organizations            │ │
           │  │ - id, name, plan        │ │
           │  │ - subscription details   │ │
           │  └──────────────────────────┘ │
           │                                │
           │  ┌──────────────────────────┐ │
           │  │ assessments              │ │
           │  │ - assessment data        │ │
           │  │ - responses              │ │
           │  └──────────────────────────┘ │
           └───────────────────────────────┘
```

---

## Why This Stack?

### Auth0 for Authentication
- **Managed Service**: No need to build/maintain authentication infrastructure
- **Social Logins**: Easy integration with Google, Microsoft, GitHub, etc.
- **Security**: Industry-standard OAuth 2.0 / OpenID Connect
- **MFA Support**: Multi-factor authentication out of the box
- **Scalability**: Handles millions of users
- **Compliance**: SOC 2, GDPR compliant

### Azure Cosmos DB for Data Storage
- **Global Distribution**: Multi-region replication with low latency
- **Automatic Scaling**: Auto-scale RU/s based on demand
- **NoSQL Flexibility**: Document model perfect for SaaS multi-tenancy
- **99.999% SLA**: Industry-leading availability
- **ACID Transactions**: Full transactional support
- **Cost-Effective**: Serverless mode for development

---

## Authentication Flow

### 1. User Initiates Login

```javascript
// Frontend: src/contexts/Auth0Context.jsx
const login = async () => {
  await auth0.loginWithRedirect();
};
```

User is redirected to Auth0 login page.

### 2. Auth0 Authenticates User

- User enters credentials or uses social login
- Auth0 validates credentials
- Auth0 generates tokens:
  - **ID Token**: Contains user profile information
  - **Access Token**: Used to authenticate API requests

### 3. Redirect Back to Application

Auth0 redirects user back to your application with authorization code.

### 4. Frontend Syncs with Backend

```javascript
// Frontend: src/contexts/Auth0Context.jsx
useEffect(() => {
  if (auth0.isAuthenticated && auth0.user) {
    const token = await auth0.getAccessTokenSilently();

    // Sync user with backend Cosmos DB
    const response = await authAPI.syncAuth0({
      email: auth0.user.email,
      auth0Id: auth0.user.sub,
      name: auth0.user.name,
      picture: auth0.user.picture
    });

    setUser(response.data.user);
    setOrganization(response.data.organization);
    localStorage.setItem('token', response.data.token);
  }
}, [auth0.isAuthenticated, auth0.user]);
```

### 5. Backend Syncs User with Cosmos DB

```javascript
// Backend: api/src/controllers/authController.js
export async function syncAuth0User(req, res) {
  const { email, auth0Id, name, picture } = req.body;

  // Check if user exists in Cosmos DB
  let user = await User.findByEmail(email);

  if (user) {
    // Update existing user
    user = await User.update(user.id, user.organizationId, {
      auth0Id,
      'profile.avatar': picture,
      'metadata.lastLogin': new Date().toISOString()
    });
  } else {
    // Create new user and organization
    organization = await Organization.create({
      name: orgName,
      ownerEmail: email,
      plan: 'free'
    });

    user = await createItem('users', {
      id: `user_${auth0Id}`,
      email,
      auth0Id,
      organizationId: organization.id,
      // ... other fields
    });
  }

  // Generate JWT for API access
  const token = generateToken(user);

  res.json({ user, organization, token });
}
```

### 6. User is Authenticated

- Frontend has Auth0 token for Auth0 API calls
- Frontend has JWT token for your backend API calls
- User data is stored in Cosmos DB
- Organization is linked to user

---

## Database Schema (Cosmos DB)

### Users Container

Partition Key: `/organizationId`

```json
{
  "id": "user_auth0|abc123",
  "type": "user",
  "email": "john@example.com",
  "auth0Id": "auth0|abc123",
  "organizationId": "org_xyz789",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "role": "owner",
    "avatar": "https://..."
  },
  "permissions": {
    "canCreateAssessments": true,
    "canViewReports": true,
    "canManageTeam": true,
    "canManageBilling": true
  },
  "status": "active",
  "metadata": {
    "lastLogin": "2025-01-15T10:00:00Z",
    "loginCount": 42,
    "timezone": "America/New_York",
    "locale": "en-US"
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**Key Fields:**
- `auth0Id`: Links to Auth0 user (e.g., `auth0|123`, `google-oauth2|456`)
- `organizationId`: Partition key for data isolation
- `passwordHash`: `null` for Auth0 users (Auth0 handles passwords)

### Organizations Container

Partition Key: `/id`

```json
{
  "id": "org_xyz789",
  "type": "organization",
  "name": "Acme Corporation",
  "ownerEmail": "john@example.com",
  "plan": "professional",
  "status": "active",
  "subscription": {
    "stripeCustomerId": "cus_abc123",
    "plan": "professional",
    "status": "active",
    "currentPeriodEnd": "2025-02-01T00:00:00Z"
  },
  "limits": {
    "maxUsers": 50,
    "maxAssessments": 100
  },
  "metadata": {
    "ownerId": "user_auth0|abc123",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Assessments Container

Partition Key: `/organizationId`

```json
{
  "id": "assessment_def456",
  "type": "assessment",
  "organizationId": "org_xyz789",
  "name": "Q1 2025 Strategic Review",
  "createdBy": "user_auth0|abc123",
  "status": "in-progress",
  "responses": {
    "vectors": [...],
    "overallScore": 4.2
  },
  "createdAt": "2025-01-15T00:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

---

## Setup Instructions

### Prerequisites

1. **Azure Account** with Cosmos DB instance
2. **Auth0 Account** with application configured
3. **Node.js 18+** and **npm**

### Step 1: Configure Azure Cosmos DB

#### Create Cosmos DB Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Azure Cosmos DB account**
   - **API**: Core (SQL)
   - **Capacity mode**: Serverless (for development)
   - **Location**: Choose region closest to users

3. Create database: `9vectors`

4. Create containers:
   ```
   - users (partition key: /organizationId)
   - organizations (partition key: /id)
   - assessments (partition key: /organizationId)
   ```

5. Get connection credentials:
   - **URI**: `https://9vectors-cosmos.documents.azure.com:443/`
   - **Primary Key**: Found in "Keys" section

#### Update Backend .env

```env
# Azure Cosmos DB Configuration
COSMOS_ENDPOINT=https://YOUR-ACCOUNT.documents.azure.com:443/
COSMOS_KEY=YOUR-PRIMARY-KEY
COSMOS_DATABASE=9vectors
COSMOS_CONTAINER_USERS=users
COSMOS_CONTAINER_ORGANIZATIONS=organizations
COSMOS_CONTAINER_ASSESSMENTS=assessments
```

### Step 2: Configure Auth0

#### Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create new **Application**
   - Type: **Single Page Application**
   - Name: `9Vectors`

3. Configure Application Settings:
   - **Allowed Callback URLs**: `http://localhost:3005, http://localhost:5173, https://www.9vectors.com`
   - **Allowed Logout URLs**: `http://localhost:3005, http://localhost:5173, https://www.9vectors.com`
   - **Allowed Web Origins**: `http://localhost:3005, http://localhost:5173, https://www.9vectors.com`

4. Get credentials:
   - **Domain**: `your-tenant.auth0.com`
   - **Client ID**: `abc123...`

#### Update Frontend .env

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
```

#### Update Backend .env

```env
# Auth0 Configuration (for token validation)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
```

### Step 3: Install Dependencies

```bash
# Frontend
cd /Users/edwinmiller/Desktop/9Vectors
npm install

# Backend
cd /Users/edwinmiller/Desktop/9Vectors/api
npm install
```

### Step 4: Start Services

```bash
# Terminal 1: Start backend API
cd /Users/edwinmiller/Desktop/9Vectors/api
npm start
# Should see: ✓ 9Vectors API server running on port 3001

# Terminal 2: Start frontend
cd /Users/edwinmiller/Desktop/9Vectors
npm run dev
# Should see: Local: http://localhost:3005/
```

### Step 5: Test Authentication

1. Open browser: `http://localhost:3005`
2. Click **"Sign In"** button
3. Complete Auth0 login (create account or use existing)
4. You should be redirected back to the app
5. Check browser console for successful sync message
6. Check Azure Cosmos DB Data Explorer - user should appear in `users` container

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/sync-auth0`
Sync Auth0 user with Cosmos DB (creates or updates user).

**Request:**
```json
{
  "email": "john@example.com",
  "auth0Id": "auth0|abc123",
  "name": "John Doe",
  "picture": "https://..."
}
```

**Response:**
```json
{
  "message": "User synced successfully",
  "user": {
    "id": "user_auth0|abc123",
    "email": "john@example.com",
    "profile": {...},
    "organizationId": "org_xyz789"
  },
  "organization": {
    "id": "org_xyz789",
    "name": "Example",
    "plan": "free"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/register`
Register with email/password (alternative to Auth0).

#### POST `/api/auth/login`
Login with email/password (alternative to Auth0).

#### GET `/api/auth/me`
Get current user (requires JWT token).

---

## Security Best Practices

### 1. Environment Variables

**Never commit** `.env` files to version control.

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

### 2. Token Management

- Auth0 tokens stored in localStorage
- JWT tokens from backend stored in localStorage
- Tokens automatically added to API requests via axios interceptor
- Tokens removed on logout

### 3. Multi-Tenancy Isolation

Cosmos DB partition strategy ensures data isolation:
- Users partitioned by `organizationId`
- Assessments partitioned by `organizationId`
- Organizations partitioned by `id`

Queries automatically scoped to partition for performance and security.

### 4. CORS Configuration

Backend configured to only allow requests from:
- `http://localhost:3005` (development)
- `https://www.9vectors.com` (production)

### 5. Rate Limiting

API implements rate limiting (100 requests per 15 minutes per IP).

---

## Scaling Considerations

### Cosmos DB Scaling

**Development (Serverless)**:
- Pay only for operations used
- No minimum RU/s
- Perfect for dev/test

**Production (Provisioned)**:
- Start with 4,000 RU/s auto-scale
- Scales up to 40,000 RU/s automatically
- Add read replicas in multiple regions

**Cost Estimation**:
- 100 users: ~$24/month (400 RU/s)
- 1,000 users: ~$192/month (4,000 RU/s)
- 10,000 users: ~$960/month (20,000 RU/s)

### Auth0 Scaling

**Free Tier**:
- Up to 7,000 active users
- Unlimited logins

**Paid Plans**:
- Starts at $23/month
- $0.0165 per active user beyond 1,000

---

## Monitoring & Debugging

### Frontend Debugging

```javascript
// Check Auth0 state
console.log('Auth0 User:', auth0.user);
console.log('Is Authenticated:', auth0.isAuthenticated);

// Check synced user
console.log('Synced User:', user);
console.log('Organization:', organization);
```

### Backend Logs

```bash
cd /Users/edwinmiller/Desktop/9Vectors/api
npm start

# Watch for:
# ✓ Cosmos DB initialized successfully
# ✓ Container "users" initialized
# ✓ Container "organizations" initialized
```

### Cosmos DB Data Explorer

1. Go to Azure Portal → Cosmos DB
2. Click **Data Explorer**
3. Browse containers to see data
4. Run queries:
   ```sql
   SELECT * FROM c WHERE c.type = "user"
   SELECT * FROM c WHERE c.organizationId = "org_xyz789"
   ```

### Common Issues

**Issue**: "Auth0 configuration missing"
- **Fix**: Ensure `.env` has `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`

**Issue**: "Failed to sync with backend"
- **Fix**: Check backend API is running on port 3001
- **Fix**: Check Cosmos DB credentials in `api/.env`

**Issue**: "Address already in use ::: 3001"
- **Fix**: Kill existing process: `lsof -ti:3001 | xargs kill`

---

## Additional Azure Services (Future)

### Azure Blob Storage
Store uploaded documents, reports, user avatars.

```javascript
import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
```

### Azure Functions
Serverless functions for background jobs:
- Document processing
- Email notifications
- Scheduled reports

### Azure Key Vault
Securely store secrets:
- Cosmos DB keys
- Auth0 secrets
- Stripe API keys

### Azure Monitor
Monitor application performance and errors.

### Azure Static Web Apps
Host React frontend with global CDN.

---

## Resources

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
- [Azure Cosmos DB Node.js SDK](https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started)

---

## Summary

9Vectors uses a powerful combination of:
- **Auth0** for managed authentication and user identity
- **Azure Cosmos DB** for globally distributed, scalable data storage
- **Express.js API** to sync Auth0 users with Cosmos DB
- **React Frontend** with Auth0 React SDK

This architecture provides:
- Enterprise-grade security
- Global scalability
- Pay-as-you-grow pricing
- Minimal operational overhead
- Excellent developer experience

The key innovation is the **Auth0 → Cosmos DB sync** which creates a seamless bridge between Auth0's identity management and your application's data layer, giving you the best of both worlds.
