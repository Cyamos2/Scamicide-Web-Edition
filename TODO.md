# Scamicide - Build Plan

## Project Overview
A web application that analyzes job postings for scam risk with a React frontend and Node.js/Express backend.

## Technology Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: SQLite (for history)
- **Build Tool**: Vite

## Folder Structure
```
Scamicide/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisForm.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── HistoryPanel.jsx
│   │   │   ├── ScoreDisplay.jsx
│   │   │   ├── RedFlagList.jsx
│   │   │   └── Navbar.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useAnalysis.js
│   │   ├── utils/
│   │   │   └── scoringEngine.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/                     # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   └── analyze.js
│   │   ├── services/
│   │   │   └── scoringEngine.js
│   │   ├── detectors/
│   │   │   ├── paymentDetector.js
│   │   │   ├── identityDetector.js
│   │   │   ├── urgencyDetector.js
│   │   │   ├── communicationDetector.js
│   │   │   ├── companyDetector.js
│   │   │   └── grammarDetector.js
│   │   ├── models/
│   │   │   └── Analysis.js
│   │   ├── database/
│   │   │   └── db.js
│   │   └── server.js
│   └── package.json
├── README.md
└── DEPLOYMENT.md
```

## Implementation Steps

### Step 1: Backend Setup
1. Create backend package.json with dependencies
2. Set up Express server
3. Create SQLite database connection
4. Implement Analysis model

### Step 2: Scoring Engine (Backend)
1. Create base detector interface
2. Implement payment detector
3. Implement identity detector
4. Implement urgency detector
5. Implement communication detector
6. Implement company detector
7. Implement grammar detector
8. Create main scoring engine aggregator

### Step 3: API Routes
1. Create POST /analyze endpoint
2. Create GET /history endpoint
3. Create DELETE /history/:id endpoint

### Step 4: Frontend Setup
1. Create React + Vite project
2. Configure TailwindCSS
3. Set up project structure

### Step 5: Frontend Components
1. Create Navbar component
2. Create AnalysisForm component
3. Create ScoreDisplay component
4. Create RedFlagList component
5. Create ResultsPanel component
6. Create HistoryPanel component

### Step 6: Frontend Logic
1. Create API service
2. Create analysis hook
3. Implement localStorage for history
4. Add error handling

### Step 7: Testing
1. Create unit tests for detectors
2. Create integration tests for API
3. Create frontend component tests

### Step 8: Documentation
1. Write README.md
2. Write DEPLOYMENT.md
3. Add code comments

## Scoring Logic Details

### Risk Categories
- **Critical**: 80-100
- **High**: 60-79
- **Medium**: 40-59
- **Low**: 0-39

### Score Calculation
Each detector returns a risk score (0-25) based on:
- Keyword matches (weight: 1-3)
- Pattern matches (weight: 2-5)
- Context analysis (weight: 1-4)

Total score = Sum of all detector scores, capped at 100

## Red Flag Categories
1. **Payment Red Flags**: Zelle, CashApp, wire transfer, verification fee, deposit
2. **Identity Requests**: send ID, passport, driver's license, SSN
3. **Urgency**: immediate hire, urgent, start today, ASAP
4. **Unrealistic Pay**: High pay for low-skill remote work
5. **Communication**: Telegram, WhatsApp, text only, off-platform
6. **Company Mismatch**: Domain doesn't match company name
7. **Grammar/Formatting**: Poor grammar, excessive caps, weird formatting

## Estimated Time
- Backend: 2-3 hours
- Frontend: 2-3 hours
- Testing: 1 hour
- Documentation: 30 minutes

Total: 6-7 hours

