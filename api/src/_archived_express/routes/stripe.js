import express from 'express';
import {
  getPlans,
  createCheckout,
  createPortal,
  getCurrentSubscription,
  cancelCurrentSubscription,
  handleWebhook
} from '../controllers/stripeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Webhook route (must be before body parser)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.post('/create-checkout', authenticate, createCheckout);
router.post('/create-portal', authenticate, createPortal);
router.get('/subscription', authenticate, getCurrentSubscription);
router.post('/cancel-subscription', authenticate, cancelCurrentSubscription);

export default router;
