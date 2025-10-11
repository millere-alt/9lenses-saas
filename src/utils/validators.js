/**
 * Validation Utilities
 * Provides common validation functions for forms and API data
 */

/**
 * Email validation
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {Object} - {isValid: boolean, strength: string, issues: Array}
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 'weak',
    issues: []
  };

  if (!password || typeof password !== 'string') {
    result.issues.push('Password is required');
    return result;
  }

  if (password.length < 8) {
    result.issues.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    result.issues.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    result.issues.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.issues.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    result.issues.push('Password must contain at least one special character');
  }

  // Calculate strength
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (strengthScore >= 5) result.strength = 'strong';
  else if (strengthScore >= 3) result.strength = 'medium';
  else result.strength = 'weak';

  result.isValid = result.issues.length === 0;

  return result;
};

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Phone number validation (US format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Date validation
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if valid
 */
export const isValidDate = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Number range validation
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if in range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Required field validation
 * @param {*} value - Value to check
 * @returns {boolean} - True if value exists
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * File validation
 * @param {File} file - File to validate
 * @param {Object} options - Validation options {maxSize, allowedTypes}
 * @returns {Object} - {isValid: boolean, error: string}
 */
export const validateFile = (file, options = {}) => {
  const result = { isValid: true, error: null };

  if (!file) {
    result.isValid = false;
    result.error = 'No file provided';
    return result;
  }

  // Check file size (maxSize in MB)
  if (options.maxSize) {
    const maxBytes = options.maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      result.isValid = false;
      result.error = `File size must be less than ${options.maxSize}MB`;
      return result;
    }
  }

  // Check file type
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const fileType = file.type || file.name.split('.').pop();
    const isAllowed = options.allowedTypes.some(type =>
      fileType.toLowerCase().includes(type.toLowerCase())
    );

    if (!isAllowed) {
      result.isValid = false;
      result.error = `File type must be one of: ${options.allowedTypes.join(', ')}`;
      return result;
    }
  }

  return result;
};

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validate form data against schema
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - {isValid: boolean, errors: Object}
 */
export const validateForm = (data, schema) => {
  const errors = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];

    if (rules.required && !isRequired(value)) {
      errors[field] = rules.message || `${field} is required`;
      return;
    }

    if (value && rules.email && !isValidEmail(value)) {
      errors[field] = rules.message || 'Invalid email address';
      return;
    }

    if (value && rules.url && !isValidURL(value)) {
      errors[field] = rules.message || 'Invalid URL';
      return;
    }

    if (value && rules.phone && !isValidPhone(value)) {
      errors[field] = rules.message || 'Invalid phone number';
      return;
    }

    if (value && rules.min && value.length < rules.min) {
      errors[field] = rules.message || `Must be at least ${rules.min} characters`;
      return;
    }

    if (value && rules.max && value.length > rules.max) {
      errors[field] = rules.message || `Must be less than ${rules.max} characters`;
      return;
    }

    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, data);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  isValidEmail,
  validatePassword,
  isValidURL,
  isValidPhone,
  isValidDate,
  isInRange,
  isRequired,
  validateFile,
  sanitizeString,
  validateForm
};
