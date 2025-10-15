import express from 'express';
import {
  getBenchmarks,
  getBenchmarkById,
  compareAssessmentToBenchmark,
  getIndustries
} from '../controllers/benchmarkController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getBenchmarks); // Get benchmarks for organization's industry
router.get('/industries', getIndustries); // Get available industries
router.get('/:benchmarkId', getBenchmarkById); // Get specific benchmark
router.post('/compare', compareAssessmentToBenchmark); // Compare assessment to benchmark

export default router;
