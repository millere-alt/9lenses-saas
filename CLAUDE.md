# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

9Vectors is a React-based SaaS platform for conducting organizational assessments using the 9Vectors framework. The platform evaluates organizations across 9 interconnected business dimensions (lenses) organized into three categories: Assets (Market, People, Financial), Processes (Strategy, Operations, Execution), and Structures (Expectations, Governance, Entity).

**Current Status**: Frontend deployed to Azure Static Web Apps at www.9vectors.com. Backend API is under development.

## Development Commands

### Frontend (React + Vite)
```bash
# Install dependencies
npm install

# Start dev server (runs on port 3005)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Backend API (Node.js + Express)
```bash
# Install dependencies
cd api && npm install

# Start API server (port 3001)
npm start

# Start with hot reload
npm run dev

# Start Azure Functions locally
npm run func:start
```

### Testing Specific Features
- **Frontend only**: `npm run dev` (uses mock data or API if configured)
- **Full stack**: Start both frontend and backend in separate terminals
- **AI Coaching**: Requires `VITE_ANTHROPIC_API_KEY` in `.env` (works without in mock mode)

## Architecture Overview

### Tech Stack
- **Frontend**: React 19, Vite 7, TailwindCSS 4, React Router 7
- **Backend**: Node.js 20, Express 4, Azure Cosmos DB
- **Authentication**: Auth0 + Azure AD B2C (multi-provider support)
- **AI**: Anthropic Claude 3.5 Sonnet API
- **Payments**: Stripe integration
- **Deployment**: Azure Static Web Apps, Azure Functions, Azure Cosmos DB

### Application Structure

**Frontend** (`/src`):
- `components/` - 38+ React components (pages, features, utilities)
- `contexts/` - Auth0Context, AICoachingContext, GuidedTourContext
- `services/` - API client (api.js), AI coaching agent (aiCoachingAgent.js)
- `data/` - 9Vectors framework schema, mock assessment data
- `store/` - Zustand stores (auth, theme, assessments, notifications, UI, documents)
- `hooks/` - Custom React hooks (useAsync, etc.)
- `utils/` - Utilities (validation, transformers, exportUtils, logger, etc.)
- `engine/` - MetastructureEngine.js (9Vectors scoring logic)
- `config/` - Auth0 and other configurations

**Backend** (`/api/src`):
- `routes/` - 11 route files (ai, auth, users, assessments, documents, organizations, stripe, invitations, benchmarks, notifications, analytics)
- `controllers/` - Business logic layer (7 controllers)
- `models/` - Cosmos DB data models (User, Organization, Assessment, Invitation, Benchmark)
- `middleware/` - auth.js (JWT), errorHandler.js, validation.js
- `config/` - database.js (Cosmos DB initialization)
- `services/` - emailService.js (Azure Communication Services), other shared services

### Key Patterns

**Authentication Flow**:
1. User logs in via Auth0 or email/password
2. Auth0Context syncs credentials with backend API
3. Backend creates/updates user in Cosmos DB
4. Backend returns JWT token
5. Token stored in localStorage and included in all API requests

**Password Management Flow**:
- **Forgot Password** (`/forgot-password`):
  1. User enters email
  2. Backend generates secure token (hashed in DB)
  3. Email sent with reset link (1-hour expiry)
  4. Success message shown (no email enumeration)
- **Reset Password** (`/reset-password?token=...`):
  1. Token verified on component mount
  2. User enters new password with validation
  3. Backend validates token and updates password
  4. Confirmation email sent
  5. User redirected to login
- **Change Password** (`/profile` → Security tab):
  1. User must provide current password
  2. New password validated (8+ chars, uppercase, lowercase, number)
  3. Backend verifies current password and updates
  4. All other sessions logged out
  5. Confirmation email sent

**API Client Architecture** (`src/services/api.js`):
- Axios instance with custom interceptors
- Request interceptor: Adds auth token, handles retry logic
- Response interceptor: Manages caching (LRU cache, 5-min TTL), error handling
- Exponential backoff retry (max 3 retries)
- API namespaces: authAPI, userAPI, assessmentAPI, documentAPI, aiAPI, stripeAPI, analyticsAPI

**AI Coaching System**:
- Frontend: `AICoachingContext` + `aiCoachingAgent.js`
- Backend: `/api/ai/coach` endpoint using Claude API
- Two modes: Proactive (automatic guidance) and Reactive (user questions)
- Four workflows: Assessment, Dashboard, Strategy, Learning
- Context-aware: Understands current lens, sub-lens, user scores, and framework relationships
- Fallback: Mock responses when API unavailable

**Assessment Data Model**:
- 3 categories → 9 lenses → 44 sub-lenses → 242+ themes
- Scoring: 0-9 scale (Red 0-3, Yellow 4-6, Green 7-9)
- Dual input: Quantitative (numeric scores) + Qualitative (text context)
- Multi-participant: Leader creates, invites participants, aggregates responses
- Document upload: Attach evidence files to themes

**State Management**:
- Global state: Zustand stores (`src/store/useStore.js`)
- Auth state: Auth0Context with persistence
- API caching: Response interceptor with LRU cache
- Component state: Local React state for forms

### Environment Configuration

**Frontend** (`.env`):
```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api  # Backend API base URL

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier

