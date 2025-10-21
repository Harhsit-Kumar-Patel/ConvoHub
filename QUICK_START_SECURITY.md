# Quick Start: Security Implementation Guide

**Time Required:** 4-6 hours  
**Priority:** CRITICAL - Do this before any deployment

This guide provides copy-paste code to quickly implement essential security features.

---

## Step 1: Install Security Packages (5 minutes)

```bash
cd server
npm install helmet express-rate-limit express-validator express-mongo-sanitize winston morgan
npm install -D eslint
```

---

## Step 2: Create Logger (10 minutes)

Create `server/src/logger.js`:

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'convohub-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;
```

Create logs directory:
```bash
mkdir -p server/logs
echo "logs/" >> server/.gitignore
```

---

## Step 3: Update server.js (20 minutes)

Replace `server/src/server.js` content with:

```javascript
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { CORS_ORIGIN, PORT, JWT_SECRET, NODE_ENV } from './config.js';
import { connectDB } from './db.js';
import apiRouter from './routes/index.js';
import logger from './logger.js';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});

// Make io accessible in routes
app.set('io', io);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Sanitize data against MongoDB injection
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// HTTP request logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
} else {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(cors({ 
  origin: CORS_ORIGIN, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// Routes
app.use('/api', apiRouter);

// Socket.io with authentication
io.of('/chat').use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.of('/chat').on('connection', (socket) => {
  logger.info(`User ${socket.userId} connected`);
  
  // Automatically join user's personal room
  socket.join(`user:${socket.userId}`);
  
  socket.on('joinCohort', (cohortId) => {
    socket.join(`cohort:${cohortId}`);
    logger.debug(`User ${socket.userId} joined cohort ${cohortId}`);
  });

  socket.on('joinTeam', (teamId) => {
    socket.join(`team:${teamId}`);
    logger.debug(`User ${socket.userId} joined team ${teamId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`User ${socket.userId} disconnected`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Express error:', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({ 
    message: NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

start();
```

---

## Step 4: Create Validators (30 minutes)

Create `server/src/validators/auth.js`:

```javascript
import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  
  body('workspaceType')
    .notEmpty().withMessage('Workspace type is required')
    .isIn(['educational', 'professional']).withMessage('Invalid workspace type'),
  
  body('role')
    .optional()
    .isString().withMessage('Role must be a string'),
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};
```

---

## Step 5: Update Auth Routes (15 minutes)

Update `server/src/routes/auth.js`:

```javascript
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { JWT_SECRET } from '../config.js';
import { validateRegister, validateLogin, validate } from '../validators/auth.js';
import logger from '../logger.js';

const router = Router();

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// POST /api/auth/register
router.post('/register', authLimiter, validateRegister, validate, async (req, res) => {
  try {
    const { name, email, password, workspaceType, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const defaultRole = String(workspaceType) === 'professional' ? 'member' : 'student';
    const allowedRoles = [
      'student', 'ta', 'instructor', 'coordinator', 'principal',
      'member', 'lead', 'manager', 'org_admin',
      'admin'
    ];
    let roleToUse = defaultRole;
    if (role && allowedRoles.includes(role)) {
      roleToUse = role;
    }
    
    const user = await User.create({ 
      name, 
      email, 
      passwordHash, 
      role: roleToUse, 
      workspaceType 
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, workspaceType: user.workspaceType }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    logger.info('User registered', { userId: user._id, email: user.email });
    
    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        workspaceType: user.workspaceType 
      },
    });
  } catch (err) {
    logger.error('Registration error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, workspaceType: user.workspaceType }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    logger.info('User logged in', { userId: user._id, email: user.email });
    
    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        workspaceType: user.workspaceType 
      },
    });
  } catch (err) {
    logger.error('Login error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
```

---

## Step 6: Secure File Uploads (15 minutes)

Replace `server/src/middleware/upload.js`:

```javascript
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
};

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = ALLOWED_FILE_TYPES[file.mimetype];
    cb(null, `${randomName}.${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
  fileFilter: fileFilter,
});

export default upload;
```

---

## Step 7: Update Socket Client (10 minutes)

Update `client/src/lib/socket.js`:

```javascript
import { io } from 'socket.io-client';
import { getToken } from './auth.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000/chat';

let socket;

export function getSocket() {
  if (!socket) {
    const token = getToken();
    socket = io(SOCKET_URL, { 
      transports: ['websocket'],
      auth: { token }
    });
    
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
```

---

## Step 8: Generate Strong JWT Secret (2 minutes)

```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and add to server/.env
# JWT_SECRET=<paste_generated_secret_here>
```

---

## Step 9: Update .gitignore (1 minute)

Add to `server/.gitignore`:
```
logs/
*.log
```

---

## Step 10: Test Everything (30 minutes)

```bash
# 1. Start the server
cd server
npm run dev

# 2. In another terminal, start the client
cd client
npm run dev

# 3. Test these scenarios:
# - Register a new user
# - Login with that user
# - Try to login with wrong password (should be rate limited after 5 attempts)
# - Upload a file
# - Try to upload an invalid file type (should fail)
# - Send a message via socket
# - Check that logs are being created in server/logs/
```

---

## Verification Checklist

After completing all steps, verify:

- [ ] Server starts without errors
- [ ] Health check works: `curl http://localhost:5000/api/health`
- [ ] Registration validates input (try weak password)
- [ ] Login is rate limited (try 6 failed logins)
- [ ] File upload rejects invalid types
- [ ] Socket connection requires authentication
- [ ] Logs are created in `server/logs/`
- [ ] MongoDB queries are sanitized
- [ ] Security headers are present (check browser devtools)

---

## Common Issues & Solutions

### Issue 1: "Cannot find module 'winston'"
**Solution:** Run `npm install` again in server directory

### Issue 2: Socket connection fails
**Solution:** Make sure you're passing the token in auth configuration

### Issue 3: Rate limit not working
**Solution:** Clear browser cache and try from incognito window

### Issue 4: File uploads fail
**Solution:** Ensure `uploads/` directory exists: `mkdir -p server/uploads`

---

## Next Steps

After completing this guide:

1. ✅ Run linting: `npm run lint`
2. ✅ Test with Docker: `docker-compose up`
3. ✅ Read DEPLOYMENT_GUIDE.md for production deployment
4. ✅ Set up Sentry for error monitoring
5. ✅ Write tests for critical paths

---

## Additional Resources

- Full security guide: `SECURITY_IMPROVEMENTS.md`
- Deployment guide: `DEPLOYMENT_GUIDE.md`
- Project summary: `PROJECT_SUMMARY.md`

---

**Completion Time:** ~2-3 hours  
**Status After Completion:** Ready for staging deployment  
**Remaining for Production:** Testing + monitoring setup
