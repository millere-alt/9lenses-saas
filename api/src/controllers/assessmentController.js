import { Assessment } from '../models/Assessment.js';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler.js';

/**
 * Create assessment
 * POST /api/assessments
 */
export const createAssessment = asyncHandler(async (req, res) => {
  const { name, type, dueDate, participants, vectors, description } = req.body;
  const creatorId = req.user.id;
  const organizationId = req.user.organizationId;

  // Validate required fields
  if (!name || !type) {
    throw new ValidationError('Name and type are required');
  }

  // Check if creator has permission
  const creator = await User.findById(creatorId, organizationId);
  if (!creator || !['ceo', 'admin', 'executive', 'manager'].includes(creator.role)) {
    throw new AuthorizationError('You do not have permission to create assessments');
  }

  // Validate participants exist
  if (participants && participants.length > 0) {
    for (const participantId of participants) {
      const participant = await User.findById(participantId, organizationId);
      if (!participant) {
        throw new ValidationError(`User ${participantId} not found`);
      }
    }
  }

  // Create assessment
  const assessmentData = {
    name,
    type,
    description: description || '',
    organizationId,
    createdBy: creatorId,
    status: 'draft',
    dueDate: dueDate || null,
    participants: participants || [],
    vectors: vectors || [],
    responses: {},
    results: null
  };

  const assessment = await Assessment.create(assessmentData);

  res.status(201).json({
    message: 'Assessment created successfully',
    assessment
  });
});

/**
 * Get all assessments for organization
 * GET /api/assessments
 */
export const getAssessments = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const { status, type } = req.query;

  const assessments = await Assessment.findByOrganization(organizationId);

  // Apply filters
  let filteredAssessments = assessments;
  if (status) {
    filteredAssessments = filteredAssessments.filter(a => a.status === status);
  }
  if (type) {
    filteredAssessments = filteredAssessments.filter(a => a.type === type);
  }

  // Sort by created date (newest first)
  filteredAssessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    assessments: filteredAssessments,
    count: filteredAssessments.length
  });
});

/**
 * Get assessment by ID
 * GET /api/assessments/:assessmentId
 */
export const getAssessmentById = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const organizationId = req.user.organizationId;

  const assessment = await Assessment.findById(assessmentId, organizationId);

  if (!assessment) {
    throw new NotFoundError('Assessment');
  }

  res.json({ assessment });
});

/**
 * Update assessment
 * PATCH /api/assessments/:assessmentId
 */
export const updateAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const organizationId = req.user.organizationId;
  const updates = req.body;

  // Check if assessment exists
  const assessment = await Assessment.findById(assessmentId, organizationId);
  if (!assessment) {
    throw new NotFoundError('Assessment');
  }

  // Check if user has permission to update
  const user = await User.findById(req.user.id, organizationId);
  if (assessment.createdBy !== req.user.id && !['ceo', 'admin'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to update this assessment');
  }

  // Prevent updating certain fields if assessment is completed
  if (assessment.status === 'completed') {
    delete updates.participants;
    delete updates.vectors;
  }

  // Prevent updating sensitive fields
  delete updates.id;
  delete updates.organizationId;
  delete updates.createdBy;
  delete updates.responses; // Use separate endpoint for responses

  const updatedAssessment = await Assessment.update(assessmentId, organizationId, updates);

  res.json({
    message: 'Assessment updated successfully',
    assessment: updatedAssessment
  });
});

/**
 * Launch assessment (change status to active)
 * POST /api/assessments/:assessmentId/launch
 */
export const launchAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const organizationId = req.user.organizationId;

  const assessment = await Assessment.findById(assessmentId, organizationId);
  if (!assessment) {
    throw new NotFoundError('Assessment');
  }

  // Check if user has permission
  const user = await User.findById(req.user.id, organizationId);
  if (assessment.createdBy !== req.user.id && !['ceo', 'admin'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to launch this assessment');
  }

  // Validate assessment is ready to launch
  if (assessment.status !== 'draft') {
    throw new ValidationError('Only draft assessments can be launched');
  }

  if (!assessment.participants || assessment.participants.length === 0) {
    throw new ValidationError('Assessment must have at least one participant');
  }

  if (!assessment.vectors || assessment.vectors.length === 0) {
    throw new ValidationError('Assessment must have at least one vector');
  }

  // Update status to active
  const updatedAssessment = await Assessment.update(assessmentId, organizationId, {
    status: 'active',
    launchedAt: new Date().toISOString(),
    launchedBy: req.user.id
  });

  res.json({
    message: 'Assessment launched successfully',
    assessment: updatedAssessment
  });
});

/**
 * Submit response to assessment
 * POST /api/assessments/:assessmentId/responses
 */
