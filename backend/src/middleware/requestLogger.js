/**
 * Request Logger Middleware
 * Logs incoming API requests for debugging and monitoring
 */

/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, body } = req;

  // Log request details
  console.log(`📝 ${method} ${originalUrl} - Incoming request`);

  // Log body for POST/PUT requests (sanitized)
  if (method === 'POST' || method === 'PUT') {
    const sanitizedBody = sanitizeForLogging(body);
    console.log('📋 Request body:', JSON.stringify(sanitizedBody, null, 2));
  }

  // Capture original json method
  const originalJson = res.json.bind(res);

  // Override json method to log response
  res.json = (data) => {
    const responseTime = Date.now() - start;
    
    // Log response
    console.log(`✅ ${method} ${originalUrl} - ${res.statusCode} - ${responseTime}ms`);

    // Log response data for errors
    if (res.statusCode >= 400) {
      console.error('❌ Error response:', JSON.stringify(data, null, 2));
    }

    // Call original json method
    return originalJson(data);
  };

  next();
};

/**
 * Sanitize sensitive data from logs
 */
const sanitizeForLogging = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveFields = [
    'password', 'token', 'secret', 'apiKey', 'apikey',
    'creditCard', 'cardNumber', 'ssn', 'socialSecurity'
  ];

  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
};

export default requestLogger;
