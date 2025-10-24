import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
  logoutAll,
  refreshToken,
  syncAuth0User,
  forgotPassword,
  resetPassword,
  changePassword,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken); // Refresh access token
router.post('/sync-auth0', syncAuth0User); // Auth0 user sync endpoint
router.post('/forgot-password', forgotPasswordValidation, forgotPassword); // Request password reset
router.post('/reset-password', resetPasswordValidation, resetPassword); // Reset password with token

// Protected routes (require access token)
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', logout); // Logout can work with or without auth
router.post('/logout-all', authenticate, logoutAll); // Logout from all devices
router.post('/change-password', authenticate, changePasswordValidation, changePassword); // Change password

export default router;
