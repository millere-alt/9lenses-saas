import express from 'express';
import {
  createInvitation,
  getInvitations,
  getInvitationByToken,
  acceptInvitation,
  revokeInvitation,
  resendInvitation
} from '../controllers/invitationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/by-token/:token', getInvitationByToken); // Get invitation details by token
router.post('/:invitationId/accept', acceptInvitation); // Accept invitation

// Protected routes (authentication required)
router.post('/', authenticate, createInvitation); // Create invitation
router.get('/', authenticate, getInvitations); // Get all invitations for org
router.delete('/:invitationId', authenticate, revokeInvitation); // Revoke invitation
router.post('/:invitationId/resend', authenticate, resendInvitation); // Resend invitation

export default router;
