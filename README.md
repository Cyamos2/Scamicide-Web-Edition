# Scamicide - Job Scam Detection System

**Protect yourself from job scams with AI-powered analysis**

## Overview

Scamicide analyzes job postings for scam risk using multiple detection modules.

## Features
- Risk Analysis (0-100 score)
- Red Flag Detection
- Category Classification (Critical/High/Medium/Low)
- History Tracking
- Modern Responsive UI

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install backend
cd backend && npm install

# Install frontend  
cd ../frontend && npm install
```

### Running Locally

**Backend (Terminal 1):**
```bash
cd backend && npm run dev
# Runs at http://localhost:3001
```

**Frontend (Terminal 2):**
```bash
cd frontend && npm run dev
# Runs at http://localhost:5173
```

## Project Structure

```
Scamicide/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── detectors/         # Detection modules
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── database/          # SQLite database
│   │   ├── middleware/        # Express middleware
│   │   └── server.js          # Entry point
│   └── package.json
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/analyze | Analyze job posting |
| GET | /api/analyze/history | Get analysis history |
| DELETE | /api/history/:id | Delete history item |

## Scoring Categories

| Category | Score | Color |
|----------|-------|-------|
| Critical | 80-100 | Red |
| High | 60-79 | Orange |
| Medium | 40-59 | Yellow |
| Low | 0-39 | Green |

## Detection Modules

1. **Payment** - Zelle, CashApp, wire transfer
2. **Identity** - ID, passport, driver's license requests
3. **Urgency** - Immediate hire, urgent, start today
4. **Communication** - Telegram, WhatsApp, off-platform
5. **Company** - Vague info, domain mismatch
6. **Grammar** - Poor grammar, excessive caps

## Environment Variables

Create `backend/.env`:
```env
PORT=3001
DB_PATH=./data/scamicide.db
FRONTEND_URL=http://localhost:5173
```

## License

MIT

