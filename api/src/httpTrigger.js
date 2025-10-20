import { app as azureApp } from '@azure/functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import stripeRoutes from './routes/stripe.js';
import invitationRoutes from './routes/invitations.js';
import userRoutes from './routes/users.js';
import assessmentRoutes from './routes/assessments.js';
import organizationRoutes from './routes/organizations.js';
import benchmarkRoutes from './routes/benchmarks.js';
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
  securityHeaders
} from './middleware/errorHandler.js';
import {
  sanitizeRequest,
  validateContentType,
  validateRequestSize
} from './middleware/validation.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Initialize database once
let isInitialized = false;
async function ensureInitialized() {
  if (!isInitialized) {
    console.log('Initializing database for Azure Functions...');
    await initializeDatabase();
    isInitialized = true;
  }
}

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// CORS configuration
const allowedOrigins = [
  'http://localhost:4280', // Azure Static Web Apps local
  'http://localhost:5173',
  'http://localhost:3005',
  process.env.FRONTEND_URL || 'http://localhost:4280',
  process.env.PRODUCTION_URL || 'https://www.9vectors.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting (more lenient in serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request validation and sanitization
app.use(sanitizeRequest);
app.use(validateContentType());
app.use(validateRequestSize(10));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: '9Vectors API - Azure Functions'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: '9Vectors API - Azure Functions'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/benchmarks', benchmarkRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handling
app.use(errorHandler);

// Azure Functions HTTP trigger
azureApp.http('httpTrigger', {
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
    'HEAD'
  ],
  authLevel: 'anonymous',
  route: '{*segments}',
  handler: async (request, context) => {
    // Ensure database is initialized
    await ensureInitialized();

    // Convert Azure Functions request to Express-compatible request
    return new Promise((resolve) => {
      const req = {
        method: request.method,
        url: `/${request.params.segments || ''}${request.query ? '?' + new URLSearchParams(request.query).toString() : ''}`,
        headers: Object.fromEntries(request.headers.entries()),
        body: request.body || {}
      };

      const res = {
        statusCode: 200,
        headers: {},
        body: '',
        status(code) {
          this.statusCode = code;
          return this;
        },
        set(key, value) {
          this.headers[key] = value;
          return this;
        },
        send(data) {
          this.body = typeof data === 'string' ? data : JSON.stringify(data);
          resolve({
            status: this.statusCode,
            headers: this.headers,
            body: this.body
          });
        },
        json(data) {
          this.headers['Content-Type'] = 'application/json';
          this.body = JSON.stringify(data);
          resolve({
            status: this.statusCode,
            headers: this.headers,
            body: this.body
          });
        }
      };

      // Process through Express app
      app(req, res);
    });
  }
});

export default app;
