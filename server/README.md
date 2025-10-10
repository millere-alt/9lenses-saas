# 9Vectors Backend Server

Complete backend API for the 9Vectors SaaS Platform with authentication, assessments, AI features, and payment processing.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
cd server
npm install
```

2. **Setup PostgreSQL Database**

Create a PostgreSQL database:
```sql
CREATE DATABASE 9Vectors;
```

3. **Configure Environment Variables**

Copy `.env.example` to `.env` and update with your values:
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe API key
- `OPENAI_API_KEY` - OpenAI API key
- `EMAIL_*` - Email configuration (Gmail, SendGrid, etc.)

4. **Initialize Database**

Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start the Server**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
server/
├── src/
│   ├── index.js              # Main server file
│   ├── controllers/          # Request handlers
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management
│   │   ├── assessments.js    # Assessment CRUD
│   │   ├── documents.js      # Document upload/management
│   │   ├── ai.js             # AI-powered features
│   │   ├── stripe.js         # Payment processing
│   │   ├── notifications.js  # Notification system
│   │   └── analytics.js      # Analytics tracking
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handling
│   │   └── notFound.js       # 404 handler
│   ├── utils/
│   │   └── email.js          # Email utilities
│   └── config/               # Configuration files
├── prisma/
│   └── schema.prisma         # Database schema
├── uploads/                  # File upload directory
├── package.json
└── .env
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Login with credentials
- `POST /verify-email` - Verify email address
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

### Users (`/api/users`)
- `GET /me` - Get current user profile
- `GET /organization` - Get organization users
- `PUT /me` - Update user profile

### Assessments (`/api/assessments`)
- `GET /` - List all assessments
- `GET /:id` - Get assessment by ID
- `POST /` - Create new assessment
- `PUT /:id` - Update assessment
- `DELETE /:id` - Delete assessment
- `POST /:id/responses` - Submit assessment response

### Documents (`/api/documents`)
- `GET /` - List all documents
- `GET /:id` - Get document by ID
- `POST /` - Upload new document
- `DELETE /:id` - Delete document

### AI Features (`/api/ai`)
- `POST /strategy-advisor` - Get AI strategic recommendations
- `POST /predictive-analytics` - Generate predictions
- `POST /document-analysis` - Analyze document content
- `POST /assistant` - Chat with AI assistant

### Stripe (`/api/stripe`)
- `POST /create-checkout-session` - Create payment session
- `POST /webhook` - Handle Stripe webhooks
- `GET /subscription` - Get current subscription
- `POST /cancel-subscription` - Cancel subscription

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark notification as read
- `PUT /read-all` - Mark all as read

### Analytics (`/api/analytics`)
- `POST /track` - Track analytics event
- `GET /dashboard` - Get analytics dashboard

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```javascript
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- `ADMIN` - Full system access
- `ORG_OWNER` - Organization management
- `MANAGER` - Create/manage assessments
- `PARTICIPANT` - Take assessments

## 💳 Subscription Tiers

- **FREE** - 5 users, 3 assessments, 100 AI requests
- **BASIC** - 10 users, 10 assessments, 1000 AI requests ($49/mo)
- **PRO** - 50 users, unlimited assessments, 10000 AI requests ($149/mo)
- **ENTERPRISE** - Unlimited everything ($499/mo)

## 🔌 WebSocket Events

Real-time features using Socket.IO:

- `assessment:created` - New assessment created
- `assessment:updated` - Assessment updated
- `notification:new` - New notification received

Join organization room:
```javascript
socket.emit('join:organization', organizationId);
```

## 📧 Email Configuration

Configure email provider in `.env`:

### Gmail
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### SendGrid
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

## 🗄️ Database Schema

Main models:
- **User** - User accounts
- **Organization** - Companies/teams
- **Assessment** - Assessments and surveys
- **AssessmentResponse** - User responses
- **Document** - Uploaded documents
- **AIAnalysis** - AI analysis results
- **Notification** - User notifications
- **Activity** - Activity logs
- **Comment** - Comments and mentions

## 🔧 Development

### Database Management

View database in Prisma Studio:
```bash
npm run prisma:studio
```

Create new migration:
```bash
npx prisma migrate dev --name your_migration_name
```

Reset database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

### Testing

Run tests:
```bash
npm test
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Update `DATABASE_URL` with production database
3. Set strong `JWT_SECRET`
4. Configure production email service
5. Add production Stripe keys
6. Set correct `FRONTEND_URL`

### Docker Deployment

```bash
docker build -t 9Vectors-api .
docker run -p 3001:3001 --env-file .env 9Vectors-api
```

### Hosting Platforms

**Recommended:**
- Railway
- Render
- Heroku
- DigitalOcean App Platform

## 📊 Monitoring

- Request logging with Morgan
- Error tracking with console.error
- Consider adding: Sentry, LogRocket, or DataDog

## 🔒 Security

- Helmet.js for security headers
- Rate limiting (100 requests per 15 min)
- CORS configured for frontend domain
- Password hashing with bcrypt (12 rounds)
- JWT expiration (7 days default)
- SQL injection protection (Prisma)

## 🐛 Troubleshooting

**Database connection error:**
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL format
postgresql://user:password@localhost:5432/9Vectors
```

**Port already in use:**
```bash
# Change PORT in .env
PORT=3002
```

**Prisma errors:**
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

## 📝 License

MIT

## 💬 Support

For issues and questions:
- GitHub Issues: [repo-url]
- Email: support@9Vectors.com

---

Built with ❤️ using Node.js, Express, Prisma, and PostgreSQL
