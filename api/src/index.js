// Import all function modules - Azure Functions v4 Programming Model

console.log('[STARTUP] Loading src/index.js');

// Load environment variables
import 'dotenv/config';

// CRITICAL: Start database connection early to reduce cold start latency
import { initializeDatabase } from './config/database.js';

console.log('[STARTUP] Starting database connection...');

// Start connection immediately (don't await, let it run in background)
initializeDatabase().catch(err => {
  console.error('[STARTUP] ❌ Failed to establish initial database connection:', err);
});

console.log('[STARTUP] Loading function modules...');

// Load all function modules immediately (they will await connection on first request)
try {
  await import('./functions/auth.js');
  console.log('[STARTUP] ✓ Loaded auth functions');

  await import('./functions/health.js');
  console.log('[STARTUP] ✓ Loaded health function');

  // Additional functions will be loaded here as they are created
  // await import('./functions/assessments.js');
  // await import('./functions/users.js');
  // await import('./functions/documents.js');
  // await import('./functions/organizations.js');
  // await import('./functions/ai.js');
  // await import('./functions/stripe.js');
  // await import('./functions/invitations.js');
  // await import('./functions/benchmarks.js');
  // await import('./functions/notifications.js');
  // await import('./functions/analytics.js');

  console.log('[STARTUP] ✅ All function modules loaded successfully');
} catch (err) {
  console.error('[STARTUP] ❌ FATAL ERROR loading function modules:', err.message);
  console.error('[STARTUP] Stack trace:', err.stack);
  throw err;
}
