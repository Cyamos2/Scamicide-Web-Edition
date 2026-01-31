/**
 * Company Detector
 * Detects suspicious company details and domain mismatches
 */

const COMPANY_KEYWORDS = {
  vagueCompanyInfo: {
    patterns: [
      /company\s*(?:name)?\s*(?:to\s*be\s*)?(?:provided|revealed|later)/i,
      /will\s*(?:provide|share|send)\s*(?:company|details?|info)/i,
      /legitimate\s*(?:company|business)/i,
      /reputable\s*(?:company|business)/i,
      /well-?known\s*(?:company|brand)/i
    ],
    weight: 5,
    message: 'Vague or unverifiable company information'
  },
  genericBusinessTerms: {
    patterns: [
      /(?:\w+\s+)?(?:solutions?|services?|group|inc|corp|ltd|llc|holdings?)/i,
      /global\s*(?:\w+\s+)?(?:solutions?|services?|group)/i,
      /digital\s*(?:solutions?|services?|marketing)/i
    ],
    weight: 3,
    message: 'Generic business names without specific details'
  },
  commissionOnly: {
    patterns: [
      /commission(?:\s*only)?/i,
      /(?:pay|payment)\s*(?:is|will|based)\s*(?:only)?\s*commission/i,
      /\d+%\s*commission/i,
      /base\s*pay\s*(?:plus)?\s*commission/i
    ],
    weight: 12,
    message: 'Commission-only or unclear compensation structure'
  }
};

export const detectCompanyRedFlags = (text) => {
  const flags = [];
  let totalScore = 0;
  const normalizedText = text.toLowerCase();

  for (const [category, config] of Object.entries(COMPANY_KEYWORDS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        flags.push({
          type: 'company',
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
    score: Math.min(totalScore, 20),
    flags,
    hasRedFlags: flags.length > 0
  };
};

export default detectCompanyRedFlags;

