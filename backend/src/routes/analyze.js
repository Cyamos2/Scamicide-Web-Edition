/**
 * Analyze API Routes
 * Handles job posting analysis endpoints
 */

import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { analyzeText, analyzeUrl, getAvailableDetectors } from '../services/scoringEngine.js';
import { saveAnalysis, getAnalysisHistory, deleteAnalysis, getAnalysisStats } from '../database/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

const validateAnalyzeRequest = [
  body('text')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 50000 })
    .withMessage('Text must be between 10 and 50,000 characters'),
  body('url')
    .optional()
    .isURL()
    .withMessage('Invalid URL format')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: errors.array()
      }
    });
  }
  next();
};

router.post('/',
  validateAnalyzeRequest,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { text, url } = req.body;

    if (!text && !url) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Either text or url must be provided',
          code: 'MISSING_INPUT',
          status: 400
        }
      });
    }

    let analysisResult;

    if (text) {
      analysisResult = analyzeText(text, url);
    } else {
      analysisResult = await analyzeUrl(url);
    }

    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: analysisResult.error,
          code: 'ANALYSIS_FAILED',
          status: 400
        }
      });
    }

    if (text && analysisResult.success) {
      try {
        const saved = saveAnalysis({
          inputText: text.substring(0, 1000),
          inputUrl: url || null,
          score: analysisResult.score,
          category: analysisResult.category,
          redFlags: analysisResult.redFlags,
          explanation: analysisResult.explanation
        });
        analysisResult.id = saved.id;
        analysisResult.savedToHistory = true;
      } catch (dbError) {
        console.error('Failed to save analysis:', dbError);
        analysisResult.savedToHistory = false;
      }
    }

    res.json({
      success: true,
      data: analysisResult
    });
  })
);

router.get('/detectors',
  asyncHandler(async (req, res) => {
    const detectors = getAvailableDetectors();
    res.json({
      success: true,
      data: {
        detectors,
        maxPossibleScore: detectors.reduce((sum, d) => sum + d.maxScore, 0)
      }
    });
  })
);

router.get('/sample',
  asyncHandler(async (req, res) => {
    const sampleText = `URGENT HIRING: We are looking for immediate hires for a work-from-home position.
Pay: $50/hour - start immediately!

Requirements:
- No experience needed
- Must have a phone to text me on WhatsApp
- Will need to send your ID
- Must be available to start today

Contact me at: hiring@company-gmail.com

This is a legitimate opportunity. Send me your details and I will send you a check.`;

    const analysis = analyzeText(sampleText);
    res.json({
      success: true,
      data: {
        sample: true,
        ...analysis
      }
    });
  })
);

router.get('/history',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt()
  ],
  asyncHandler(async (req, res) => {
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;
    const history = getAnalysisHistory(limit, offset);
    res.json({
      success: true,
      data: {
        history,
        count: history.length,
        limit,
        offset
      }
    });
  })
);

router.get('/history/stats',
  asyncHandler(async (req, res) => {
    const stats = getAnalysisStats();
    res.json({
      success: true,
      data: stats
    });
  })
);

router.get('/history/:id',
  asyncHandler(async (req, res) => {
    const { getAnalysisById } = await import('../database/db.js');
    const analysis = getAnalysisById(req.params.id);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: { message: 'Analysis not found', code: 'NOT_FOUND', status: 404 }
      });
    }
    res.json({ success: true, data: analysis });
  })
);

router.delete('/history/:id',
  asyncHandler(async (req, res) => {
    const { deleteAnalysis } = await import('../database/db.js');
    const deleted = deleteAnalysis(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: 'Analysis not found', code: 'NOT_FOUND', status: 404 }
      });
    }
    res.json({ success: true, message: 'Analysis deleted successfully' });
  })
);

export default router;

