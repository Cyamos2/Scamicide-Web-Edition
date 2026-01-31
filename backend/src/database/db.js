/**
 * Database Module
 * SQLite database connection and operations for Scamicide
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const DB_PATH = process.env.DB_PATH || join(__dirname, '../../data/scamicide.db');

// Create database instance
let db;

/**
 * Initialize database connection and tables
 */
export const initializeDatabase = () => {
  // Ensure data directory exists
  const dataDir = dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  createTables();

  console.log(`✅ Database connected: ${DB_PATH}`);
  return db;
};

/**
 * Create required database tables
 */
const createTables = () => {
  // Analysis history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analysis_history (
      id TEXT PRIMARY KEY,
      input_text TEXT NOT NULL,
      input_url TEXT,
      risk_score INTEGER NOT NULL,
      risk_category TEXT NOT NULL,
      red_flags TEXT NOT NULL,
      explanation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create index on created_at for faster sorting
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at 
    ON analysis_history(created_at DESC)
  `);

  console.log('✅ Database tables created');
};

/**
 * Save analysis result to database
 */
export const saveAnalysis = (analysisData) => {
  const id = uuidv4();
  
  const stmt = db.prepare(`
    INSERT INTO analysis_history 
    (id, input_text, input_url, risk_score, risk_category, red_flags, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    analysisData.inputText || analysisData.input_text || '',
    analysisData.inputUrl || analysisData.input_url || null,
    analysisData.score || analysisData.risk_score || 0,
    analysisData.category || analysisData.risk_category || 'Unknown',
    JSON.stringify(analysisData.redFlags || analysisData.red_flags || []),
    analysisData.explanation || null
  );

  return { 
    id, 
    input_text: analysisData.inputText || analysisData.input_text || '',
    input_url: analysisData.inputUrl || analysisData.input_url || null,
    risk_score: analysisData.score || analysisData.risk_score || 0,
    risk_category: analysisData.category || analysisData.risk_category || 'Unknown',
    red_flags: analysisData.redFlags || analysisData.red_flags || [],
    explanation: analysisData.explanation || null
  };
};

/**
 * Get all analysis history
 */
export const getAnalysisHistory = (limit = 50, offset = 0) => {
  const stmt = db.prepare(`
    SELECT id, input_text, input_url, risk_score, risk_category, red_flags, explanation, created_at
    FROM analysis_history
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);

  const results = stmt.all(limit, offset);

  return results.map(row => ({
    id: row.id,
    input_text: row.input_text,
    input_url: row.input_url,
    risk_score: row.risk_score,
    risk_category: row.risk_category,
    red_flags: typeof row.red_flags === 'string' ? JSON.parse(row.red_flags) : row.red_flags,
    explanation: row.explanation,
    created_at: row.created_at
  }));
};

/**
 * Get single analysis by ID
 */
export const getAnalysisById = (id) => {
  const stmt = db.prepare(`
    SELECT id, input_text, input_url, risk_score, risk_category, red_flags, explanation, created_at
    FROM analysis_history
    WHERE id = ?
  `);

  const row = stmt.get(id);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    input_text: row.input_text,
    input_url: row.input_url,
    risk_score: row.risk_score,
    risk_category: row.risk_category,
    red_flags: typeof row.red_flags === 'string' ? JSON.parse(row.red_flags) : row.red_flags,
    explanation: row.explanation,
    created_at: row.created_at
  };
};

/**
 * Delete analysis by ID
 */
export const deleteAnalysis = (id) => {
  const stmt = db.prepare(`
    DELETE FROM analysis_history
    WHERE id = ?
  `);

  const result = stmt.run(id);
  return result.changes > 0;
};

/**
 * Get analysis statistics
 */
export const getAnalysisStats = () => {
  const totalStmt = db.prepare(`
    SELECT COUNT(*) as total FROM analysis_history
  `);

  const categoryStmt = db.prepare(`
    SELECT risk_category, COUNT(*) as count
    FROM analysis_history
    GROUP BY risk_category
  `);

  const avgScoreStmt = db.prepare(`
    SELECT AVG(risk_score) as average_score
    FROM analysis_history
  `);

  const total = totalStmt.get();
  const categories = categoryStmt.all();
  const avgScore = avgScoreStmt.get();

  return {
    total: total.total,
    categories: categories.reduce((acc, cat) => {
      acc[cat.risk_category] = cat.count;
      return acc;
    }, {}),
    averageScore: avgScore.average_score || 0
  };
};

/**
 * Clear all analysis history
 */
export const clearAllHistory = () => {
  const stmt = db.prepare(`
    DELETE FROM analysis_history
  `);

  const result = stmt.run();
  return result.changes;
};

/**
 * Get database instance
 */
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

/**
 * Close database connection
 */
export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
    console.log('✅ Database connection closed');
  }
};

export default {
  initializeDatabase,
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getAnalysisStats,
  clearAllHistory,
  getDatabase,
  closeDatabase
};

