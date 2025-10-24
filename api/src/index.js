// Import all function modules - Azure Functions v4 Programming Model

console.log('[STARTUP] Loading src/index.js');

// Load environment variables
require('dotenv').config();

// CRITICAL: Start database connection early to reduce cold start latency
const { initializeDatabase } = require('./config/database.js');

console.log('[STARTUP] Starting database connection...');

// Start connection immediately (don't await, let it run in background)
initializeDatabase().catch(err => {
  console.error('[STARTUP] ❌ Failed to establish initial database connection:', err);
});

console.log('[STARTUP] Loading function modules...');

// Load all function modules immediately (they will await connection on first request)
try {
  require('./functions/auth');
  console.log('[STARTUP] ✓ Loaded auth functions');

  require('./functions/health');
  console.log('[STARTUP] ✓ Loaded health function');

  // Additional functions will be loaded here as they are created
  // require('./functions/assessments');
  // require('./functions/users');
  // require('./functions/documents');
  // require('./functions/organizations');
  // require('./functions/ai');
  // require('./functions/stripe');
  // require('./functions/invitations');
  // require('./functions/benchmarks');
  // require('./functions/notifications');
  // require('./functions/analytics');

  console.log('[STARTUP] ✅ All function modules loaded successfully');
} catch (err) {
  console.error('[STARTUP] ❌ FATAL ERROR loading function modules:', err.message);
  console.error('[STARTUP] Stack trace:', err.stack);
  throw err;
}
