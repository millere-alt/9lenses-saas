/**
 * Azure Functions HTTP Response Utilities
 * Standardized response formatters for Azure Functions v4
 */

function success(data, message = 'Success') {
  return {
    status: 200,
    jsonBody: {
      success: true,
      message,
      data
    }
  };
}

function created(data, message = 'Resource created successfully') {
  return {
    status: 201,
    jsonBody: {
      success: true,
      message,
      data
    }
  };
}

function error(message, statusCode = 400) {
  return {
    status: statusCode,
    jsonBody: {
      success: false,
      error: message
    }
  };
}

function badRequest(message = 'Bad request') {
  return error(message, 400);
}

function unauthorized(message = 'Unauthorized') {
  return error(message, 401);
}

function forbidden(message = 'Forbidden') {
  return error(message, 403);
}

function notFound(message = 'Resource not found') {
  return error(message, 404);
}

function serverError(message = 'Internal server error') {
  return error(message, 500);
}

function validationError(errors) {
  return {
    status: 422,
    jsonBody: {
      success: false,
      error: 'Validation failed',
      errors
    }
  };
}

module.exports = {
  success,
  created,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  validationError
};
