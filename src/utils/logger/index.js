/**
 * Centralized logging utility
 * Ensures console statements only run in development mode
 */

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

/**
 * Logger utility that gates console output based on environment
 */
export const logger = {
  /**
   * Log general information (dev only)
   * @param {string} message - Log message
   * @param {...any} data - Additional data to log
   */
  log: (message, ...data) => {
    if (isDev) {
      console.log(message, ...data);
    }
  },

  /**
   * Log warnings (always visible)
   * @param {string} message - Warning message
   * @param {...any} data - Additional data to log
   */
  warn: (message, ...data) => {
    if (isDev) {
      console.warn(message, ...data);
    }
  },

  /**
   * Log errors (always visible, but could be sent to error tracking)
   * @param {string} message - Error message
   * @param {Error} error - Error object
   * @param {...any} data - Additional data to log
   */
  error: (message, error, ...data) => {
    if (isDev) {
      console.error(message, error, ...data);
    }
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  },

  /**
   * Log debug information (dev only)
   * @param {string} message - Debug message
   * @param {...any} data - Additional data to log
   */
  debug: (message, ...data) => {
    if (isDev) {
      console.debug(message, ...data);
    }
  }
};

export default logger;
