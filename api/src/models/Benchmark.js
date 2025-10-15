import { createItem, queryItems, getItemById, updateItem } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const CONTAINER_NAME = 'benchmarks';

/**
 * Benchmark Model
 * Stores industry benchmarking data for comparison
 */
export class Benchmark {
  /**
   * Create benchmark data
   */
  static async create(benchmarkData) {
    const benchmarkId = `benchmark_${uuidv4()}`;

    const benchmark = {
      id: benchmarkId,
      type: 'benchmark',
      industry: benchmarkData.industry,
      companySize: benchmarkData.companySize, // small, medium, large, enterprise
      region: benchmarkData.region || 'global',
      year: benchmarkData.year || new Date().getFullYear(),
      vectorScores: benchmarkData.vectorScores || {}, // { vectorId: score }
      participantCount: benchmarkData.participantCount || 0,
      metadata: {
        source: benchmarkData.source || 'internal',
        dataQuality: benchmarkData.dataQuality || 'high',
        lastUpdated: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await createItem(CONTAINER_NAME, benchmark);
  }

  /**
   * Find benchmark by ID
   */
  static async findById(benchmarkId) {
    return await getItemById(CONTAINER_NAME, benchmarkId, benchmarkId);
  }

  /**
   * Find benchmarks by industry
   */
  static async findByIndustry(industry, companySize = null, year = null) {
    let query = `
      SELECT * FROM c
      WHERE c.industry = @industry
      AND c.type = 'benchmark'
    `;
    const parameters = [{ name: '@industry', value: industry }];

    if (companySize) {
      query += ` AND c.companySize = @companySize`;
      parameters.push({ name: '@companySize', value: companySize });
    }

    if (year) {
      query += ` AND c.year = @year`;
      parameters.push({ name: '@year', value: year });
    }

    query += ` ORDER BY c.year DESC`;

    return await queryItems(CONTAINER_NAME, query, parameters);
  }

  /**
   * Get all industries with benchmarks
   */
  static async getIndustries() {
    const query = `
      SELECT DISTINCT c.industry
      FROM c
      WHERE c.type = 'benchmark'
      ORDER BY c.industry
    `;
    return await queryItems(CONTAINER_NAME, query);
  }

  /**
   * Update benchmark
   */
  static async update(benchmarkId, updates) {
    return await updateItem(CONTAINER_NAME, benchmarkId, benchmarkId, updates);
  }

  /**
   * Calculate percentile for a score compared to benchmark
   */
  static calculatePercentile(score, benchmarkData) {
    // Simple percentile calculation
    // In production, this would use actual distribution data
    const mean = benchmarkData.mean || 5.0;
    const stdDev = benchmarkData.stdDev || 1.5;

    const zScore = (score - mean) / stdDev;
    const percentile = Math.round(normalCDF(zScore) * 100);

    return Math.max(0, Math.min(100, percentile));
  }

  /**
   * Compare assessment results to benchmark
   */
  static compareToB

enchmark(assessmentResults, benchmark) {
    const comparison = {
      vectorComparisons: {},
      overallComparison: null,
      percentile: null
    };

    // Compare each vector
    Object.keys(assessmentResults.vectorScores).forEach(vectorId => {
      const score = assessmentResults.vectorScores[vectorId];
      const benchmarkScore = benchmark.vectorScores[vectorId];

      if (benchmarkScore) {
        const difference = score - benchmarkScore.mean;
        const percentile = this.calculatePercentile(score, benchmarkScore);

        comparison.vectorComparisons[vectorId] = {
          score,
          benchmarkMean: benchmarkScore.mean,
          benchmarkMedian: benchmarkScore.median,
          difference,
          percentile,
          rating: getRating(percentile)
        };
      }
    });

    // Overall comparison
    if (assessmentResults.overallScore && benchmark.vectorScores.overall) {
      const overallBenchmark = benchmark.vectorScores.overall;
      comparison.overallComparison = {
        score: assessmentResults.overallScore,
        benchmarkMean: overallBenchmark.mean,
        difference: assessmentResults.overallScore - overallBenchmark.mean,
        percentile: this.calculatePercentile(assessmentResults.overallScore, overallBenchmark),
        rating: getRating(this.calculatePercentile(assessmentResults.overallScore, overallBenchmark))
      };
    }

    return comparison;
  }
}

/**
 * Normal cumulative distribution function
 */
function normalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
}

/**
 * Get rating based on percentile
 */
function getRating(percentile) {
  if (percentile >= 90) return 'Excellent';
  if (percentile >= 75) return 'Above Average';
  if (percentile >= 50) return 'Average';
  if (percentile >= 25) return 'Below Average';
  return 'Needs Improvement';
}

export default Benchmark;
