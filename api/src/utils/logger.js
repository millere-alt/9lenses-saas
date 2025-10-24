/**
 * Structured Logging Utility for Azure Functions
 * Provides consistent JSON-formatted logging
 */

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };

  console.log(JSON.stringify(logEntry));
}

function info(message, meta = {}) {
  log('INFO', message, meta);
}

function warn(message, meta = {}) {
  log('WARN', message, meta);
}

function error(message, meta = {}) {
  log('ERROR', message, meta);
}

function debug(message, meta = {}) {
  if (process.env.NODE_ENV === 'development') {
    log('DEBUG', message, meta);
  }
}

export { info, warn, error, debug };
