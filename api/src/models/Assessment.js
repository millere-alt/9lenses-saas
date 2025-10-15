import { createItem, queryItems, getItemById, updateItem, deleteItem } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const CONTAINER_NAME = 'assessments';

/**
 * Assessment Model
 * Manages organizational assessments
 */
export class Assessment {
  /**
   * Create a new assessment
   */
  static async create(assessmentData) {
    const assessmentId = `assessment_${uuidv4()}`;

    const assessment = {
      id: assessmentId,
      type: 'assessment',
      organizationId: assessmentData.organizationId,
      name: assessmentData.name,
      assessmentType: assessmentData.type, // Changed from 'type' to avoid conflict
      description: assessmentData.description || '',
      status: assessmentData.status || 'draft', // draft, active, completed, archived
      createdBy: assessmentData.createdBy,
      launchedBy: null,
      launchedAt: null,
      completedAt: null,
      dueDate: assessmentData.dueDate || null,
      participants: assessmentData.participants || [],
      vectors: assessmentData.vectors || [],
      responses: assessmentData.responses || {},
      results: assessmentData.results || null,
      metadata: {
        lastResponseAt: null,
        responseCount: 0,
        completionPercentage: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await createItem(CONTAINER_NAME, assessment);
  }

  /**
   * Find assessment by ID
   */
  static async findById(assessmentId, organizationId) {
    return await getItemById(CONTAINER_NAME, assessmentId, organizationId);
  }

  /**
   * Find all assessments for an organization
   */
  static async findByOrganization(organizationId) {
    const query = `
      SELECT * FROM c
      WHERE c.organizationId = @organizationId
      AND c.type = 'assessment'
      ORDER BY c.createdAt DESC
    `;
    const parameters = [{ name: '@organizationId', value: organizationId }];
    return await queryItems(CONTAINER_NAME, query, parameters);
  }

  /**
   * Find assessments by status
   */
  static async findByStatus(organizationId, status) {
    const query = `
      SELECT * FROM c
      WHERE c.organizationId = @organizationId
      AND c.type = 'assessment'
      AND c.status = @status
      ORDER BY c.createdAt DESC
    `;
    const parameters = [
      { name: '@organizationId', value: organizationId },
      { name: '@status', value: status }
    ];
    return await queryItems(CONTAINER_NAME, query, parameters);
  }

  /**
   * Find assessments by participant
   */
  static async findByParticipant(organizationId, userId) {
    const query = `
      SELECT * FROM c
      WHERE c.organizationId = @organizationId
      AND c.type = 'assessment'
      AND ARRAY_CONTAINS(c.participants, @userId)
      ORDER BY c.createdAt DESC
    `;
    const parameters = [
      { name: '@organizationId', value: organizationId },
      { name: '@userId', value: userId }
    ];
    return await queryItems(CONTAINER_NAME, query, parameters);
  }

  /**
   * Update assessment
   */
  static async update(assessmentId, organizationId, updates) {
    return await updateItem(CONTAINER_NAME, assessmentId, organizationId, updates);
  }

  /**
   * Delete assessment
   */
  static async delete(assessmentId, organizationId) {
    return await deleteItem(CONTAINER_NAME, assessmentId, organizationId);
  }

  /**
   * Add participant to assessment
   */
  static async addParticipant(assessmentId, organizationId, userId) {
    const assessment = await this.findById(assessmentId, organizationId);
    if (!assessment) return null;

    if (!assessment.participants.includes(userId)) {
      const participants = [...assessment.participants, userId];
      return await this.update(assessmentId, organizationId, { participants });
    }

    return assessment;
  }

  /**
   * Remove participant from assessment
   */
  static async removeParticipant(assessmentId, organizationId, userId) {
    const assessment = await this.findById(assessmentId, organizationId);
    if (!assessment) return null;

    const participants = assessment.participants.filter(id => id !== userId);
    return await this.update(assessmentId, organizationId, { participants });
  }

  /**
   * Calculate completion percentage
   */
  static calculateCompletion(assessment) {
    if (!assessment.participants || assessment.participants.length === 0) return 0;
    if (!assessment.vectors || assessment.vectors.length === 0) return 0;

    const totalRequired = assessment.participants.length * assessment.vectors.length;
    let completed = 0;

    assessment.participants.forEach(participantId => {
      const participantResponses = assessment.responses[participantId];
      if (participantResponses) {
        assessment.vectors.forEach(vector => {
          if (participantResponses[vector.id]) {
            completed++;
          }
        });
      }
    });

    return Math.round((completed / totalRequired) * 100);
  }
}

export default Assessment;
