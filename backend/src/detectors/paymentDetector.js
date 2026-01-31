/**
 * Payment Red Flag Detector
 * Detects suspicious payment-related keywords and patterns
 */

/**
 * Payment-related keywords and patterns indicating potential scams
 */
const PAYMENT_KEYWORDS = {
  // Payment methods commonly used in scams
  paymentMethods: {
    patterns: [
      /zelle/i,
      /cash\s*app/i,
      /venmo/i,
      /paypal\s*friends?\s*and\s*family/i,
      /wire\s*transfer/i,
      /western\s*union/i,
      /money\s*gram/i,
      /gift\s*cards?/i,
      /crypto(?:currency)?/i,
      /bitcoin/i,
      /ethereum/i,
      /usdt/i,
      /usdc/i
    ],
    weight: 15,
    message: 'Unusual payment method requested'
  },

  // Payment-related scam phrases
  paymentScamPhrases: {
    patterns: [
      /verification\s*(?:fee|deposit|payment)/i,
      /processing\s*(?:fee|deposit|payment)/i,
      /start(?:ing)?\s*(?:fee|deposit)/i,
      /security\s*(?:deposit|fund)/i,
      /training\s*(?:fee|payment)/i,
      /equipment\s*(?:fee|deposit)/i,
      /mandatory\s*(?:purchase|equipment)/i,
      /buy\s*(?:your\s*)?(?:own\s*)?(?:equipment|supplies)/i,
      /reimburse.*(?:later|after)/i,
      /pay.*(?:first|upfront|before)/i,
      /send.*(?:money|payment|cash)/i,
      /make\s*(?:a\s*)?payment/i
    ],
    weight: 20,
    message: 'Payment or fee required before starting work'
  },

  // Check processing scams
  checkScams: {
    patterns: [
      /check.*(?:in\s*advance|before|cash)/i,
      /send.*(?:check|money)/i,
      /bank\s*check/i,
      /cashier'?s?\s*check/i,
      /money\s*order/i,
      /advance.*(?:payment|fee)/i,
      /overpay/i,
      /refund.*(?:excess|balance)/i
    ],
    weight: 18,
    message: 'Suspicious check or money order request'
  },

  // Direct banking requests
  bankingRequests: {
    patterns: [
      /bank\s*account/i,
      /routing\s*number/i,
      /account\s*number/i,
      /direct\s*deposit/i,
      /bank\s*transfer/i,
      /receive.*(?:funds|money|payment)/i
    ],
    weight: 8,
    message: 'Banking information requested'
  }
};

/**
 * Analyze text for payment-related red flags
 * @param {string} text - The text to analyze
 * @returns {Object} Detection result with score and flags
 */
export const detectPaymentRedFlags = (text) => {
  const flags = [];
  let totalScore = 0;
  const normalizedText = text.toLowerCase();

  // Check each category
  for (const [category, config] of Object.entries(PAYMENT_KEYWORDS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        flags.push({
          type: 'payment',
          category: category,
          message: config.message,
          weight: config.weight,
          matchedText: text.match(pattern)?.[0] || ''
        });
        totalScore += config.weight;
        break; // Only count each category once
      }
    }
  }

  return {
    score: Math.min(totalScore, 30), // Cap at 30 for this detector
    flags,
    hasRedFlags: flags.length > 0
  };
};

export default detectPaymentRedFlags;

