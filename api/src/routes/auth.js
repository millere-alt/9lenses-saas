import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
  logoutAll,
  refreshToken,
  syncAuth0User,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken); // Refresh access token
router.post('/sync-auth0', syncAuth0User); // Auth0 user sync endpoint

// Protected routes (require access token)
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', logout); // Logout can work with or without auth
router.post('/logout-all', authenticate, logoutAll); // Logout from all devices

export default router;
