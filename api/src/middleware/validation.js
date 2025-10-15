import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors from express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }

  next();
};

/**
 * Sanitize request body to prevent injection attacks
 */
export const sanitizeRequest = (req, res, next) => {
  // Remove any potentially dangerous fields
  const dangerousFields = ['__proto__', 'constructor', 'prototype'];

  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        if (dangerousFields.includes(key)) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * Validate UUID format
 */
export const isValidUUID = (value) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Validate email format (stricter than express-validator default)
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate organization ID format
 */
export const isValidOrgId = (orgId) => {
  return typeof orgId === 'string' && orgId.startsWith('org_') && orgId.length > 4;
};

/**
 * Validate user ID format
 */
export const isValidUserId = (userId) => {
  return typeof userId === 'string' && userId.startsWith('user_') && userId.length > 5;
};

/**
 * Validate assessment ID format
 */
export const isValidAssessmentId = (assessmentId) => {
  return typeof assessmentId === 'string' && assessmentId.startsWith('assessment_') && assessmentId.length > 11;
};

/**
 * Rate limiting configuration helper
 */
export const createRateLimiter = (windowMs, max, message) => {
  return {
    windowMs,
    max,
    message: { error: 'Too many requests', message },
    standardHeaders: true,
    legacyHeaders: false,
  };
};

/**
 * Middleware to validate request content type
 */
export const validateContentType = (expectedType = 'application/json') => {
  return (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const contentType = req.get('Content-Type');

      if (!contentType || !contentType.includes(expectedType)) {
        return res.status(415).json({
          error: 'Unsupported Media Type',
          message: `Expected Content-Type: ${expectedType}`
        });
      }
    }
    next();
  };
};

/**
 * Middleware to limit request body size
 */
export const validateRequestSize = (maxSizeInMB = 10) => {
  return (req, res, next) => {
    const contentLength = req.get('Content-Length');

    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / (1024 * 1024);

      if (sizeInMB > maxSizeInMB) {
        return res.status(413).json({
          error: 'Payload Too Large',
          message: `Request body size exceeds ${maxSizeInMB}MB limit`
        });
      }
    }
    next();
  };
};

/**
 * Middleware to validate pagination parameters
 */
export const validatePagination = (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      error: 'Invalid pagination',
      message: 'Page must be a positive integer'
    });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      error: 'Invalid pagination',
      message: 'Limit must be between 1 and 100'
    });
  }

  req.pagination = {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum
  };

  next();
};

/**
 * Middleware to validate date range parameters
 */
export const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format',
        message: 'startDate must be a valid ISO 8601 date'
      });
    }
    req.dateRange = { ...req.dateRange, start };
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format',
        message: 'endDate must be a valid ISO 8601 date'
      });
    }
    req.dateRange = { ...req.dateRange, end };
  }

  if (req.dateRange?.start && req.dateRange?.end) {
    if (req.dateRange.start > req.dateRange.end) {
      return res.status(400).json({
        error: 'Invalid date range',
        message: 'startDate must be before endDate'
      });
    }
  }

  next();
};

/**
 * Middleware to validate sort parameters
 */
export const validateSort = (allowedFields = []) => {
  return (req, res, next) => {
    const { sortBy, sortOrder = 'asc' } = req.query;

    if (sortBy) {
      if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
        return res.status(400).json({
          error: 'Invalid sort field',
          message: `sortBy must be one of: ${allowedFields.join(', ')}`
        });
      }

      if (!['asc', 'desc'].includes(sortOrder.toLowerCase())) {
        return res.status(400).json({
          error: 'Invalid sort order',
          message: 'sortOrder must be either "asc" or "desc"'
        });
      }

      req.sort = {
        field: sortBy,
        order: sortOrder.toLowerCase()
      };
    }

    next();
  };
};

export default {
  validate,
  sanitizeRequest,
  isValidUUID,
  isValidEmail,
  isValidOrgId,
  isValidUserId,
  isValidAssessmentId,
  createRateLimiter,
  validateContentType,
  validateRequestSize,
  validatePagination,
  validateDateRange,
  validateSort
};
