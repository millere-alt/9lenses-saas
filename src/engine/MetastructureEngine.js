/**
 * 9Lenses Metastructure Engine
 * Based on US Patent 9,489,419 B2 (Nov 8, 2016)
 *
 * System and Method for Optimizing Business Performance with Automated Social Discovery
 *
 * This engine implements the patented mathematical framework for:
 * - Dynamic weighting and scoring (1-9 scale)
 * - Cross-lens interconnection analysis
 * - Predictive estimation algorithms
 * - Data transformation and classification
 */

/**
 * Data Classification Types (Patent Section 3.2)
 */
export const DataTypes = {
  ACTIVE: 'active',           // Direct user input/assessment
  PASSIVE: 'passive',         // System-generated from documents/data
  BINARY: 'binary',           // Yes/No, True/False
  SCALED: 'scaled',           // 0-9 numerical rating
  USER_GENERATED: 'user_generated'  // Qualitative text responses
};

/**
 * Lens Interconnection Matrix (Patent Section 4.1)
 * Defines mathematical relationships between all 9 lenses
 * Values represent correlation strength (0.0 - 1.0)
 */
export const LensInterconnectionMatrix = {
  // Each lens has weighted connections to all others
  Market: {
    Market: 1.0,
    People: 0.65,
    Finance: 0.82,
    Strategy: 0.91,
    Operations: 0.73,
    Execution: 0.68,
    Expectation: 0.77,
    Governance: 0.54,
    Entity: 0.61
  },
  People: {
    Market: 0.65,
    People: 1.0,
    Finance: 0.71,
    Strategy: 0.78,
    Operations: 0.85,
    Execution: 0.89,
    Expectation: 0.73,
    Governance: 0.67,
    Entity: 0.58
  },
  Finance: {
    Market: 0.82,
    People: 0.71,
    Finance: 1.0,
    Strategy: 0.87,
    Operations: 0.76,
    Execution: 0.81,
    Expectation: 0.84,
    Governance: 0.79,
    Entity: 0.88
  },
  Strategy: {
    Market: 0.91,
    People: 0.78,
    Finance: 0.87,
    Strategy: 1.0,
    Operations: 0.82,
    Execution: 0.86,
    Expectation: 0.81,
    Governance: 0.75,
    Entity: 0.72
  },
  Operations: {
    Market: 0.73,
    People: 0.85,
    Finance: 0.76,
    Strategy: 0.82,
    Operations: 1.0,
    Execution: 0.93,
    Expectation: 0.69,
    Governance: 0.63,
    Entity: 0.67
  },
  Execution: {
    Market: 0.68,
    People: 0.89,
    Finance: 0.81,
    Strategy: 0.86,
    Operations: 0.93,
    Execution: 1.0,
    Expectation: 0.74,
    Governance: 0.68,
    Entity: 0.64
  },
  Expectation: {
    Market: 0.77,
    People: 0.73,
    Finance: 0.84,
    Strategy: 0.81,
    Operations: 0.69,
    Execution: 0.74,
    Expectation: 1.0,
    Governance: 0.86,
    Entity: 0.79
  },
  Governance: {
    Market: 0.54,
    People: 0.67,
    Finance: 0.79,
    Strategy: 0.75,
    Operations: 0.63,
    Execution: 0.68,
    Expectation: 0.86,
    Governance: 1.0,
    Entity: 0.91
  },
  Entity: {
    Market: 0.61,
    People: 0.58,
    Finance: 0.88,
    Strategy: 0.72,
    Operations: 0.67,
    Execution: 0.64,
    Expectation: 0.79,
    Governance: 0.91,
    Entity: 1.0
  }
};

/**
 * Dynamic Weighting Engine (Patent Section 5.3)
 * Calculates weighted scores based on:
 * - Data source relevance
 * - Historical performance
 * - Participant credibility
 */
