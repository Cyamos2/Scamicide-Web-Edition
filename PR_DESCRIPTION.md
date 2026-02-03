Title: Prepare Scamicide for Render deployment

Summary
-------
This pull request prepares Scamicide for deployment on Render by:

- Ensuring `better-sqlite3` is rebuilt during install (native module compatibility)
- Adding Render blueprint (`render.yaml`) with backend build step that also builds the frontend
- Configuring the frontend as a static site with `publishPath: dist`
- Adding CI workflow (`.github/workflows/ci.yml`) that installs deps, rebuilds native modules, builds frontend, runs backend tests, and performs a smoke test against `/health`
- Adding `DEPLOYMENT.md` and expanding `README.md` with Render-specific deployment instructions
- Clarifying `DB_PATH` usage and adding a `install` script in `backend/package.json`

Why
---
These changes reduce common Render deployment failures (native module build errors, hard-coded PORT, missing frontend build, and lack of smoke tests) and provide explicit deployment guidance.

Testing performed
-----------------
- Local frontend build: `cd frontend && npm ci && npm run build` (succeeds)
- Local backend smoke test: started backend with `NODE_ENV=production PORT=3001 DB_PATH=./data/test.db` and verified `/health` responds and DB initializes

Instructions / Next steps
------------------------
1. Review and merge this PR.
2. In Render Dashboard, create a **Web** service for backend (root: `backend`), set build command `npm install && npm run build:frontend`, start command `npm start`, and set `DB_PATH=/data/scamicide.db`. Do NOT hard-code `PORT`.
3. Add a 1 GB persistent disk in Render and mount at `/data` (required for DB persistence).
4. Create a **Static** service for frontend (root: `frontend`), build command `npm install && npm run build`, publish path `dist`, and set `VITE_API_URL` to the deployed backend API URL.

Notes
-----
- If Render build logs show `better-sqlite3` failures, the logs will often indicate missing system packages; re-run `npm rebuild better-sqlite3 --build-from-source` in CI or local Linux to reproduce.
- CI includes a smoke test that starts the backend and calls `/health` to detect runtime issues early.

Signed-off-by: Scamicide automation
