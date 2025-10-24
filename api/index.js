// Azure Functions v4 Programming Model Entry Point
// This file is the main entry point specified in package.json

console.log('[STARTUP] Loading api/index.js - entry point');
console.log('[STARTUP] Node version:', process.version);
console.log('[STARTUP] Environment check:', {
  COSMOS_ENDPOINT: process.env.COSMOS_ENDPOINT ? '✓ SET' : '✗ MISSING',
  COSMOS_KEY: process.env.COSMOS_KEY ? '✓ SET' : '✗ MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? '✓ SET' : '✗ MISSING',
  NODE_ENV: process.env.NODE_ENV || 'not set'
});

try {
  console.log('[STARTUP] Requiring ./src/index.js...');
  require('./src/index.js');
  console.log('[STARTUP] ✅ Successfully loaded src/index.js');
} catch (err) {
  console.error('[STARTUP] ❌ FATAL ERROR loading src/index.js:', err.message);
  console.error('[STARTUP] Stack trace:', err.stack);
  throw err;
}
