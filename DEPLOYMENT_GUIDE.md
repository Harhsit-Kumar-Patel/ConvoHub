# ConvoHub Deployment Guide

This guide provides step-by-step instructions for deploying ConvoHub to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Manual Deployment](#manual-deployment)
5. [Cloud Platform Deployment](#cloud-platform-deployment)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Software

- **Node.js**: v18 or higher
- **MongoDB**: v5.0 or higher (or MongoDB Atlas account)
- **Docker**: v20.10 or higher (for Docker deployment)
- **Docker Compose**: v2.0 or higher (for Docker deployment)
- **Git**: Latest version

### Required Accounts (for cloud deployment)

- MongoDB Atlas (free tier available)
- Cloud hosting provider (Render, Railway, Vercel, etc.)
- Domain name (optional but recommended)

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ConvoHub.git
cd ConvoHub
```

### 2. Create Environment Files

#### Backend (.env)

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
# REQUIRED - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_here

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/convohub?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# CORS - Your frontend URL
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Frontend (.env)

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com/chat
```

---

## Docker Deployment

### Option 1: Using Docker Compose (Recommended)

This deploys the entire stack (MongoDB, Backend, Frontend) in containers.

#### Step 1: Set Environment Variables

Create `.env.production`:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and fill in all required values.

#### Step 2: Build and Start Services

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Step 3: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

#### Step 4: Seed Database (Optional)

```bash
docker-compose exec server npm run seed
```

#### Step 5: Stop Services

```bash
docker-compose down

# To also remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Option 2: Build Individual Containers

#### Backend:

```bash
cd server
docker build -t convohub-server .
docker run -d \
  -p 5000:5000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e CORS_ORIGIN="https://your-domain.com" \
  --name convohub-server \
  convohub-server
```

#### Frontend:

```bash
cd client
docker build -t convohub-client .
docker run -d -p 3000:80 --name convohub-client convohub-client
```

---

## Manual Deployment

### Backend Deployment

#### 1. Install Dependencies

```bash
cd server
npm ci --only=production
```

#### 2. Set Environment Variables

Ensure `.env` file is properly configured (see Environment Setup).

#### 3. Start the Server

```bash
# Development
npm run dev

# Production
npm start

# With PM2 (recommended for production)
npm install -g pm2
pm2 start src/server.js --name convohub-server
pm2 save
pm2 startup
```

### Frontend Deployment

#### 1. Install Dependencies

```bash
cd client
npm ci
```

#### 2. Build Production Bundle

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

#### 3. Serve Static Files

**Option A: Using Nginx**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/ConvoHub/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Option B: Using Node.js (serve package)**

```bash
npm install -g serve
serve -s dist -l 3000
```

---

## Cloud Platform Deployment

### Option 1: Render.com (Recommended)

#### Backend:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name**: convohub-server
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all from `.env.example`

#### Frontend:

1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: convohub-client
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Environment Variables**: Add VITE_API_URL, VITE_SOCKET_URL

#### Database:

Use MongoDB Atlas (free tier):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Update MONGODB_URI in Render environment variables

### Option 2: Railway.app

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Create project: `railway init`
4. Add MongoDB: `railway add` → Select MongoDB
5. Deploy backend:
   ```bash
   cd server
   railway up
   ```
6. Deploy frontend separately to Vercel (see below)

### Option 3: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel:

```bash
cd client
npm install -g vercel
vercel

# Follow prompts, set environment variables in Vercel dashboard
```

#### Backend on Render:

Follow Render.com instructions above.

### Option 4: AWS (Advanced)

For production-grade deployment, consider AWS:

- **Frontend**: S3 + CloudFront
- **Backend**: ECS/Fargate or EC2
- **Database**: DocumentDB or MongoDB Atlas
- **Load Balancer**: Application Load Balancer
- **SSL**: AWS Certificate Manager

(Detailed AWS guide beyond scope - consult AWS documentation)

---

## Post-Deployment

### 1. SSL/TLS Certificate

**Using Let's Encrypt (free):**

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 2. Configure Domain DNS

Point your domain to your server:

```
A Record: @ → Your_Server_IP
A Record: www → Your_Server_IP
```

### 3. Seed Initial Data

```bash
cd server
npm run seed
```

### 4. Test the Application

- Register a new user
- Create a cohort/team
- Send messages
- Upload files
- Check real-time chat

### 5. Set Up Backups

**MongoDB Atlas** (automatic backups included)

**Self-hosted MongoDB:**

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your_mongodb_uri" --out="/backups/mongo_backup_$DATE"

# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

---

## Monitoring & Maintenance

### 1. Set Up Error Monitoring

**Sentry** (recommended):

```bash
# Install
npm install @sentry/node @sentry/react

# Configure in server/src/server.js
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### 2. Application Monitoring

**PM2 Monitoring** (if using PM2):

```bash
pm2 monit
pm2 logs convohub-server
```

### 3. Health Checks

Backend health endpoint: `GET /api/health`

```bash
curl https://your-backend-domain.com/api/health
```

### 4. Log Management

**Using Winston** (add to backend):

```bash
npm install winston

# In server/src/config.js
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 5. Uptime Monitoring

Use services like:
- **UptimeRobot** (free)
- **Pingdom**
- **StatusCake**

### 6. Database Maintenance

```bash
# Check MongoDB stats
mongosh "your_mongodb_uri"
> db.stats()

# Create indexes (if not exists)
> db.users.createIndex({ email: 1 })
> db.messages.createIndex({ createdAt: -1 })
```

---

## Troubleshooting

### Common Issues

**1. CORS Errors**

- Verify `CORS_ORIGIN` in server `.env` matches your frontend URL
- Check that frontend is using correct API URL

**2. WebSocket Connection Failed**

- Ensure Socket.io endpoint is accessible
- Check firewall rules allow WebSocket connections
- Verify `VITE_SOCKET_URL` is correct

**3. MongoDB Connection Timeout**

- Check MongoDB URI is correct
- Whitelist server IP in MongoDB Atlas
- Verify network connectivity

**4. JWT Token Invalid**

- Ensure `JWT_SECRET` is set and consistent
- Check token expiration (default 7 days)

**5. File Upload Fails**

- Check `uploads/` directory exists and is writable
- Verify file size limits in `upload.js` middleware

### Logs

```bash
# Docker logs
docker-compose logs -f server
docker-compose logs -f client

# PM2 logs
pm2 logs convohub-server

# System logs (Linux)
journalctl -u convohub-server -f
```

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up security headers (helmet.js)
- [ ] Configure CSP (Content Security Policy)
- [ ] Regular security audits (`npm audit`)
- [ ] Keep dependencies updated

---

## Performance Optimization

- Enable gzip compression (Nginx/Express)
- Use CDN for static assets
- Implement Redis caching
- Optimize database queries with indexes
- Enable HTTP/2
- Minify and bundle assets (Vite handles this)
- Implement lazy loading for routes

---

## Scaling Considerations

As your application grows:

1. **Horizontal Scaling**: Deploy multiple backend instances behind a load balancer
2. **Database Scaling**: Use MongoDB replica sets or sharding
3. **Caching**: Add Redis for session storage and caching
4. **CDN**: Use CloudFlare or AWS CloudFront
5. **Queue System**: Add Bull/BullMQ for background jobs
6. **Monitoring**: Implement APM tools (New Relic, Datadog)

---

## Support & Resources

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **API Reference**: See `API_DOCUMENTATION.md`
- **Community**: Discord/Slack channel

---

**Last Updated:** 2025-10-21  
**Version:** 1.0.0