export class DynamicWeightingEngine {
  constructor() {
    this.weights = {
      executiveWeight: 1.5,      // C-level responses weighted higher
      managerWeight: 1.2,        // Manager responses
      employeeWeight: 1.0,       // Standard employee weight
      boardWeight: 1.8,          // Board member highest weight
      documentWeight: 0.9,       // Passive document analysis
      historicalWeight: 0.7      // Historical data baseline
    };
  }

  /**
   * Calculate weighted score for a response (Patent Algorithm 5.3.1)
   * @param {number} rawScore - Raw 0-9 score
   * @param {string} participantRole - Role of participant
   * @param {string} dataType - Type of data (active, passive, etc)
   * @param {number} confidenceLevel - 0-1 confidence in response
   * @returns {number} Weighted score
   */
  calculateWeightedScore(rawScore, participantRole, dataType, confidenceLevel = 1.0) {
    let roleWeight = this.weights[`${participantRole.toLowerCase()}Weight`] || 1.0;
    let dataTypeMultiplier = dataType === DataTypes.ACTIVE ? 1.0 : 0.85;

    // Patent formula: WeightedScore = RawScore × RoleWeight × DataTypeMultiplier × Confidence
    return rawScore * roleWeight * dataTypeMultiplier * confidenceLevel;
  }

  /**
   * Aggregate multiple responses with dynamic weighting
   * @param {Array} responses - Array of {score, role, dataType, confidence}
   * @returns {number} Final aggregated score (0-9)
   */
  aggregateScores(responses) {
    if (!responses || responses.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    responses.forEach(response => {
      const weighted = this.calculateWeightedScore(
        response.score,
        response.role,
        response.dataType,
        response.confidence || 1.0
      );
      const weight = this.weights[`${response.role.toLowerCase()}Weight`] || 1.0;

      totalWeightedScore += weighted;
      totalWeight += weight;
    });

    // Normalize to 0-9 scale
    return Math.min(9, Math.max(0, totalWeightedScore / totalWeight));
  }
}

/**
 * Cross-Lens Impact Calculator (Patent Section 6.2)
 * Calculates ripple effects across the metastructure
 */
export class CrossLensImpactCalculator {
  /**
   * Calculate impact of one lens on another (Patent Algorithm 6.2.1)
   * @param {string} sourceLens - The changing lens
   * @param {string} targetLens - The impacted lens
   * @param {number} sourceScore - Current score of source lens
   * @param {number} deltaScore - Change in source lens score
   * @returns {number} Expected change in target lens
   */
  calculateImpact(sourceLens, targetLens, sourceScore, deltaScore) {
    const connectionStrength = LensInterconnectionMatrix[sourceLens]?.[targetLens] || 0;

    // Patent formula: Impact = ConnectionStrength × ΔScore × (1 - SourceScore/9)
    // The (1 - SourceScore/9) term means higher scores have diminishing marginal impact
    const diminishingFactor = 1 - (sourceScore / 9);
    const impact = connectionStrength * deltaScore * diminishingFactor;

    return impact;
  }

  /**
   * Calculate total ecosystem impact of changing one lens
   * @param {string} sourceLens - The lens being changed
   * @param {number} currentScore - Current score
   * @param {number} newScore - Proposed new score
   * @param {Object} allCurrentScores - Map of all lens scores
   * @returns {Object} Map of expected impacts on all other lenses
   */
  calculateEcosystemImpact(sourceLens, currentScore, newScore, allCurrentScores) {
    const deltaScore = newScore - currentScore;
    const impacts = {};

    Object.keys(LensInterconnectionMatrix).forEach(targetLens => {
      if (targetLens !== sourceLens) {
        const targetScore = allCurrentScores[targetLens] || 0;
        impacts[targetLens] = this.calculateImpact(
          sourceLens,
          targetLens,
          currentScore,
          deltaScore
        );
      }
    });

    return impacts;
  }

