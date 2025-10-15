import express from 'express';
import {
  getCurrentOrganization,
  updateOrganization,
  getOrganizationStats,
  updateSettings
} from '../controllers/organizationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/me', getCurrentOrganization); // Get current organization
router.patch('/me', updateOrganization); // Update organization
router.get('/stats', getOrganizationStats); // Get organization statistics
router.patch('/settings', updateSettings); // Update settings

export default router;
