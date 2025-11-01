# ConvoHub

A MERN-based student communication dashboard with real-time chat.

## ⚠️ Production Readiness Status

**Current Status:** 🟡 Development Stage - Security Improvements Required  
**Readiness Score:** 45/100  
**Estimated Time to Production:** 3-4 weeks

### Quick Links

- 📋 **[Next Steps Guide](NEXT_STEPS.md)** - Complete roadmap to production
- ⚡ **[Quick Reference](QUICK_REFERENCE.md)** - Commands and checklist at a glance
- 🚀 **[Staging Deployment](STAGING_DEPLOYMENT.md)** - Deploy to Render.com in 45 minutes
- 📊 **[Project Summary](PROJECT_SUMMARY.md)** - Comprehensive project analysis
- 🚨 **[Deployment Readiness Report](DEPLOYMENT_READINESS_REPORT.md)** - Detailed assessment and issues
- 🔧 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- 🔒 **[Security Improvements](SECURITY_IMPROVEMENTS.md)** - Critical security fixes needed
- ⏱️ **[Quick Start Security](QUICK_START_SECURITY.md)** - Fast security implementation (2-3 hours)

---

## Structure
- `client/` React + Vite + Tailwind + shadcn/ui
- `server/` Node.js + Express + Socket.io + MongoDB (Mongoose)

## Quickstart

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)
- Git

### Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env and set your values
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
# Edit .env and set your values
npm run dev
```

### Using Docker (Recommended)
```bash
cp .env.production.example .env.production
# Edit .env.production and set your values
docker-compose up -d
```

---

## 🚨 Before Deploying to Production

**CRITICAL:** This application has security vulnerabilities that MUST be fixed before production deployment.

### Immediate Actions Required:

1. **Security Hardening** (2-3 hours)
   - Follow [QUICK_START_SECURITY.md](QUICK_START_SECURITY.md)
   - Install security packages: helmet, rate-limit, validator
   - Implement input validation
   - Add socket.io authentication
   - Generate strong JWT secret

2. **Testing** (1-2 days)
   - Write unit tests for authentication
   - Test critical API endpoints
   - Test real-time features

3. **Infrastructure** (2-3 days)
   - Set up production database (MongoDB Atlas)
   - Configure environment variables
   - Set up error monitoring (Sentry)
   - Deploy to staging environment

**See [DEPLOYMENT_READINESS_REPORT.md](DEPLOYMENT_READINESS_REPORT.md) for complete details.**

---

## MVP Features

### Core Communication
- ✅ Notice Board
- ✅ Cohort Chat (Socket.io)
- ✅ Direct Messaging
- ✅ Real-time Notifications
- ✅ Verified Profiles
- ✅ Complaint Box

### Educational Workspace
- ✅ Course Management
- ✅ Assignment Submission
- ✅ Grading System
- ✅ Grade Book
- ✅ Calendar Integration
- ✅ Analytics Dashboard
- ✅ User Management (Role-based)

### Professional Workspace
- ✅ Project Management
- ✅ Team Collaboration
- ✅ Task Tracking
- ✅ Team Chat
- ✅ Team Performance Metrics
- ✅ Project Portfolio
- ✅ Team Directory

---

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io
- **Authentication:** JWT + bcryptjs
- **File Upload:** Multer

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI)
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Calendar:** React Big Calendar
- **Animations:** Framer Motion

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Logging:** Winston + Morgan

---

## Project Documentation

### For Developers
- [Project Summary](PROJECT_SUMMARY.md) - Complete project overview
- [Security Improvements](SECURITY_IMPROVEMENTS.md) - Security best practices
- [Quick Start Security](QUICK_START_SECURITY.md) - Fast security setup

### For DevOps
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment steps
- [Deployment Readiness Report](DEPLOYMENT_READINESS_REPORT.md) - Assessment report
- `docker-compose.yml` - Container orchestration
- `.github/workflows/ci.yml` - CI/CD pipeline

### Configuration Files
- `server/.env.example` - Backend environment template
- `client/.env.example` - Frontend environment template
- `.env.production.example` - Production environment template

---

## Development Commands

### Backend
```bash
cd server
npm run dev          # Start development server
npm start            # Start production server
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Frontend
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f server     # View server logs
docker-compose exec server npm run seed  # Seed database
```

---

## Architecture

### Backend Routes
- `/api/auth` - Authentication (register, login)
- `/api/users` - User management
- `/api/notices` - Notice board (educational)
- `/api/announcements` - Announcements (professional)
- `/api/messages` - Direct and group messaging
- `/api/cohorts` - Cohort management
- `/api/teams` - Team management
- `/api/courses` - Course management
- `/api/assignments` - Assignment submission & grading
- `/api/grades` - Grade management
- `/api/projects` - Project management
- `/api/complaints` - Complaint system
- `/api/notifications` - Notification system
- `/api/calendar` - Calendar events
- `/api/analytics` - Analytics data
- `/api/search` - Global search
- `/api/health` - Health check endpoint

### Socket.io Namespaces
- `/chat` - Real-time messaging and notifications
  - `cohort:${id}` - Cohort chat rooms
  - `team:${id}` - Team chat rooms
  - `user:${id}` - User-specific events

---

## Deployment Options

### Option 1: Render.com (Recommended for MVP)
**Pros:** Easy setup, free tier, WebSocket support  
**Cost:** Free - $20/month  
**Time:** 30 minutes

### Option 2: Railway.app
**Pros:** Modern, auto-deploy from Git  
**Cost:** Pay-as-you-go  
**Time:** 20 minutes

### Option 3: Docker on VPS (DigitalOcean, Linode)
**Pros:** Full control, cost-effective at scale  
**Cost:** $5-20/month  
**Time:** 1-2 hours

### Option 4: AWS (Enterprise)
**Pros:** Scalable, enterprise-grade  
**Cost:** $100+/month  
**Time:** 4-6 hours

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.**

---

## Security Checklist

Before going live:

- [ ] All security packages installed (helmet, rate-limit, etc.)
- [ ] Strong JWT_SECRET configured (32+ characters)
- [ ] Input validation on all routes
- [ ] MongoDB query sanitization enabled
- [ ] Socket.io authentication implemented
- [ ] File upload restrictions in place
- [ ] HTTPS/SSL enabled
- [ ] Environment variables secured
- [ ] Error monitoring configured (Sentry)
- [ ] Logging configured (Winston)
- [ ] Database backups set up
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled

**Full checklist:** [DEPLOYMENT_READINESS_REPORT.md](DEPLOYMENT_READINESS_REPORT.md)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

---

## Support

- **Issues:** GitHub Issues
- **Documentation:** See `/docs` folder
- **Security Issues:** Report privately to maintainers

---

## License
MIT

---

## Version History

- **0.1.0** (2025-10-21) - Initial release
  - MVP features implemented
  - Security analysis completed
  - Deployment infrastructure created
  - Documentation added

---

**Last Updated:** 2025-10-21  
**Status:** Development  
**Next Milestone:** Security hardening + testing