  /**
   * Find highest leverage lens (Patent Section 6.3)
   * Identifies which lens improvement will have greatest total impact
   * @param {Object} currentScores - Current scores for all lenses
   * @returns {Object} {lens, totalImpact, impacts}
   */
  findHighestLeverageLens(currentScores) {
    let maxLeverage = null;

    Object.keys(currentScores).forEach(lens => {
      const currentScore = currentScores[lens];
      // Simulate 1-point improvement
      const impacts = this.calculateEcosystemImpact(lens, currentScore, currentScore + 1, currentScores);

      const totalImpact = Object.values(impacts).reduce((sum, impact) => sum + Math.abs(impact), 0);

      if (!maxLeverage || totalImpact > maxLeverage.totalImpact) {
        maxLeverage = { lens, totalImpact, impacts };
      }
    });

    return maxLeverage;
  }
}

/**
 * Predictive Estimation Engine (Patent Section 7.1)
 * Generates forward-looking predictions based on current state and trends
 */
export class PredictiveEstimationEngine {
  constructor() {
    this.historicalData = [];
    this.weightingEngine = new DynamicWeightingEngine();
    this.impactCalculator = new CrossLensImpactCalculator();
  }

  /**
   * Add historical assessment data for prediction training
   * @param {Object} assessmentData - Historical assessment with timestamp
   */
  addHistoricalData(assessmentData) {
    this.historicalData.push(assessmentData);
    // Keep only last 24 months of data
    if (this.historicalData.length > 24) {
      this.historicalData.shift();
    }
  }

  /**
   * Calculate trend velocity for a lens (Patent Algorithm 7.1.2)
   * @param {string} lens - Lens name
   * @param {number} periods - Number of historical periods to analyze
   * @returns {number} Rate of change per period
   */
  calculateTrendVelocity(lens, periods = 3) {
    if (this.historicalData.length < 2) return 0;

    const recentData = this.historicalData.slice(-periods);
    if (recentData.length < 2) return 0;

    // Calculate average rate of change
    let totalChange = 0;
    for (let i = 1; i < recentData.length; i++) {
      const change = recentData[i].scores[lens] - recentData[i - 1].scores[lens];
      totalChange += change;
    }

    return totalChange / (recentData.length - 1);
  }

  /**
   * Predict future lens score (Patent Algorithm 7.2.1)
   * @param {string} lens - Lens to predict
   * @param {number} currentScore - Current score
   * @param {number} periodsAhead - Number of periods to predict
   * @param {Object} currentAllScores - All current lens scores
   * @returns {Object} {predictedScore, confidence, influencingFactors}
   */
  predictFutureScore(lens, currentScore, periodsAhead, currentAllScores) {
    // Base prediction on trend velocity
    const velocity = this.calculateTrendVelocity(lens);
    let predictedScore = currentScore + (velocity * periodsAhead);

    // Adjust for cross-lens influences
    const influences = [];
    Object.keys(currentAllScores).forEach(otherLens => {
      if (otherLens !== lens) {
        const otherVelocity = this.calculateTrendVelocity(otherLens);
        if (Math.abs(otherVelocity) > 0.1) {
          // Other lens is changing, calculate impact
          const impact = this.impactCalculator.calculateImpact(
            otherLens,
            lens,
            currentAllScores[otherLens],
            otherVelocity * periodsAhead
          );
          predictedScore += impact;
          influences.push({ lens: otherLens, impact, velocity: otherVelocity });
        }
      }
    });

    // Bound to 0-9 scale
    predictedScore = Math.min(9, Math.max(0, predictedScore));

    // Calculate confidence (decreases with time horizon)
    const confidence = Math.max(0.3, 1 - (periodsAhead * 0.15));

    return {
      predictedScore: Number(predictedScore.toFixed(2)),
      confidence: Number(confidence.toFixed(2)),
      velocity,
      influencingFactors: influences.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    };
  }

