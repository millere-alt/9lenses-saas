/**
 * Safe Storage Utilities
 * Provides safe wrappers for localStorage with error handling and validation
 */

import logger from './logger';

/**
 * Safely parse JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed object or default value
 */
export const safeJSONParse = (jsonString, defaultValue = null) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.error('JSON parse failed:', error, { jsonString: jsonString.substring(0, 100) });
    return defaultValue;
  }
};

/**
 * Safely stringify JSON with fallback
 * @param {*} value - Value to stringify
 * @param {string} defaultValue - Default value if stringification fails
 * @returns {string} - JSON string or default value
 */
export const safeJSONStringify = (value, defaultValue = '{}') => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    logger.error('JSON stringify failed:', error);
    return defaultValue;
  }
};

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found or parse fails
 * @returns {*} - Stored value or default
 */
export const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return safeJSONParse(item, defaultValue);
  } catch (error) {
    logger.error('localStorage.getItem failed:', error, { key });
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} - True if successful
 */
export const safeSetItem = (key, value) => {
  try {
    const jsonString = safeJSONStringify(value);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      logger.error('localStorage quota exceeded:', error);
      // Try to clear old items
      try {
        const keys = Object.keys(localStorage);
        if (keys.length > 0) {
          // Remove oldest item (first key)
          localStorage.removeItem(keys[0]);
          // Retry
          localStorage.setItem(key, safeJSONStringify(value));
          return true;
        }
      } catch (retryError) {
        logger.error('localStorage retry failed:', retryError);
      }
    } else {
      logger.error('localStorage.setItem failed:', error, { key });
    }
    return false;
  }
};

/**
 * Safely remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - True if successful
 */
export const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logger.error('localStorage.removeItem failed:', error, { key });
    return false;
  }
};

/**
 * Safely clear localStorage
 * @returns {boolean} - True if successful
 */
export const safeClear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logger.error('localStorage.clear failed:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} - True if available
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Object} - { used, available, percentUsed }
 */
export const getStorageInfo = () => {
  try {
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    const totalSizeKB = (totalSize / 1024).toFixed(2);
    const maxSizeKB = 5120; // 5MB typical limit
    const percentUsed = ((totalSize / (maxSizeKB * 1024)) * 100).toFixed(1);

    return {
      used: `${totalSizeKB} KB`,
      available: `${(maxSizeKB - totalSizeKB).toFixed(2)} KB`,
      percentUsed: `${percentUsed}%`,
      isNearLimit: percentUsed > 80
    };
  } catch (error) {
    logger.error('Failed to get storage info:', error);
    return null;
  }
};

export default {
  safeJSONParse,
  safeJSONStringify,
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
  safeClear,
  isStorageAvailable,
  getStorageInfo
};
