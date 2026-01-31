/**
 * Grammar Detector
 * Detects poor grammar, spelling, and formatting issues
 */

const GRAMMAR_PATTERNS = {
  excessiveCaps: {
    pattern: /[A-Z]{5,}/g,
    weight: 3,
    message: 'Excessive use of capital letters'
  },
  multipleExclamation: {
    pattern: /[!]{2,}/g,
    weight: 3,
    message: 'Multiple exclamation marks'
  },
  unusualSpacing: {
    pattern: /\s{2,}/g,
    weight: 2,
    message: 'Unusual spacing in text'
  }
};

const SUSPICIOUS_PHRASES = [
  /dear\s+candidate/i,
  /kindly\s+\w+/i,
  /beloved\s+\w+/i,
  /lottery/i,
  /winner/i,
  /beneficiary/i,
  /礼金/i,
  /保证金/i
];

export const detectGrammarRedFlags = (text) => {
  const flags = [];
  let totalScore = 0;

  for (const [category, config] of Object.entries(GRAMMAR_PATTERNS)) {
    const matches = text.match(config.pattern);
    if (matches && matches.length > 0) {
      flags.push({
        type: 'grammar',
        category: category,
        message: config.message,
        weight: config.weight,
        count: matches.length
      });
      totalScore += config.weight * Math.min(matches.length, 3);
    }
  }

  for (const pattern of SUSPICIOUS_PHRASES) {
    if (pattern.test(text)) {
      flags.push({
        type: 'grammar',
        category: 'suspiciousPhrase',
        message: 'Unusual phrasing detected',
        weight: 5
      });
      totalScore += 5;
    }
  }

  return {
    score: Math.min(totalScore, 15),
    flags,
    hasRedFlags: flags.length > 0
  };
};

export default detectGrammarRedFlags;

