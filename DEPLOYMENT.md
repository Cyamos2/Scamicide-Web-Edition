# Scamicide Deployment Guide

## Production Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com) and sign up
   - Connect your GitHub account

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select your repository
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables:
     ```
     PORT=443
     DB_PATH=./data/scamicide.db
     FRONTEND_URL=https://your-frontend.vercel.app
     NODE_ENV=production
     ```

3. **Add Persistent Disk (for SQLite)**
   - In Render dashboard, go to your service
   - Add a Persistent Disk (1GB recommended)
   - Mount path: `/data`

4. **Note your backend URL**
   - Example: `https://scamicide-api.onrender.com`

#### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://scamicide-api.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"

### Option 2: Railway (Full Stack)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Deploy Backend**
   - New Project → Deploy from GitHub
   - Set root directory: `backend`
   - Environment variables as above

3. **Deploy Frontend**
   - New Project → Deploy from GitHub
   - Set root directory: `frontend`
   - Environment variable: `VITE_API_URL=https://your-backend.railway.app/api`

### Option 3: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/src ./src
RUN mkdir -p /data
EXPOSE 3001
CMD ["node", "src/server.js"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./frontend
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    volumes:
      - ./data:/data
    environment:
      - DB_PATH=/data/scamicide.db
      - FRONTEND_URL=http://localhost:5173

  frontend:
    build: ./frontend
    ports:
      - "80:80"
```

## Environment Variables Reference

### Backend
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3001 | Server port |
| DB_PATH | No | ./data/scamicide.db | SQLite database path |
| FRONTEND_URL | Yes | - | Frontend URL for CORS |
| NODE_ENV | No | development | Environment mode |

### Frontend
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | Yes | /api | Backend API URL |

## Custom Domain Setup

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Render (Backend)
1. Go to Service Settings → Custom Domains
2. Add your domain
3. Update frontend VITE_API_URL to use custom domain

## Monitoring & Health Checks

### Backend Health Check
```bash
curl https://your-api.com/health
# Returns: {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

### Database Backup
```bash
# Render/Railway - automatic backups included
# For manual backup:
sqlite3 scamicide.db ".backup scamicide_backup.db"
```

## Troubleshooting

### CORS Errors
- Verify FRONTEND_URL matches your frontend URL exactly
- Check for trailing slashes

### Database Not Persisting
- Ensure persistent disk is attached (Render)
- Verify DB_PATH points to mounted volume

### API Timeouts
- Increase timeout in frontend API config
- Check backend logs for errors

## Performance Optimization

1. **Enable Gzip Compression** (automatic on Vercel/Render)
2. **Use CDN** for static assets
3. **Database Indexing** - already configured in db.js
4. **Connection Pooling** - SQLite handles this automatically

## Security Best Practices

1. Keep dependencies updated
2. Use environment variables for secrets
3. Enable HTTPS (automatic on Vercel/Render)
4. Rate limiting (can be added in future)
5. Input validation (already implemented)

## Cost Estimates

| Service | Free Tier | Paid (approx) |
|---------|-----------|---------------|
| Vercel | Unlimited | $20+/mo |
| Render | 750 hours | $7/mo (web service) |
| Railway | $5 credit/mo | Pay-as-you-go |

