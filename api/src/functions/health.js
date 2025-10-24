/**
 * Health Check Function for Azure Functions v4
 * Provides basic health status and database connectivity check
 */

import { app } from '@azure/functions';
import { success, error } from '../utils/response.js';
import { getCorsHeaders, handlePreflight } from '../utils/cors.js';

app.http('health', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async (request, context) => {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    try {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: '9Vectors API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks: {
          api: 'ok'
        }
      };

      // Check database connectivity
      try {
        const { getContainer } = await import('../config/database.js');
        // Try to get users container - if it exists, database is connected
        const usersContainer = getContainer(process.env.COSMOS_CONTAINER_USERS || 'users');

        if (usersContainer) {
          healthStatus.checks.database = 'ok';
        } else {
          healthStatus.checks.database = 'unavailable';
          healthStatus.status = 'degraded';
        }
      } catch (dbError) {
        healthStatus.checks.database = 'error';
        healthStatus.status = 'degraded';
        context.log('Database health check failed:', dbError.message);
      }

      return {
        ...success(healthStatus, 'Health check passed'),
        headers: getCorsHeaders(origin)
      };
    } catch (err) {
      context.log('Health check error:', err);
      return {
        ...error('Health check failed', 500),
        headers: getCorsHeaders(origin)
      };
    }
  }
});
