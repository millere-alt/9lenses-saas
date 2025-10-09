import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Get all assessments for organization
router.get('/', authenticate, async (req, res) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        organizationId: req.user.organizationId
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        responses: {
          include: {
            participant: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(assessments);
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Get single assessment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      },
      include: {
        createdBy: true,
        responses: {
          include: {
            participant: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        },
        aiAnalyses: true
      }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// Create assessment
router.post('/',
  authenticate,
  authorize('ADMIN', 'ORG_OWNER', 'MANAGER'),
  [
    body('title').trim().notEmpty(),
    body('participantEmails').isArray(),
    body('lensesIncluded').isArray(),
    body('questions').isObject()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, participantEmails, lensesIncluded, questions, startDate, endDate } = req.body;

      const assessment = await prisma.assessment.create({
        data: {
          title,
          description,
          organizationId: req.user.organizationId,
          createdById: req.user.id,
          participantEmails,
          lensesIncluded,
          questions,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status: 'DRAFT'
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      });

      // Emit socket event
      const io = req.app.get('io');
      io.to(`org:${req.user.organizationId}`).emit('assessment:created', assessment);

      res.status(201).json(assessment);
    } catch (error) {
      console.error('Create assessment error:', error);
      res.status(500).json({ error: 'Failed to create assessment' });
    }
  }
);

// Update assessment
router.put('/:id',
  authenticate,
  authorize('ADMIN', 'ORG_OWNER', 'MANAGER'),
  async (req, res) => {
    try {
      const { title, description, status, participantEmails, lensesIncluded, questions } = req.body;

      const assessment = await prisma.assessment.findFirst({
        where: {
          id: req.params.id,
          organizationId: req.user.organizationId
        }
      });

      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      const updated = await prisma.assessment.update({
        where: { id: req.params.id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          ...(participantEmails && { participantEmails }),
          ...(lensesIncluded && { lensesIncluded }),
          ...(questions && { questions })
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Update assessment error:', error);
      res.status(500).json({ error: 'Failed to update assessment' });
    }
  }
);

// Submit response
router.post('/:id/responses', authenticate, async (req, res) => {
  try {
    const { answers } = req.body;

    const assessment = await prisma.assessment.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const response = await prisma.assessmentResponse.upsert({
      where: {
        assessmentId_participantId: {
          assessmentId: req.params.id,
          participantId: req.user.id
        }
      },
      create: {
        assessmentId: req.params.id,
        participantId: req.user.id,
        answers,
        completedAt: new Date()
      },
      update: {
        answers,
        completedAt: new Date()
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Delete assessment
router.delete('/:id',
  authenticate,
  authorize('ADMIN', 'ORG_OWNER'),
  async (req, res) => {
    try {
      const assessment = await prisma.assessment.findFirst({
        where: {
          id: req.params.id,
          organizationId: req.user.organizationId
        }
      });

      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      await prisma.assessment.delete({
        where: { id: req.params.id }
      });

      res.json({ message: 'Assessment deleted successfully' });
    } catch (error) {
      console.error('Delete assessment error:', error);
      res.status(500).json({ error: 'Failed to delete assessment' });
    }
  }
);

export default router;
