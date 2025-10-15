import express from 'express';
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  launchAssessment,
  submitResponse,
  getAssessmentResults,
  deleteAssessment
} from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', createAssessment); // Create assessment
router.get('/', getAssessments); // Get all assessments
router.get('/:assessmentId', getAssessmentById); // Get specific assessment
router.patch('/:assessmentId', updateAssessment); // Update assessment
router.delete('/:assessmentId', deleteAssessment); // Delete assessment

// Assessment actions
router.post('/:assessmentId/launch', launchAssessment); // Launch assessment
router.post('/:assessmentId/responses', submitResponse); // Submit response
router.get('/:assessmentId/results', getAssessmentResults); // Get results

export default router;
