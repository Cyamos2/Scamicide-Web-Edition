/**
 * Communication Detector
 * Detects suspicious communication patterns and off-platform requests
 */

const COMMUNICATION_KEYWORDS = {
  offPlatformApps: {
    patterns: [
      /telegram/i,
      /whatsapp/i,
      /signal/i,
      /text\s*(?:me|only)/i,
      /contact\s*(?:me|via)\s*(?:on\s*)?(?:telegram|whatsapp|signal)/i,
      /move\s*(?:to|to\s*)?(?:our|the)\s*(?:telegram|whatsapp|signal)/i
    ],
    weight: 15,
    message: 'Request to communicate off-platform'
  },
  emailRedFlags: {
    patterns: [
      /gmail\.com\s*$/i,
      /yahoo\.com\s*$/i,
      /hotmail\.com\s*$/i,
      /outlook\.com\s*$/i,
      /personal\s*email/i
    ],
    weight: 8,
    message: 'Personal email address used for business'
  },
  interviewRedFlags: {
    patterns: [
      /interview\s*(?:via|on|over)\s*(?:telegram|whatsapp|signal|text)/i,
      /text\s*(?:interview|call)/i,
      /no\s*(?:video\s*)?(?:call|camera)/i
    ],
    weight: 18,
    message: 'Suspicious interview method requested'
  }
};

export const detectCommunicationRedFlags = (text) => {
  const flags = [];
  let totalScore = 0;
  const normalizedText = text.toLowerCase();

  for (const [category, config] of Object.entries(COMMUNICATION_KEYWORDS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        flags.push({
          type: 'communication',
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

export default detectCommunicationRedFlags;

