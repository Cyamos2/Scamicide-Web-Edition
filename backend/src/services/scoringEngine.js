/**
 * Scoring Engine Service
 * Main scoring engine that aggregates all detectors and calculates risk scores
 */

import detectPaymentRedFlags from '../detectors/paymentDetector.js';
import detectIdentityRedFlags from '../detectors/identityDetector.js';
import detectUrgencyRedFlags from '../detectors/urgencyDetector.js';
import detectCommunicationRedFlags from '../detectors/communicationDetector.js';
import detectCompanyRedFlags from '../detectors/companyDetector.js';
import detectGrammarRedFlags from '../detectors/grammarDetector.js';

// Legitimate job platforms that may trigger false positives
// When content comes from these sources, certain flags are reduced or exempted
const LEGITIMATE_DOMAINS = [
  'myworkday.com',
  'linkedin.com',
  'linkedin.com/jobs',
  'indeed.com',
  'glassdoor.com',
  'ziprecruiter.com',
  'monster.com',
  'careerbuilder.com',
  'simplyhired.com',
  'dice.com',
  'techcareers.com',
  'recruitingcareers.com',
  'jobvite.com',
  'lever.co',
  'greenhouse.io',
  'workable.com',
  'icims.com',
  'smartsheet.com',
  'ashbyhq.com'
];

// Check if URL is from a legitimate source
export const isLegitimateSource = (url) => {
  if (!url) return false;
  const urlLower = url.toLowerCase();
  return LEGITIMATE_DOMAINS.some(domain => urlLower.includes(domain));
};

const RISK_CATEGORIES = {
  CRITICAL: { min: 80, max: 100, label: 'Critical', color: '#dc2626', icon: '🚨' },
  HIGH: { min: 60, max: 79, label: 'High', color: '#ea580c', icon: '⚠️' },
  MEDIUM: { min: 40, max: 59, label: 'Medium', color: '#ca8a04', icon: '⚡' },
  LOW: { min: 0, max: 39, label: 'Low', color: '#16a34a', icon: '✅' }
};

export const getRiskCategory = (score) => {
  for (const [key, category] of Object.entries(RISK_CATEGORIES)) {
    if (score >= category.min && score <= category.max) {
      return { key, ...category };
    }
  }
  return { key: 'UNKNOWN', ...RISK_CATEGORIES.LOW };
};

export const generateExplanation = (analysis) => {
  const { score } = analysis;
  let explanation = '';

  if (score >= 80) {
    explanation = 'This job posting shows multiple critical red flags strongly indicating a scam.';
  } else if (score >= 60) {
    explanation = 'This job posting has several concerning elements. Exercise extreme caution.';
  } else if (score >= 40) {
    explanation = 'This job posting has some minor red flags. Verify the company independently.';
  } else {
    explanation = 'This job posting appears relatively clean but always exercise caution.';
  }

  return explanation;
};

export const analyzeText = (text, url = null) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      success: false,
      error: 'Invalid input: text is required',
      score: 0,
      category: getRiskCategory(0),
      redFlags: [],
      detectorResults: {}
    };
  }

  // Check if source is legitimate (reduces false positives)
  const legitimateSource = isLegitimateSource(url);

  const detectorResults = {
    payment: detectPaymentRedFlags(text),
    identity: detectIdentityRedFlags(text),
    urgency: detectUrgencyRedFlags(text),
    communication: detectCommunicationRedFlags(text, legitimateSource),
    company: detectCompanyRedFlags(text),
    grammar: detectGrammarRedFlags(text, legitimateSource)
  };

  let totalScore = 0;
  const allFlags = [];

  for (const [name, result] of Object.entries(detectorResults)) {
    totalScore += result.score;
    allFlags.push(...result.flags.map(flag => ({
      ...flag,
      detector: name
    })));
  }

  // Apply reduction for legitimate sources (max 15 point reduction)
  let finalScore = legitimateSource ? Math.max(totalScore - 15, 0) : totalScore;
  finalScore = Math.min(finalScore, 100);
  
  const category = getRiskCategory(finalScore);
  const sortedFlags = allFlags.sort((a, b) => b.weight - a.weight);
  const explanation = generateExplanation({ score: finalScore });

  return {
    success: true,
    score: finalScore,
    category: category.label,
    categoryKey: category.key,
    categoryColor: category.color,
    categoryIcon: category.icon,
    redFlags: sortedFlags,
    detectorResults: Object.fromEntries(
      Object.entries(detectorResults).map(([key, val]) => [key, { score: val.score, hasRedFlags: val.hasRedFlags }])
    ),
    explanation,
    textLength: text.length,
    analyzedAt: new Date().toISOString(),
    sourceInfo: {
      url: url,
      isLegitimate: legitimateSource,
      reducedScore: legitimateSource && totalScore > 15
    }
  };
};

export const analyzeUrl = async (url) => {
  return {
    success: false,
    error: 'URL analysis not yet implemented',
    score: 0,
    redFlags: [],
    message: 'URL analysis feature coming soon'
  };
};

export const getAvailableDetectors = () => {
  return [
    { id: 'payment', name: 'Payment Red Flags', description: 'Detects suspicious payment methods', maxScore: 30 },
    { id: 'identity', name: 'Identity Requests', description: 'Detects ID document requests', maxScore: 30 },
    { id: 'urgency', name: 'Urgency Tactics', description: 'Detects pressure tactics', maxScore: 25 },
    { id: 'communication', name: 'Communication Red Flags', description: 'Detects off-platform requests', maxScore: 25 },
    { id: 'company', name: 'Company Details', description: 'Detects vague company info', maxScore: 20 },
    { id: 'grammar', name: 'Grammar & Formatting', description: 'Detects grammar issues', maxScore: 15 }
  ];
};

export default {
  analyzeText,
  analyzeUrl,
  getRiskCategory,
  generateExplanation,
  getAvailableDetectors,
  RISK_CATEGORIES
};

