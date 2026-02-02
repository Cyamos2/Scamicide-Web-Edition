# Point System Explanation & Legitimate Source Exemptions

## Features Implemented

### ✅ 1. Point System Explanation Panel
- Added "How Scoring Works" collapsible section in frontend
- Shows breakdown of max points per detector:
  - Payment Red Flags: 30 points
  - Identity Requests: 30 points
  - Urgency Tactics: 25 points
  - Communication Red Flags: 25 points
  - Company Details: 20 points
  - Grammar & Formatting: 15 points
- Total possible: 145 points (capped at 100)
- Visual progress bars for each detector category
- Risk level indicators (high/medium/low) per category

### ✅ 2. Legitimate Source Exemptions
- Recognized legitimate job platforms:
  - WorkDay (myworkday.com)
  - LinkedIn (linkedin.com, linkedin.com/jobs)
  - Indeed (indeed.com)
  - Glassdoor (glassdoor.com)
  - ZipRecruiter (ziprecruiter.com)
  - Monster (monster.com)
  - CareerBuilder (careerbuilder.com)
  - SimplyHired, Dice, Jobvite, Lever, Greenhouse, Workable, iCims, Smartsheet, Ashby

- For legitimate sources:
  - Email flags reduced by 50%
  - Interview flags reduced by 25%
  - Grammar penalties reduced by 50%
  - Max 15 point reduction applied to total score
  - Shows "Recognized Source" indicator in results

### ✅ 3. Scoring Engine Updates
- Added `LEGITIMATE_DOMAINS` constant with 19 legitimate platforms
- Added `isLegitimateSource()` helper function
- Modified `analyzeText()` to detect legitimate sources
- Pass `isLegitimateSource` flag to communication and grammar detectors
- Added `sourceInfo` to analysis result for frontend display

## Files Modified
1. ✅ `backend/src/services/scoringEngine.js` - Added domain exemptions
2. ✅ `backend/src/detectors/communicationDetector.js` - Added legitimate source handling
3. ✅ `backend/src/detectors/grammarDetector.js` - Added legitimate source handling
4. ✅ `frontend/src/components/ScoreBreakdown.jsx` - New component for point explanation
5. ✅ `frontend/src/App.jsx` - Integrated ScoreBreakdown and source info display

## Testing
The system now:
- Explains how each category contributes to the score
- Recognizes legitimate job platforms and reduces false positive flags
- Shows which platforms are recognized in the results
- Provides detailed breakdown of scores per detector
- Clearly shows risk levels for each category