export const submitResponse = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const { vectorId, answers } = req.body;
  const userId = req.user.id;
  const organizationId = req.user.organizationId;

  const assessment = await Assessment.findById(assessmentId, organizationId);
  if (!assessment) {
    throw new NotFoundError('Assessment');
  }

  // Check if user is a participant
  if (!assessment.participants.includes(userId)) {
    throw new AuthorizationError('You are not a participant in this assessment');
  }

  // Check if assessment is active
  if (assessment.status !== 'active') {
    throw new ValidationError('Assessment is not currently active');
  }

  // Validate vector exists in assessment
  const vector = assessment.vectors.find(v => v.id === vectorId);
  if (!vector) {
    throw new ValidationError('Vector not found in this assessment');
  }

  // Update responses
  const responses = assessment.responses || {};
  if (!responses[userId]) {
    responses[userId] = {};
  }
  responses[userId][vectorId] = {
    answers,
    submittedAt: new Date().toISOString()
  };

  const updatedAssessment = await Assessment.update(assessmentId, organizationId, {
    responses,
    'metadata.lastResponseAt': new Date().toISOString()
  });

  // Check if all participants have completed
  const allComplete = assessment.participants.every(participantId => {
    const participantResponses = responses[participantId];
    if (!participantResponses) return false;
    return assessment.vectors.every(v => participantResponses[v.id]);
  });

  if (allComplete) {
    await Assessment.update(assessmentId, organizationId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  }

  res.json({
    message: 'Response submitted successfully',
    assessment: updatedAssessment,
    allComplete
  });
});

/**
 * Get assessment results
 * GET /api/assessments/:assessmentId/results
 */
export const getAssessmentResults = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const organizationId = req.user.organizationId;

  const assessment = await Assessment.findById(assessmentId, organizationId);
  if (!assessment) {
    throw new NotFoundError('Assessment');
  }

  // Check if user has permission to view results
  const user = await User.findById(req.user.id, organizationId);
  const isParticipant = assessment.participants.includes(req.user.id);
  const isAdmin = ['ceo', 'admin', 'executive'].includes(user.role);

  if (!isParticipant && !isAdmin) {
    throw new AuthorizationError('You do not have permission to view these results');
  }

  // Calculate results if not already calculated
  let results = assessment.results;
  if (!results && assessment.status === 'completed') {
    results = calculateResults(assessment);
    await Assessment.update(assessmentId, organizationId, { results });
  }

  res.json({
    assessment: {
      id: assessment.id,
      name: assessment.name,
      type: assessment.type,
      status: assessment.status,
      completedAt: assessment.completedAt
    },
    results,
    responses: assessment.responses
  });
});

/**
 * Delete assessment
 * DELETE /api/assessments/:assessmentId
 */
export const deleteAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const organizationId = req.user.organizationId;

  const assessment = await Assessment.findById(assessmentId, organizationId);
  if (!assessment) {
    throw new NotFoundError('Assessment');
  }

  // Check if user has permission
  const user = await User.findById(req.user.id, organizationId);
  if (assessment.createdBy !== req.user.id && !['ceo', 'admin'].includes(user.role)) {
    throw new AuthorizationError('You do not have permission to delete this assessment');
  }

  await Assessment.delete(assessmentId, organizationId);

  res.json({
    message: 'Assessment deleted successfully'
  });
});

/**
 * Helper function to calculate assessment results
 */
function calculateResults(assessment) {
  const results = {
    vectorScores: {},
    participantScores: {},
    overallScore: 0,
    calculatedAt: new Date().toISOString()
  };

  // Calculate scores for each vector
  assessment.vectors.forEach(vector => {
    let totalScore = 0;
    let responseCount = 0;

    assessment.participants.forEach(participantId => {
      const participantResponses = assessment.responses[participantId];
      if (participantResponses && participantResponses[vector.id]) {
        const answers = participantResponses[vector.id].answers;
        const vectorScore = calculateVectorScore(answers);
        totalScore += vectorScore;
        responseCount++;

        // Store participant score for this vector
        if (!results.participantScores[participantId]) {
          results.participantScores[participantId] = {};
        }
        results.participantScores[participantId][vector.id] = vectorScore;
      }
    });

    results.vectorScores[vector.id] = responseCount > 0 ? totalScore / responseCount : 0;
  });

  // Calculate overall score (average of all vector scores)
  const vectorScoreValues = Object.values(results.vectorScores);
  results.overallScore = vectorScoreValues.length > 0
    ? vectorScoreValues.reduce((sum, score) => sum + score, 0) / vectorScoreValues.length
    : 0;

  return results;
}

/**
 * Helper function to calculate score for a vector based on answers
 */
function calculateVectorScore(answers) {
  // Simple average of answer values (assuming answers are numeric 1-10)
  const values = Object.values(answers).filter(v => typeof v === 'number');
  return values.length > 0
    ? values.reduce((sum, val) => sum + val, 0) / values.length
    : 0;
}

export default {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  launchAssessment,
  submitResponse,
  getAssessmentResults,
  deleteAssessment
};
