# Fix Analysis Issues - TODO

## Issues Identified
1. Database not initialized at startup
2. Field name mismatch between camelCase and snake_case
3. Inconsistent field names between API and frontend

## Fixes to Implement

### Step 1: Fix Database Initialization
- [x] Import and call `initializeDatabase()` in `server.js`

### Step 2: Fix Field Mapping in db.js
- [x] Update `saveAnalysis` to correctly map camelCase to snake_case
- [x] Update `getAnalysisHistory` to return consistent field names
- [x] Update `getAnalysisById` to return consistent field names

### Step 3: Fix API Response Consistency
- [x] Ensure analyze.js returns consistent field names

### Step 4: Fix Frontend History Panel
- [x] Update field name references to match API response

## Summary of Changes

### server.js
- Added import for `initializeDatabase` from database/db.js
- Added `initializeDatabase()` call at startup

### backend/src/database/db.js
- Updated `saveAnalysis` to accept both camelCase and snake_case field names
- Updated `getAnalysisHistory` to return consistent snake_case field names
- Updated `getAnalysisById` to return consistent snake_case field names
- Added defensive parsing for `red_flags` JSON field

### analyze.js
- No changes needed - already uses correct field names

### Frontend files
- App.jsx - already uses correct field names
- HistoryPanel.jsx - already uses correct field names