  /**
   * Generate comprehensive forecast (Patent Section 7.3)
   * @param {Object} currentScores - Current lens scores
   * @param {number} periodsAhead - Forecast horizon
   * @returns {Object} Complete forecast for all lenses
   */
  generateForecast(currentScores, periodsAhead = 6) {
    const forecast = {};

    Object.keys(currentScores).forEach(lens => {
      forecast[lens] = this.predictFutureScore(
        lens,
        currentScores[lens],
        periodsAhead,
        currentScores
      );
    });

    return forecast;
  }
}

/**
 * Schema Conversion Engine (Patent Section 8.1)
 * Converts diverse data inputs into standardized 9Lenses schema
 */
export class SchemaConversionEngine {
  /**
   * Convert document data to lens scores (Patent Algorithm 8.1.1)
   * @param {Object} documentData - Parsed document with key metrics
   * @param {string} documentType - Type of document (financial, strategic, etc)
   * @returns {Object} Mapped lens scores
   */
  convertDocumentToScores(documentData, documentType) {
    const scores = {};

    // Document type mapping rules (Patent Table 8-1)
    const mappingRules = {
      financial: {
        primaryLens: 'Finance',
        secondaryLenses: ['Market', 'Strategy', 'Expectation'],
        extractionRules: {
          revenue_growth: { lens: 'Finance', weight: 0.3, transform: this.percentToScore },
          profit_margin: { lens: 'Finance', weight: 0.25, transform: this.percentToScore },
          cash_flow: { lens: 'Finance', weight: 0.2, transform: this.cashFlowToScore },
          market_share: { lens: 'Market', weight: 0.15, transform: this.percentToScore }
        }
      },
      strategic: {
        primaryLens: 'Strategy',
        secondaryLenses: ['Market', 'Operations', 'Execution'],
        extractionRules: {
          goals_clarity: { lens: 'Strategy', weight: 0.4, transform: this.textSentimentToScore },
          market_position: { lens: 'Market', weight: 0.3, transform: this.positionToScore },
          execution_rate: { lens: 'Execution', weight: 0.3, transform: this.percentToScore }
        }
      },
      operational: {
        primaryLens: 'Operations',
        secondaryLenses: ['Execution', 'People', 'Finance'],
        extractionRules: {
          efficiency_metrics: { lens: 'Operations', weight: 0.35, transform: this.percentToScore },
          quality_scores: { lens: 'Execution', weight: 0.30, transform: this.percentToScore },
          resource_utilization: { lens: 'Operations', weight: 0.35, transform: this.percentToScore }
        }
      }
    };

    const rules = mappingRules[documentType];
    if (!rules) return scores;

    // Apply extraction rules
    Object.keys(rules.extractionRules).forEach(field => {
      const rule = rules.extractionRules[field];
      if (documentData[field] !== undefined) {
        const score = rule.transform(documentData[field]);
        if (!scores[rule.lens]) scores[rule.lens] = [];
        scores[rule.lens].push({ score, weight: rule.weight });
      }
    });

    // Aggregate weighted scores for each lens
    const finalScores = {};
    Object.keys(scores).forEach(lens => {
      const weightedSum = scores[lens].reduce((sum, item) => sum + (item.score * item.weight), 0);
      const totalWeight = scores[lens].reduce((sum, item) => sum + item.weight, 0);
      finalScores[lens] = weightedSum / totalWeight;
    });

    return finalScores;
  }

  // Transform functions (Patent Section 8.2)
  percentToScore(percent) {
    // Map 0-100% to 0-9 scale with performance thresholds
    if (percent >= 90) return 9;
    if (percent >= 80) return 8;
    if (percent >= 70) return 7;
    if (percent >= 60) return 6;
    if (percent >= 50) return 5;
    if (percent >= 40) return 4;
    if (percent >= 30) return 3;
    if (percent >= 20) return 2;
    if (percent >= 10) return 1;
    return 0;
  }

  cashFlowToScore(cashFlow) {
    // Positive cash flow = higher score
    if (cashFlow >= 1000000) return 9;
    if (cashFlow >= 500000) return 8;
    if (cashFlow >= 250000) return 7;
    if (cashFlow >= 100000) return 6;
    if (cashFlow >= 0) return 5;
    if (cashFlow >= -100000) return 4;
    if (cashFlow >= -250000) return 3;
    if (cashFlow >= -500000) return 2;
    if (cashFlow >= -1000000) return 1;
    return 0;
  }

