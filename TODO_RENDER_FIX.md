# Render Deployment Fix - TODO List

## Goal: Fix server for Render deployment (resolve 127 error and other issues)

### Issues Identified:
- 127 error: Command not found - likely npm start script or dependency issue
- better-sqlite3 native module compilation issues
- Database path initialization on Render's filesystem
- Frontend serving configuration

### Plan:

#### Step 1: Update backend/package.json
- [x] 1.1 Add "engines" field for Node version
- [x] 1.2 Add preinstall script for better-sqlite3
- [x] 1.3 Add build script for frontend

#### Step 2: Fix backend/src/database/db.js
- [x] 2.1 Add debug logging for DB_PATH
- [x] 2.2 Make DB initialization more robust
- [x] 2.3 Handle Render's /data directory properly

#### Step 3: Update backend/src/server.js
- [x] 3.1 Fix frontend path resolution for production
- [x] 3.2 Add graceful shutdown handling
- [x] 3.3 Improve health check endpoint

#### Step 4: Create render.yaml
- [x] 4.1 Create Blueprint file for Render deployment

#### Step 5: Create .env.example
- [x] 5.1 Document required environment variables

#### Step 6: Test and Verify
- [x] 6.1 Test server startup locally
- [x] 6.2 Push to GitHub for deployment

