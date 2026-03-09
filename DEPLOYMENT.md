# Vercel Deployment Guide - MagizhHealDesk

## Overview
Both frontend and backend can be deployed to Vercel. Your backend is **lightweight** and perfect for Vercel's serverless functions!

### Backend Weight Analysis ✅
- **Dependencies**: Only 6 packages (express, mongoose, groq-sdk, cors, dotenv, body-parser)
- **Code Size**: ~10 JavaScript files
- **External Services**: MongoDB Atlas + Groq API (serverless-friendly)
- **Verdict**: ✅ **Very lightweight** - Perfect for Vercel!

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```
3. **Environment Variables Ready**:
   - Backend: `MONGO_ATLAS`, `GROQ_API_KEY`
   - Frontend: `VITE_API_URL`

---

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### A. Deploy Backend

1. **Push code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Vercel deployment configs"
   git push origin main
   ```

2. **Import Backend Project**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - **Root Directory**: Set to `backend`
   - Click "Deploy"

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add these variables:
     - `MONGO_ATLAS`: Your MongoDB Atlas connection string
     - `GROQ_API_KEY`: Your Groq API key
     - `NODE_ENV`: `production`
   - Click "Save"
   - Redeploy the project

4. **Get Backend URL**:
   - After deployment, copy your backend URL (e.g., `https://your-backend.vercel.app`)

#### B. Deploy Frontend

1. **Update Frontend Environment Variable**:
   - Edit `frontend/.env`:
     ```env
     VITE_API_URL=https://your-backend.vercel.app/api
     ```
   - Commit and push:
     ```bash
     git add frontend/.env
     git commit -m "Update API URL for production"
     git push origin main
     ```

2. **Import Frontend Project**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the same repository again
   - **Root Directory**: Set to `frontend`
   - Framework: Should auto-detect as "Vite"
   - Click "Deploy"

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_API_URL`: `https://your-backend.vercel.app/api`
   - Click "Save"
   - Redeploy

4. **Access Your App**:
   - Frontend URL: `https://your-frontend.vercel.app`

---

### Option 2: Deploy via Vercel CLI

#### Backend Deployment

```bash
cd backend
vercel
# Follow prompts:
# - Link to existing project? No
# - Project name: magizhHealDesk-backend
# - Deploy? Yes

# Add environment variables
vercel env add MONGO_ATLAS
vercel env add GROQ_API_KEY
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

#### Frontend Deployment

```bash
cd frontend
# Update .env with production backend URL
echo "VITE_API_URL=https://your-backend.vercel.app/api" > .env

vercel
# Follow prompts:
# - Link to existing project? No
# - Project name: magizhHealDesk-frontend
# - Deploy? Yes

# Add environment variable
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

---

## Important Notes

### Backend Considerations

1. **Serverless Functions**:
   - Each API route runs as a serverless function
   - **Timeout**: 10 seconds (Hobby), 60 seconds (Pro)
   - **Cold Starts**: First request may be slower (~1-2 seconds)

2. **MongoDB Connection**:
   - MongoDB Atlas is recommended (already configured)
   - Connection pooling handled automatically by Mongoose

3. **Groq API**:
   - Works perfectly with serverless
   - API calls are external, no issues

4. **File Size Limits**:
   - Your backend is well under Vercel's limits
   - Total size: ~10 JS files + node_modules
   - ✅ No issues

### Frontend Considerations

1. **Build Output**:
   - Vite builds to `dist/` folder
   - Vercel automatically detects and serves static files

2. **Routing**:
   - React Router configured with `vercel.json` rewrites
   - All routes redirect to `index.html` for client-side routing

3. **Environment Variables**:
   - Must prefix with `VITE_` to be accessible
   - Already configured in `.env`

---

## CORS Configuration

Make sure your backend accepts requests from your frontend domain. Update `backend/server.js` if needed:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', // Local dev
    'https://your-frontend.vercel.app' // Production
  ],
  credentials: true
}));
```

---

## Testing Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Frontend**:
   - Visit `https://your-frontend.vercel.app`
   - Test all features:
     - ✅ Stock Management
     - ✅ Billing
     - ✅ Chatbot with Groq AI

---

## Troubleshooting

### Backend Issues

1. **"Function exceeded timeout"**:
   - Optimize database queries
   - Add indexes to MongoDB collections
   - Use Vercel Pro for 60s timeout

2. **Environment variables not working**:
   - Verify they're added in Vercel Dashboard
   - Redeploy after adding variables
   - Check capitalization (case-sensitive)

3. **MongoDB connection errors**:
   - Whitelist Vercel IPs in MongoDB Atlas (or allow all: `0.0.0.0/0`)
   - Check connection string format

### Frontend Issues

1. **API calls failing**:
   - Check `VITE_API_URL` is correct
   - Verify CORS is configured
   - Check browser console for errors

2. **404 on page refresh**:
   - `vercel.json` rewrites should fix this
   - Verify file exists in frontend directory

---

## Custom Domain (Optional)

1. **Add Domain to Frontend**:
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `magizhHealDesk.com`)
   - Follow DNS configuration instructions

2. **Add Domain to Backend**:
   - Add subdomain (e.g., `api.magizhHealDesk.com`)
   - Update frontend `VITE_API_URL` to use custom domain

---

## Cost Estimate

### Vercel Hobby Plan (FREE)
- ✅ **100GB Bandwidth/month**
- ✅ **Unlimited Deployments**
- ✅ **Automatic HTTPS**
- ✅ **Your app will fit comfortably**

### When to Upgrade to Pro ($20/month)
- High traffic (>100GB/month)
- Need longer function timeout (60s)
- Team collaboration features

**Verdict**: Start with FREE plan - it's more than enough for your lightweight app! 🎉

---

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend to Vercel
- [ ] Add backend environment variables (MONGO_ATLAS, GROQ_API_KEY)
- [ ] Copy backend deployment URL
- [ ] Update frontend `.env` with backend URL
- [ ] Deploy frontend to Vercel
- [ ] Add frontend environment variable (VITE_API_URL)
- [ ] Test health endpoint
- [ ] Test all features (Stock, Billing, Chatbot)
- [ ] (Optional) Configure custom domain

---

## Summary

✅ **YES, both can be deployed to Vercel!**

✅ **Your backend is lightweight**:
- Only 6 dependencies
- ~10 JavaScript files
- External MongoDB + Groq API
- Perfect for serverless

✅ **Configuration files created**:
- `backend/vercel.json`
- `frontend/vercel.json`
- `backend/server.js` updated for serverless

✅ **Free tier is sufficient** for your app size

🚀 **Ready to deploy!** Follow the steps above.
