import { useEffect, useCallback, useRef } from 'react';
import { isTokenExpired, getAccessToken, clearAllAuthData } from '../services/tokenStorage';
import logger from '../utils/logger';

/**
 * useTokenMonitor Hook
 * Monitors token expiration and triggers events
 *
 * @param {Object} options - Configuration options
 * @param {number} options.checkInterval - Interval in ms to check token (default: 60000 = 1 minute)
 * @param {number} options.warningThreshold - Seconds before expiry to trigger warning (default: 300 = 5 minutes)
 * @param {Function} options.onTokenExpiring - Callback when token is expiring soon
 * @param {Function} options.onTokenExpired - Callback when token has expired
 * @param {boolean} options.autoRefresh - Whether to automatically refresh (handled by API interceptor)
 */
const useTokenMonitor = (options = {}) => {
  const {
    checkInterval = 60000, // Check every minute
    warningThreshold = 300, // Warn 5 minutes before expiry
    onTokenExpiring = null,
    onTokenExpired = null,
    autoRefresh = true // Token refresh is handled by API interceptor
  } = options;

  const intervalRef = useRef(null);
  const hasWarnedRef = useRef(false);

  /**
   * Check token status and trigger appropriate callbacks
   */
  const checkTokenStatus = useCallback(() => {
    const token = getAccessToken();

    if (!token) {
      // No token present - user not authenticated
      return;
    }

    // Check if token is expired
    if (isTokenExpired(0)) {
      logger.warn('Access token has expired');

      if (onTokenExpired) {
        onTokenExpired();
      }

      // Dispatch event for other components to listen
      window.dispatchEvent(new CustomEvent('token-expired'));

      // If autoRefresh is disabled, clear auth data
      if (!autoRefresh) {
        clearAllAuthData();
        window.location.href = '/';
      }

      return;
    }

    // Check if token is expiring soon
    if (isTokenExpired(warningThreshold) && !hasWarnedRef.current) {
      logger.info(`Access token will expire in less than ${warningThreshold} seconds`);

      if (onTokenExpiring) {
        onTokenExpiring();
      }

      // Dispatch event
      window.dispatchEvent(new CustomEvent('token-expiring', {
        detail: { threshold: warningThreshold }
      }));

      hasWarnedRef.current = true;
    }

    // Reset warning flag if token is refreshed
    if (!isTokenExpired(warningThreshold) && hasWarnedRef.current) {
      hasWarnedRef.current = false;
      logger.info('Access token refreshed');
    }
  }, [warningThreshold, onTokenExpiring, onTokenExpired, autoRefresh]);

  /**
   * Start monitoring
   */
  useEffect(() => {
    // Initial check
    checkTokenStatus();

    // Set up interval to check periodically
    intervalRef.current = setInterval(checkTokenStatus, checkInterval);

    // Listen for token refresh events
    const handleTokenRefreshed = () => {
      logger.info('Token refreshed - resetting warning flag');
      hasWarnedRef.current = false;
    };

    const handleUnauthorized = () => {
      logger.warn('Unauthorized event received');
      if (onTokenExpired) {
        onTokenExpired();
      }
    };

    window.addEventListener('token-refreshed', handleTokenRefreshed);
    window.addEventListener('unauthorized', handleUnauthorized);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('token-refreshed', handleTokenRefreshed);
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [checkInterval, checkTokenStatus, onTokenExpired]);

  /**
   * Manual check function
   */
  const checkNow = useCallback(() => {
    checkTokenStatus();
  }, [checkTokenStatus]);

  return {
    checkNow
  };
};

export default useTokenMonitor;
