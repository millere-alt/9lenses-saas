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

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite default port
  'http://localhost:3005',
  process.env.FRONTEND_URL || 'http://localhost:3005',
  process.env.PRODUCTION_URL || 'https://www.9vectors.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware with size limits
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
    service: '9Vectors API'
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

// 404 handler for undefined routes (must come before error handler)
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    console.log('Starting 9Vectors API server...');

    // Initialize database connection
    await initializeDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n✓ 9Vectors API server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ API endpoints: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
