# Grace Resources - Deployment Guide

This guide will walk you through deploying both the frontend and backend to **free services**.

- **Frontend:** Vercel (free tier)
- **Backend:** Render.com (free tier)

---

## Part 1: Deploy Backend to Render.com

### Step 1: Create a Render Account
1. Go to https://render.com
2. Click **Sign Up**
3. Use GitHub to sign up (easier for deploying from your repo)
4. Authorize Render to access your GitHub account

### Step 2: Create a New Web Service
1. Click **New +** → **Web Service**
2. Select your `grace-resources` repo
3. Configure:
   - **Name:** `grace-resources-api` (or whatever you want)
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`

### Step 3: Add Environment Variables
Before deploying, add your Claude API key:
1. Scroll down to **Environment**
2. Click **Add Environment Variable**
3. Add:
   - **Key:** `CLAUDE_API_KEY`
   - **Value:** (your Claude API key from https://console.anthropic.com)
4. Also add:
   - **Key:** `NODE_ENV`
   - **Value:** `production`

### Step 4: Deploy
Click **Create Web Service**. Render will build and deploy automatically. You'll get a URL like:
```
https://grace-resources-api.onrender.com
```

**Note:** The free tier sleeps after 15 minutes of inactivity. It'll wake up on first request (takes ~30 seconds). That's fine for now.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create a Vercel Account
1. Go to https://vercel.com
2. Click **Sign Up**
3. Use GitHub (easiest)
4. Authorize Vercel

### Step 2: Import Your Project
1. Click **Add New** → **Project**
2. Find and select `grace-resources`
3. Click **Import**

### Step 3: Configure Build Settings
Vercel should auto-detect React, but make sure:
- **Framework:** Next.js / Create React App
- **Root Directory:** `./frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`

### Step 4: Add Environment Variable
Before deploying, set the backend URL:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://grace-resources-api.onrender.com` (use your Render URL)
3. Make sure it applies to **Production**

### Step 5: Deploy
Click **Deploy**. Vercel will build and deploy automatically. You'll get a URL like:
```
https://grace-resources.vercel.app
```

---

## Part 3: Verify It Works

1. Go to your Vercel URL in a browser
2. Try submitting a question
3. Wait for the response (first request might be slow if backend is sleeping)

---

## Troubleshooting

### Backend won't deploy
- Check that `backend/package.json` and `backend/src/` files exist
- Check the build/deploy logs in Render dashboard
- Make sure API key is set in environment variables

### Frontend gets blank page
- Check browser console for errors (F12 → Console)
- Make sure `REACT_APP_API_URL` is set correctly
- Try refreshing the page

### "API error 500"
- Backend might be sleeping (Render free tier). Wait 30 seconds and try again.
- Check backend logs in Render dashboard
- Verify Claude API key is correct

### CORS errors
The backend needs to accept requests from your Vercel domain. Update `backend/src/index.js`:

```javascript
const cors = require('cors');

// Update this line:
app.use(cors({
  origin: 'https://grace-resources.vercel.app', // Add your Vercel URL
  credentials: true
}));
```

Then redeploy.

---

## Next Steps

1. **Share it!** Send the Vercel URL to friends and church groups
2. **Get feedback** on what resources are most helpful
3. **Add more resources** to the library based on feedback
4. **Consider a custom domain** (Vercel/Render both support this)
5. **Upgrade to paid tiers** when you need better performance

---

## Free Tier Limitations

**Render (Backend):**
- Spins down after 15 min of inactivity
- Limited to 750 free dyno hours/month (plenty)
- Restart happens once per day

**Vercel (Frontend):**
- Unlimited deployments
- Bandwidth limited to 100GB/month (more than enough)
- All features included on free tier

Both free tiers are plenty for getting started and testing!

---

## Questions?

If something doesn't work:
1. Check the deployment logs (Render/Vercel dashboards)
2. Try redeploying
3. Make sure environment variables are set
4. Check that GitHub shows the latest code

Good luck! 🚀
