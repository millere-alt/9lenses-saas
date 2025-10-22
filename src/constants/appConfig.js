/**
 * Application Configuration Constants
 * Central location for all hardcoded values used across the application
 */

/**
 * LocalStorage keys used throughout the application
 */
export const STORAGE_KEYS = {
  SURVEY_PROGRESS: 'survey-progress-9vectors',
  USER: '9lenses_user',
  ASSESSMENT_DRAFT: 'assessment-draft-9vectors',
  TOKEN: 'token'
};

/**
 * API configuration constants
 */
export const API_CONFIG = {
  ASSESSMENT_LINK: 'https://9lenses.app/assessment',
  TIMEOUT: 30000,
  MAX_RETRIES: 3
};

/**
 * Available user roles for assessments
 */
export const ROLES = [
  'CEO / Executive',
  'Board Member',
  'Manager',
  'Employee',
  'Customer',
  'Partner',
  'Advisor',
  'Other'
];

/**
 * Assessment participant limits
 */
export const ASSESSMENT_LIMITS = {
  MIN_PARTICIPANTS: 1,
  MAX_PARTICIPANTS: 100
};

/**
 * UI Constants
 */
export const UI_CONSTANTS = {
  TOAST_DURATION: 3000,
  MODAL_TRANSITION: 300,
  DEBOUNCE_DELAY: 500
};
