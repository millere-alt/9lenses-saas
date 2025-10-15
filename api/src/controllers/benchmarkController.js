import { Benchmark } from '../models/Benchmark.js';
import { Assessment } from '../models/Assessment.js';
import { Organization } from '../models/Organization.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

/**
 * Get available benchmarks for organization's industry
 * GET /api/benchmarks
 */
export const getBenchmarks = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const { companySize, year } = req.query;

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new NotFoundError('Organization');
  }

  const industry = organization.industry || 'Technology';
  const benchmarks = await Benchmark.findByIndustry(industry, companySize, year ? parseInt(year) : null);

  res.json({
    industry,
    benchmarks,
    count: benchmarks.length
  });
});

/**
 * Get benchmark by ID
 * GET /api/benchmarks/:benchmarkId
 */
export const getBenchmarkById = asyncHandler(async (req, res) => {
  const { benchmarkId } = req.params;

  const benchmark = await Benchmark.findById(benchmarkId);
  if (!benchmark) {
    throw new NotFoundError('Benchmark');
  }

  res.json({ benchmark });
});

/**
 * Compare assessment to benchmark
 * POST /api/benchmarks/compare
 */
export const compareAssessmentToBenchmark = asyncHandler(async (req, res) => {
  const { assessmentId, benchmarkId } = req.body;
  const organizationId = req.user.organizationId;

  if (!assessmentId) {
    throw new ValidationError('Assessment ID is required');
  }

  // Get assessment
  const assessment = await Assessment.findById(assessmentId, organizationId);
  if (!assessment) {
    throw new NotFoundError('Assessment');
  }

  if (assessment.status !== 'completed') {
    throw new ValidationError('Assessment must be completed to compare to benchmarks');
  }

  // Get benchmark (use provided or find best match)
  let benchmark;
  if (benchmarkId) {
    benchmark = await Benchmark.findById(benchmarkId);
    if (!benchmark) {
      throw new NotFoundError('Benchmark');
    }
  } else {
    // Find best matching benchmark
    const organization = await Organization.findById(organizationId);
    const industry = organization.industry || 'Technology';
    const companySize = determineCompanySize(organization);
    const currentYear = new Date().getFullYear();

    const benchmarks = await Benchmark.findByIndustry(industry, companySize, currentYear);
    if (benchmarks.length === 0) {
      // Try without company size filter
      const fallbackBenchmarks = await Benchmark.findByIndustry(industry, null, currentYear);
      if (fallbackBenchmarks.length === 0) {
        throw new NotFoundError('No benchmarks available for your industry');
      }
      benchmark = fallbackBenchmarks[0];
    } else {
      benchmark = benchmarks[0];
    }
  }

  // Compare results
  const comparison = Benchmark.compareToB

enchmark(assessment.results, benchmark);

  res.json({
    assessment: {
      id: assessment.id,
      name: assessment.name,
      completedAt: assessment.completedAt
    },
    benchmark: {
      id: benchmark.id,
      industry: benchmark.industry,
      companySize: benchmark.companySize,
      year: benchmark.year,
      participantCount: benchmark.participantCount
    },
    comparison
  });
});

/**
 * Get available industries
 * GET /api/benchmarks/industries
 */
export const getIndustries = asyncHandler(async (req, res) => {
  const industries = await Benchmark.getIndustries();

  res.json({
    industries: industries.map(i => i.industry),
    count: industries.length
  });
});

/**
 * Helper function to determine company size
 */
function determineCompanySize(organization) {
  // This is a simple heuristic - in production, use actual employee count
  const employeeCount = organization.metadata?.employeeCount || 0;

  if (employeeCount < 50) return 'small';
  if (employeeCount < 250) return 'medium';
  if (employeeCount < 1000) return 'large';
  return 'enterprise';
}

export default {
  getBenchmarks,
  getBenchmarkById,
  compareAssessmentToBenchmark,
  getIndustries
};