# Azure AD B2C (alternative auth)
VITE_AZURE_AD_B2C_TENANT_NAME=9vectors
VITE_AZURE_AD_B2C_CLIENT_ID=your-client-id
VITE_AZURE_AD_B2C_SIGN_UP_SIGN_IN_POLICY=B2C_1_signupsignin
VITE_AZURE_AD_B2C_RESET_PASSWORD_POLICY=B2C_1_passwordreset
VITE_AZURE_AD_B2C_EDIT_PROFILE_POLICY=B2C_1_profileedit

# AI Configuration
VITE_ANTHROPIC_API_KEY=sk-ant-your-key  # Optional, uses mock if missing

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

**Backend** (`api/.env`):
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
COSMOS_DATABASE=9vectors
COSMOS_CONTAINER=assessments

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=your-api-identifier
JWT_SECRET=your-jwt-secret

# Azure AD B2C
AZURE_AD_B2C_TENANT_NAME=9vectors
AZURE_AD_B2C_CLIENT_ID=your-client-id
AZURE_AD_B2C_CLIENT_SECRET=your-client-secret
AZURE_AD_B2C_POLICY_NAME=B2C_1_signupsignin

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-your-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_STARTER=price_starter_id
STRIPE_PRICE_PROFESSIONAL=price_professional_id
STRIPE_PRICE_ENTERPRISE=price_enterprise_id

