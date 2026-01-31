/**
 * Urgency Detector
 * Detects excessive urgency and pressure tactics in job postings
 */

const URGENCY_KEYWORDS = {
  immediateHiring: {
    patterns: [
      /immediate(?:ly)?\s*hire/i,
      /hire\s*immediate(?:ly)?/i,
      /start\s*immediate(?:ly)?/i,
      /start\s*today/i,
      /start\s*tomorrow/i,
      /urgently\s*hire/i,
      /urgent(?:ly)?\s*need/i,
      /hiring\s*(?:now|immediate(?:ly)?)/i
    ],
    weight: 12,
    message: 'Excessive urgency to hire immediately'
  },
  timePressure: {
    patterns: [
      /asap/i,
      /right\s*away/i,
      /right\s*now/i,
      /within\s*(?:the\s*)?(?:next\s*)?(?:\d+\s*)?(?:hours?|day[s]?)/i,
      /don'?t\s*(?:miss\s*out|wait)/i,
      /limited\s*(?:time|offer|position)/i,
      /apply\s*(?:now|immediate(?:ly)?)/i,
      /only\s*\d+\s*(?:position|slot)s?\s*left/i,
      /must\s*(?:respond|apply|start)/i
    ],
    weight: 10,
    message: 'High-pressure time constraints'
  },
  quickMoney: {
    patterns: [
      /quick\s*(?:cash|money|pay)/i,
      /fast\s*(?:cash|money|pay)/i,
      /easy\s*(?:money|pay)/i,
      /make\s*(?:\$\d+|\d+K)\s*(?:a|per)\s*(?:day|week|month|hour)/i
    ],
    weight: 15,
    message: 'Promises of quick or easy money'
  },
  noExperience: {
    patterns: [
      /no\s*(?:experience|skills?|qualifications?|training)/i,
      /beginner[s]?\s*(?:friendly|welcome)/i,
      /earn\s*(?:\$\d+|\d+K)\s*(?:with)?\s*no\s*(?:experience|skills?)/i
    ],
    weight: 10,
    message: 'Promises high pay with no experience required'
  }
};

export const detectUrgencyRedFlags = (text) => {
  const flags = [];
  let totalScore = 0;
  const normalizedText = text.toLowerCase();

  for (const [category, config] of Object.entries(URGENCY_KEYWORDS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        flags.push({
          type: 'urgency',
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
    score: Math.min(totalScore, 25),
    flags,
    hasRedFlags: flags.length > 0
  };
};

export default detectUrgencyRedFlags;

