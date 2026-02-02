/**
 * Error Handler Middleware
 * Centralized error handling for the API
 */

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends APIError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

/**
 * Async handler wrapper to catch async errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Error response formatter
 */
const formatErrorResponse = (error, includeStack = false) => {
  const response = {
    success: false,
    error: {
      message: error.message,
      code: error.code || 'ERROR',
      status: error.statusCode || 500
    }
  };

  if (error.errors) {
    response.error.details = error.errors;
  }

  if (includeStack && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    code: err.code,
    status: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Handle JSON parsing errors
  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid JSON in request body',
        code: 'INVALID_JSON',
        status: 400
      }
    });
  }

  // Handle express-validator validation errors
  if (err.type === 'entity.parse.failed' || err.type === 'entity.validation.failed') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        status: 400
      }
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: 'VALIDATION_ERROR',
        status: 400,
        details: err.errors
      }
    });
  }

  if (err.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Resource not found',
        code: 'NOT_FOUND',
        status: 404
      }
    });
  }

  // Handle SQLite specific errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    console.error('Database Error:', err);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Database operation failed',
        code: 'DATABASE_ERROR',
        status: 500
      }
    });
  }

  // Handle better-sqlite3 specific errors
  if (err.message && err.message.includes('SQLITE')) {
    console.error('SQLite Error:', err);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Database operation failed',
        code: 'DATABASE_ERROR',
        status: 500
      }
    });
  }

  // Handle TypeError (common with undefined values)
  if (err instanceof TypeError) {
    console.error('Type Error:', err);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }

  // Handle unknown errors
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json(
    formatErrorResponse(err, isDevelopment)
  );
};

export default {
  APIError,
  NotFoundError,
  ValidationError,
  asyncHandler,
  errorHandler
};