# Email Service (Azure Communication Services)
AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=https://...;accesskey=...
AZURE_COMMUNICATION_SENDER_EMAIL=noreply@9vectors.com
FRONTEND_URL=http://localhost:3005  # Used for password reset links
```

## Key Implementation Details

### 9Vectors Framework Schema
The complete framework is defined in `src/data/nineVectorsSchema.js`. This is the single source of truth for:
- All 9 lenses with descriptions, colors, and sub-lenses
- All 44 sub-lenses with themes
- 242+ assessment themes
- Category groupings (Assets, Processes, Structures)

**When modifying the framework**: Only edit `nineVectorsSchema.js`. All components, AI coaching, and scoring logic reference this schema.

### AI Coaching Integration
The AI coaching system (`src/services/aiCoachingAgent.js`) builds comprehensive context including:
- Current workflow (assessment, dashboard, strategy, learning)
- Active lens and sub-lens
- User's scores and responses
- Framework relationships and dependencies
- Mode (proactive vs reactive)

**System prompt construction**:
1. Builds complete framework context from schema
2. Adds current context (lens, scores, workflow)
3. Includes coaching mode instructions
4. Sends to backend `/api/ai/coach` endpoint
5. Backend calls Claude API with full context
6. Extracts actionable suggestions from response

### API Security
All `/api/*` routes require JWT authentication (except `/api/auth/register` and `/api/auth/login`):
- JWT token in `Authorization: Bearer <token>` header
- Middleware: `authenticate()` in `api/src/middleware/auth.js`
- Rate limiting: 100 requests per 15 minutes per IP
- Request size limit: 10MB
- Input validation and sanitization

### Database Access
Cosmos DB operations are abstracted in `api/src/config/database.js`:
```javascript
// Create document
await database.create(container, document);

// Read by ID
const doc = await database.read(container, id, partitionKey);

// Query documents
const results = await database.query(container, query);

// Update document
await database.update(container, id, partitionKey, updates);

// Delete document
await database.delete(container, id, partitionKey);
```

**Partition strategy**: Cosmos DB uses `organizationId` as partition key for multi-tenancy.

### Document Upload
File uploads handled via `src/services/api.js` documentAPI:
- Max file size: 10MB
- Supported types: PDF, DOCX, XLSX, TXT, images
- Storage: Azure Blob Storage (via backend)
- Validation: Frontend checks size/type before upload

### Scoring and Calculations
MetastructureEngine (`src/engine/MetastructureEngine.js`) handles:
- Calculating lens scores from sub-lens scores
- Calculating sub-lens scores from theme scores
- Identifying strengths (score >= 7) and gaps (score <= 3)
- Category aggregations (Assets, Processes, Structures)
- Trend analysis across assessment periods

**Scoring logic**: All scores are 0-9 scale. Averages are calculated recursively from bottom (themes) to top (lenses) to categories.

## Common Development Tasks

### Adding a New Assessment Theme
1. Edit `src/data/nineVectorsSchema.js`
2. Find the appropriate lens → sub-lens
3. Add theme name to the `themes` array
4. No other changes needed (UI auto-generates from schema)

### Adding a New API Endpoint
1. Create route handler in `api/src/routes/<feature>.js`
2. Add business logic to appropriate controller in `api/src/controllers/`
3. Add authentication middleware: `router.get('/endpoint', authenticate, handler)`
4. Update frontend API client in `src/services/api.js`

### Modifying Authentication
- Frontend: Edit `src/contexts/Auth0Context.jsx` and `src/config/auth0Config.js`
- Backend: Edit `api/src/middleware/auth.js` and `api/src/controllers/authController.js`
- Sync logic: `Auth0Context` calls backend `/api/auth/sync` after successful login

### Adding a New Component
1. Create component in `src/components/<ComponentName>.jsx`
2. Import required hooks, contexts, services
3. Add route in `src/App.jsx` if it's a page component
4. Use existing patterns: error boundaries, loading states, Tailwind classes

### Working with the AI Coaching System
- Context building: `src/services/aiCoachingAgent.js`
- Backend endpoint: `api/src/routes/ai.js` → `/api/ai/coach`
- To test without API key: System automatically uses mock responses
- To add new coaching workflow: Add to `COACHING_WORKFLOWS` in `aiCoachingAgent.js`

## Important Notes

### DO NOT Modify
- `src/data/nineVectorsSchema.js` structure (only content changes are safe)
- JWT token validation logic in `api/src/middleware/auth.js`
- Database initialization in `api/src/config/database.js`
- Core scoring logic in `src/engine/MetastructureEngine.js` (without thorough testing)

### Always Remember
- All API calls must go through `src/services/api.js` (never raw axios)
- Frontend runs on port 3005, backend on port 3001
- Error handling: Use ErrorBoundary wrapper for components
- Cosmos DB requires partition key for all operations
- Auth token refresh is handled automatically by interceptors

### Testing Credentials
For local development without setting up services:
- Frontend works standalone with mock data
- AI coaching works in mock mode without ANTHROPIC_API_KEY
- Authentication requires Auth0 or Azure AD B2C configuration
- Stripe requires test API keys from Stripe dashboard

## Documentation Resources

- **Architecture**: `docs/README_ARCHITECTURE.md` - Complete Azure architecture documentation
- **Credentials Setup**: `docs/README_CREDENTIALS_SETUP.md` - Step-by-step credential configuration
- **Deployment**: `.azure/README.md` - Azure deployment guide
- **Main README**: `README.md` - Feature overview and getting started

## Deployment

**Current Production**:
- Frontend: Azure Static Web Apps → www.9vectors.com
- Backend: Not yet deployed (local development only)
- Database: Azure Cosmos DB (9vectors-cosmos)

**CI/CD**:
- GitHub Actions workflows in `.github/workflows/`
- Automatic deployment to Azure on push to `main` branch
- Build configuration in `staticwebapp.config.json`

**Build Outputs**:
- Frontend: `dist/` directory (created by `npm run build`)
- Backend: No build step required (Node.js runtime)