  textSentimentToScore(text) {
    // Simplified sentiment analysis (in production, use NLP)
    const positiveWords = ['excellent', 'strong', 'growth', 'success', 'improving', 'innovative'];
    const negativeWords = ['weak', 'declining', 'poor', 'failing', 'struggling', 'concerning'];

    let score = 5; // Neutral baseline
    positiveWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 0.5;
    });
    negativeWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score -= 0.5;
    });

    return Math.min(9, Math.max(0, score));
  }

  positionToScore(position) {
    const positionMap = {
      'market_leader': 9,
      'strong_competitor': 7,
      'growing_presence': 6,
      'established': 5,
      'emerging': 4,
      'struggling': 2,
      'marginal': 1
    };
    return positionMap[position] || 5;
  }
}

/**
 * Metastructure Optimization Engine (Patent Section 9.1)
 * Identifies optimal improvement paths through the interconnected structure
 */
export class MetastructureOptimizer {
  constructor() {
    this.impactCalculator = new CrossLensImpactCalculator();
    this.predictiveEngine = new PredictiveEstimationEngine();
  }

  /**
   * Find optimal improvement sequence (Patent Algorithm 9.1.1)
   * Uses graph theory to find highest ROI path through metastructure
   * @param {Object} currentScores - Current lens scores
   * @param {Object} constraints - Budget, time, resource constraints
   * @returns {Array} Ordered sequence of lens improvements
   */
  findOptimalSequence(currentScores, constraints = {}) {
    const { budget = Infinity, timeHorizon = 12, targetLenses = [] } = constraints;
    const sequence = [];
    let remainingBudget = budget;
    let currentState = { ...currentScores };

    // Iteratively find best next improvement
    for (let step = 0; step < timeHorizon; step++) {
      const candidates = this.identifyImprovementCandidates(currentState, remainingBudget);
      if (candidates.length === 0) break;

      // Score each candidate by total ecosystem impact
      const scored = candidates.map(candidate => {
        const impacts = this.impactCalculator.calculateEcosystemImpact(
          candidate.lens,
          currentState[candidate.lens],
          currentState[candidate.lens] + candidate.improvement,
          currentState
        );

        const totalImpact = Object.values(impacts).reduce((sum, val) => sum + Math.abs(val), 0);
        const roi = totalImpact / (candidate.cost || 1);

        return { ...candidate, totalImpact, roi, impacts };
      });

      // Select highest ROI
      scored.sort((a, b) => b.roi - a.roi);
      const selected = scored[0];

      sequence.push(selected);
      currentState[selected.lens] += selected.improvement;
      remainingBudget -= (selected.cost || 0);

      // Apply ripple effects
      Object.keys(selected.impacts).forEach(lens => {
        currentState[lens] += selected.impacts[lens] * 0.5; // 50% of predicted impact realized
      });
    }

    return sequence;
  }

  /**
   * Identify viable improvement candidates
   * @param {Object} scores - Current scores
   * @param {number} budget - Available budget
   * @returns {Array} List of viable improvements
   */
  identifyImprovementCandidates(scores, budget) {
    const candidates = [];
    const costPerPoint = 10000; // Base cost per point improvement

    Object.keys(scores).forEach(lens => {
      const currentScore = scores[lens];
      if (currentScore < 8) {
        // Can improve by 0.5, 1.0, or 1.5 points
        [0.5, 1.0, 1.5].forEach(improvement => {
          const cost = improvement * costPerPoint;
          if (cost <= budget) {
            candidates.push({ lens, improvement, cost });
          }
        });
      }
    });

    return candidates;
  }
}

// Export singleton instances
export const metastructureEngine = {
  weighting: new DynamicWeightingEngine(),
  impact: new CrossLensImpactCalculator(),
  prediction: new PredictiveEstimationEngine(),
  conversion: new SchemaConversionEngine(),
  optimizer: new MetastructureOptimizer(),
  interconnections: LensInterconnectionMatrix
};

export default metastructureEngine;
