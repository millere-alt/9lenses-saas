import express from 'express';
import {
  getCurrentUser,
  updateCurrentUser,
  getUserById,
  getOrganizationUsers,
  getLeadershipTeam,
  updateUserRole,
  deactivateUser,
  reactivateUser
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Current user routes
router.get('/me', getCurrentUser); // Get current user profile
router.patch('/me', updateCurrentUser); // Update current user profile

// Leadership team
router.get('/leadership', getLeadershipTeam); // Get leadership team

// Organization users
router.get('/', getOrganizationUsers); // Get all users in organization
router.get('/:userId', getUserById); // Get specific user

// Admin routes
router.patch('/:userId/role', updateUserRole); // Update user role (admin only)
router.delete('/:userId', deactivateUser); // Deactivate user (admin only)
router.post('/:userId/reactivate', reactivateUser); // Reactivate user (admin only)

export default router;
