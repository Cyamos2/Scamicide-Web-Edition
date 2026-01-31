/**
 * Identity Request Detector
 * Detects suspicious requests for personal identification documents
 */

/**
 * Identity-related keywords and patterns indicating potential scams
 */
const IDENTITY_KEYWORDS = {
  // Document requests
  documentRequests: {
    patterns: [
      /send\s*(?:me\s*)?(?:your\s*)?(?:photo)?id/i,
      /send\s*(?:me\s*)?(?:your\s*)?passport/i,
      /send\s*(?:me\s*)?(?:your\s*)?driver'?s?\s*license/i,
      /send\s*(?:me\s*)?(?:your\s*)?national\s*id/i,
      /send\s*(?:me\s*)?(?:your\s*)?identity\s*(?:card|document)/i,
      /upload\s*(?:your\s*)?id/i,
      /verify\s*(?:your\s*)?identity/i,
      /identity\s*verification/i
    ],
    weight: 20,
    message: 'Request for personal identification documents'
  },

  // SSN and financial ID
  sensitiveInfo: {
    patterns: [
      /social\s*security(?:\s*number)?/i,
      /ssn\s*#?/i,
      /tax\s*id/i,
      /credit\s*card(?:\s*number)?/i,
      /date\s*of\s*birth/i,
      /dob/i
    ],
    weight: 25,
    message: 'Request for sensitive personal information'
  },

  // Photo requests
  photoRequests: {
    patterns: [
      /send\s*(?:me\s*)?(?:your\s*)?photo/i,
      /send\s*(?:me\s*)?(?:your\s*)?picture/i,
      /selfie/i,
      /photo\s*of\s*(?:your\s*)?face/i
    ],
    weight: 12,
    message: 'Request for personal photos'
  }
};

/**
 * Analyze text for identity-related red flags
 * @param {string} text - The text to analyze
 * @returns {Object} Detection result with score and flags
 */
export const detectIdentityRedFlags = (text) => {
  const flags = [];
  let totalScore = 0;
  const normalizedText = text.toLowerCase();

  for (const [category, config] of Object.entries(IDENTITY_KEYWORDS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        flags.push({
          type: 'identity',
          category: category,
          message: config.message,
          weight: config.weight,
          matchedText: text.match(pattern)?.[0] || ''
        });
        totalScore += config.weight;
        break;
      }
    }
  }

  return {
    score: Math.min(totalScore, 30),
    flags,
    hasRedFlags: flags.length > 0
  };
};

export default detectIdentityRedFlags;

