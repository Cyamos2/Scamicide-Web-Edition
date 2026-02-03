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

## Deployment (Render) 🚀

Follow these steps to deploy Scamicide on Render:

1. **Add a persistent disk** ✅
   - In Render Dashboard → *Service Settings* → *Disks* → *Add Disk*
   - Size: **1 GB**, Mount path: **/data** (required for database persistence)

2. **Backend service configuration** 🔧
   - Service type: **Web** (Node)
   - Root directory: `backend`
   - Build command: `npm install && npm run build:frontend`
   - Start command: `npm start`
   - Set environment variables (do **not** hard-code `PORT`):
     - `NODE_ENV=production`
     - `DB_PATH=/data/scamicide.db`
   - Note: Render will provide a `PORT` env var at runtime — the server binds to it automatically.

3. **Frontend service configuration** 🧭
   - Service type: **Static** (preferred)
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish path: `dist`
   - Set `VITE_API_URL` to your backend URL after deploy (e.g. `https://<your-backend>.onrender.com/api`)

4. **Native module build** 🔨
   - `better-sqlite3` is a native module — the backend includes an `install` script that runs:
     ```bash
     npm rebuild better-sqlite3 --build-from-source || true
     ```
     This helps ensure the module compiles correctly on Render.

5. **Health & readiness checks** ✅
   - Use the built-in endpoints: `GET /health`, `GET /live`, `GET /ready`
   - Configure Render health checks to hit `/live` or `/ready` as desired.

6. **Local test checklist** 🧪
   - From repo root:
     ```bash
     cd backend && npm install
     npm run build:frontend   # builds frontend into ../frontend/dist
     npm start
     # Verify: http://localhost:3001/health
     ```

7. **Troubleshooting tips** ⚠️
   - If the DB file is missing, ensure the disk is mounted at `/data` and `DB_PATH` is set.
   - Check Render service logs for `better-sqlite3` build errors and rerun `npm rebuild better-sqlite3 --build-from-source` locally to reproduce.
   - If frontend isn't served by the backend, verify the `frontend/dist` folder exists after the build.
   - If you see an "Analysis failed" message in the UI:
     - If the message begins with `Network error`, the frontend cannot reach the backend. Confirm `VITE_API_URL` is set on the frontend static site to the backend API base (e.g., `https://<backend>.onrender.com/api`) and that CORS / allowed origins are set appropriately.
     - If the message is `Validation failed`, the backend requires `text` to be between **10 and 50,000** characters. Short inputs will trigger validation errors and the UI will show the specific validation message.

> Note: A `render.yaml` blueprint is included in the repo for convenience. Edit it in Render or import it directly.

## License

MIT

