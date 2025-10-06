import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Track event
router.post('/track', authenticate, async (req, res) => {
  try {
    const { eventName, properties } = req.body;

    await prisma.analyticsEvent.create({
      data: {
        eventName,
        userId: req.user.id,
        sessionId: req.headers['x-session-id'],
        properties
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Get analytics dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.user.id,
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      where,
      _count: true
    });

    const totalEvents = await prisma.analyticsEvent.count({ where });

    res.json({
      totalEvents,
      eventBreakdown: events
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
