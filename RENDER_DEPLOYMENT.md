# Render Deployment Checklist

## Step 1: Push to GitHub
```bash
cd /Users/christopheramos/Desktop/Scamicide
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## Step 2: Deploy Backend to Render

### Create Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Select your GitHub repository
4. Configure:
   - **Name:** `scamicide-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Environment Variables
Add these in the Render dashboard (Environment tab):
```
PORT=443
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Add Persistent Disk (Required!)
1. In your service → **Disks** → **Add Disk**
2. **Size:** 1 GB
3. **Mount Path:** `/data`
4. **Name:** `scamicide-data`

### Note Your Backend URL
Example: `https://scamicide-api.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### Create Project
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Environment Variable
Add in Vercel dashboard:
```
VITE_API_URL=https://scamicide-api.onrender.com/api
```

### Deploy
Click **Deploy** - done!

---

## Step 4: Update Backend Environment
After frontend is deployed, update Render backend:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Verification
Test these endpoints:
- Backend Health: `https://scamicide-api.onrender.com/health`
- API Info: `https://scamicide-api.onrender.com/api`
- Frontend: `https://your-frontend.vercel.app`

---

## Troubleshooting

### CORS Errors?
- Check `FRONTEND_URL` matches frontend exactly (no trailing slash)

### Database Empty?
- Ensure Persistent Disk is mounted at `/data`

### 502 Bad Gateway?
- Check backend logs in Render dashboard
- Ensure `PORT=443` is set

### Changes Not Deploying?
- Trigger redeploy in Render: **Settings** → **Deploy**
- Push new commit to GitHub

