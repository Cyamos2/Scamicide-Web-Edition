/**
 * Scamicide Backend Server
 * Main entry point for the Express application
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import analyzeRoutes from './routes/analyze.js';
import { initializeDatabase, closeDatabase } from './database/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3001', 10);

console.log('🚀 Starting Scamicide API Server...');
console.log(`📍 Environment: ${isProduction ? 'production' : 'development'}`);
console.log(`📍 Port: ${PORT}`);

const app = express();

// Trust proxy for behind reverse proxy (Render uses this)
app.set('trust proxy', 1);

// Initialize database
const db = initializeDatabase();
console.log(`📦 Database initialized: ${db ? 'yes' : 'no (will run without persistence)'}`);

// Middleware configuration
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = db ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: isProduction ? 'production' : 'development',
    database: dbStatus,
    port: PORT
  });
});

// Liveness probe for Render
app.get('/live', (req, res) => {
  res.status(200).send('OK');
});

// Readiness probe for Render
app.get('/ready', (req, res) => {
  if (db) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false, reason: 'Database not available' });
  }
});

// API Routes
app.use('/api/analyze', analyzeRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Scamicide API',
    version: '1.0.0',
    description: 'Job Scam Detection API',
    endpoints: {
      'POST /api/analyze': 'Analyze job posting for scam risk',
      'GET /api/history': 'Get analysis history',
      'DELETE /api/history/:id': 'Delete analysis from history',
      'GET /health': 'Health check endpoint',
      'GET /live': 'Liveness probe',
      'GET /ready': 'Readiness probe'
    }
  });
});

// Serve static files in production
// Check multiple possible locations for frontend build
const possibleFrontendPaths = [
  join(__dirname, '../../frontend/dist'),
  join(__dirname, '../../dist'),
  join(__dirname, '../frontend/dist'),
  join(__dirname, '../../../frontend/dist')
];

let frontendPath = null;
for (const path of possibleFrontendPaths) {
  if (fs.existsSync(path)) {
    frontendPath = path;
    console.log(`✅ Found frontend at: ${frontendPath}`);
    break;
  }
}

if (isProduction && frontendPath) {
  console.log('📦 Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath));
  
  // Serve index.html for all non-API routes (SPA support)
  app.get('*', (req, res) => {
    const indexPath = join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Frontend not found' });
    }
  });
} else if (isProduction) {
  console.warn('⚠️ Frontend build not found. Frontend will not be served.');
  console.log('💡 To build frontend: cd frontend && npm install && npm run build');
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    statusCode: 404
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
let server = null;

const startServer = () => {
  return new Promise((resolve) => {
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log('✅ Server started successfully!');
      console.log(`🚀 Scamicide API Server running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Analysis endpoint: http://localhost:${PORT}/api/analyze`);
      console.log(`📝 Environment: ${isProduction ? 'production' : 'development'}`);
      resolve();
    });
  });
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
    });
  }
  
  // Close database connection
  closeDatabase();
  
  // Exit after a timeout
  setTimeout(() => {
    console.log('🛑 Forcing exit...');
    process.exit(0);
  }, 5000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Start the server (only when not testing)
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
} else {
  console.log('ℹ️ Skipping HTTP server start in test environment');
}

export default app;

