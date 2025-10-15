import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
  syncAuth0User,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/sync-auth0', syncAuth0User); // Auth0 user sync endpoint

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;
