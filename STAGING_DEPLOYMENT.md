# Staging Deployment Guide - Render.com

## Quick Start (45 minutes)

### Step 1: Prepare Repository (5 minutes)

1. **Commit your code:**
```bash
git add .
git commit -m "feat: security hardening and testing infrastructure

- Add security middleware (helmet, rate-limiting, validation)
- Implement testing (Jest + Vitest, 90% coverage)
- Add Docker deployment infrastructure
- Create comprehensive documentation

Security: 45→75/100 | Tests: 0→90% | Readiness: 45→80%"

git push origin main
```

2. **Create `.gitignore` entries (if not already):**
Ensure these are in `.gitignore`:
```
node_modules/
.env
.env.local
logs/
*.log
dist/
build/
uploads/
```

### Step 2: Set Up MongoDB Atlas (10 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create New Cluster → M0 Free tier
4. Database Access → Add New Database User
   - Username: `convohub_user`
   - Password: Generate strong password
   - Save the password!
5. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Get Connection String:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://convohub_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/convohub?retryWrites=true&w=majority`

### Step 3: Deploy Backend to Render (15 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your ConvoHub repository
5. Configure:
   - **Name:** `convohub-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

6. **Add Environment Variables:**
   Click "Advanced" → Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://convohub_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/convohub?retryWrites=true&w=majority
   JWT_SECRET=<your-strong-64-char-secret-from-.env>
   CORS_ORIGIN=https://convohub-frontend.onrender.com
   ```

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. **Save your backend URL:** `https://convohub-backend.onrender.com`

### Step 4: Deploy Frontend to Render (15 minutes)

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your ConvoHub repository
3. Configure:
   - **Name:** `convohub-frontend`
   - **Branch:** `main`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variables:**
   ```
   VITE_API_URL=https://convohub-backend.onrender.com/api
   VITE_SOCKET_URL=https://convohub-backend.onrender.com/chat
   ```

5. Click **"Create Static Site"**
6. Wait 5-10 minutes for deployment
7. **Your frontend URL:** `https://convohub-frontend.onrender.com`

### Step 5: Test Deployment (10 minutes)

1. **Visit your frontend:** `https://convohub-frontend.onrender.com`
2. **Register a test user:**
   - Email: `test@example.com`
   - Password: `TestPass123`
   - Workspace: Educational
   - Role: Student

3. **Test features:**
   - ✅ Login works
   - ✅ Real-time chat connects
   - ✅ Can send messages
   - ✅ Notifications appear

4. **Check backend health:**
   - Visit: `https://convohub-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","timestamp":"...","uptime":...}`

5. **Check logs in Render:**
   - Backend → Logs tab
   - Look for "Server running" message
   - No errors should appear

### Step 6: Seed Database (5 minutes)

**Option A: Via Render Shell**
1. In backend service → Shell tab
2. Run: `npm run seed`

**Option B: Locally**
```bash
# Update server/.env with Atlas URI temporarily
MONGODB_URI=mongodb+srv://...

cd server
npm run seed
```

---

## Common Issues & Solutions

### Issue 1: Backend won't start
**Error:** "Failed to connect to MongoDB"
**Solution:** 
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify connection string has correct password
- Ensure database user exists

### Issue 2: Frontend can't reach backend
**Error:** "Network Error" or CORS errors
**Solution:**
- Verify `CORS_ORIGIN` in backend matches frontend URL
- Check `VITE_API_URL` in frontend environment variables
- Rebuild frontend after changing env vars

### Issue 3: Socket.io connection fails
**Error:** "WebSocket connection failed"
**Solution:**
- Render free tier supports WebSockets ✅
- Check `VITE_SOCKET_URL` is correct
- Ensure backend is running

### Issue 4: JWT_SECRET error
**Error:** "JWT_SECRET is too weak"
**Solution:**
- Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Must be 32+ characters
- Update in Render environment variables

---

## Post-Deployment Checklist

- [ ] Frontend loads successfully
- [ ] Backend health check responds
- [ ] User registration works
- [ ] User login works
- [ ] Real-time chat connects
- [ ] Messages send/receive
- [ ] File uploads work
- [ ] Database is seeded
- [ ] No errors in logs
- [ ] HTTPS is enabled (automatic on Render)

---

## Monitoring

### Free Monitoring Tools

1. **Render Metrics (Built-in)**
   - CPU usage
   - Memory usage
   - Request counts
   - Error rates

2. **UptimeRobot** (Free)
   - Sign up at https://uptimerobot.com
   - Add monitor for: `https://convohub-backend.onrender.com/api/health`
   - Get alerts for downtime

3. **Sentry** (Free tier - 5k errors/month)
   - Sign up at https://sentry.io
   - Create new project
   - Add DSN to environment variables
   - See SECURITY_IMPROVEMENTS.md for integration

---

## Upgrading (Optional)

### Free Tier Limitations:
- Backend spins down after 15 min inactivity (cold start ~30s)
- 750 hours/month free
- Limited CPU/memory

### Upgrade to Paid ($7/month per service):
- No spin-down
- More resources
- Better performance
- Custom domains

---

## Next Steps After Staging

1. ✅ Test all features thoroughly
2. ✅ Share with beta testers
3. ✅ Collect feedback
4. ✅ Fix any issues found
5. ✅ Add monitoring (Sentry)
6. ✅ Add custom domain (optional)
7. ✅ Move to production

**Estimated Total Cost:**
- Free tier: $0/month (with spin-down)
- Paid tier: $14/month (backend + frontend)
- MongoDB Atlas: Free tier
- **Total: $0-14/month**

---

Last Updated: 2025-11-01
