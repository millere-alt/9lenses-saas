/**
 * Validation Utilities
 * Centralized validation functions for forms and user input
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @param {number} minLength - Minimum length (default: 1)
 * @returns {boolean} - True if valid
 */
export const isRequired = (value, minLength = 1) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    return value.trim().length >= minLength;
  }
  return true;
};

/**
 * Validate name (at least 2 characters, letters and spaces only)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(trimmed);
};

/**
 * Validate array has no duplicate values
 * @param {Array} arr - Array to check
 * @param {string} key - Optional key for array of objects
 * @returns {boolean} - True if no duplicates
 */
export const hasNoDuplicates = (arr, key = null) => {
  if (!Array.isArray(arr)) return false;
  const values = key ? arr.map(item => item[key]) : arr;
  return new Set(values).size === values.length;
};

/**
 * Validate email list (array of emails)
 * @param {Array} emails - Array of email strings or objects with email property
 * @param {string} emailKey - Key name if array contains objects
 * @returns {Object} - { isValid, errors }
 */
export const validateEmailList = (emails, emailKey = 'email') => {
  const errors = [];

  if (!Array.isArray(emails) || emails.length === 0) {
    return { isValid: false, errors: ['At least one email is required'] };
  }

  // Auto-detect if emails are objects or strings
  const emailValues = emails.map(e => {
    if (typeof e === 'string') return e;
    if (typeof e === 'object' && e !== null) return e[emailKey];
    return null;
  });

  // Check each email format
  emailValues.forEach((email, index) => {
    if (!email || !isValidEmail(email)) {
      errors.push(`Invalid email format at position ${index + 1}`);
    }
  });

  // Check for duplicates (only non-empty emails)
  const validEmails = emailValues.filter(e => e && isValidEmail(e));
  if (validEmails.length > 0 && !hasNoDuplicates(validEmails)) {
    errors.push('Duplicate emails found');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate invite object
 * @param {Object} invite - Invite object with email and role
 * @returns {Object} - { isValid, errors }
 */
export const validateInvite = (invite) => {
  const errors = [];

  if (!invite.email || !isValidEmail(invite.email)) {
    errors.push('Valid email is required');
  }

  if (!invite.role || invite.role.trim().length === 0) {
    errors.push('Role is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate file size
 * @param {File} file - File object
 * @param {number} maxSizeMB - Maximum size in MB (default: 10)
 * @returns {boolean} - True if valid
 */
export const isValidFileSize = (file, maxSizeMB = 10) => {
  if (!file) return false;
  const maxSize = maxSizeMB * 1024 * 1024;
  return file.size <= maxSize;
};

/**
 * Validate file type
 * @param {File} file - File object
 * @param {Array<string>} allowedTypes - Array of allowed MIME types or extensions
 * @returns {boolean} - True if valid
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (!file) return false;
  if (allowedTypes.length === 0) return true;

  // Check MIME type
  if (allowedTypes.some(type => file.type === type)) {
    return true;
  }

  // Check extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  return allowedTypes.some(type => type === extension);
};

/**
 * Validate assessment name
 * @param {string} name - Assessment name
 * @returns {Object} - { isValid, error }
 */
export const validateAssessmentName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Assessment name is required' };
  }

  const trimmed = name.trim();
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Assessment name must be at least 3 characters' };
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Assessment name must be less than 100 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate minimum responses
 * @param {Object} responses - Responses object
 * @param {number} minCount - Minimum number of responses
 * @returns {Object} - { isValid, error }
 */
export const validateMinResponses = (responses, minCount = 1) => {
  const count = Object.keys(responses || {}).length;

  if (count < minCount) {
    return {
      isValid: false,
      error: `At least ${minCount} response${minCount > 1 ? 's are' : ' is'} required`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Sanitize string for localStorage
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeForStorage = (str) => {
  if (typeof str !== 'string') return '';
  // Remove any potential XSS vectors
  return str.replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .trim();
};

export default {
  isValidEmail,
  isRequired,
  isValidName,
  hasNoDuplicates,
  validateEmailList,
  validateInvite,
  isValidFileSize,
  isValidFileType,
  validateAssessmentName,
  validateMinResponses,
  sanitizeForStorage
};
