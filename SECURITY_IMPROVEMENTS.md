# Security Improvements for ConvoHub

This document outlines critical security improvements that MUST be implemented before production deployment.

## 🚨 Critical Priority (Implement Immediately)

### 1. Install Security Packages

```bash
cd server
npm install helmet express-rate-limit express-validator express-mongo-sanitize
```

### 2. Update server.js with Security Middleware

Add these imports at the top of `server/src/server.js`:

```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
```

Add middleware (before routes):

```javascript
// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some features
}));

// Sanitize data to prevent MongoDB injection
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all routes
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per 15 minutes
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});
```

### 3. Update Auth Routes with Rate Limiting

In `server/src/routes/auth.js`:

```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
});

// Apply to login and register
router.post('/register', authLimiter, async (req, res) => { /* ... */ });
router.post('/login', authLimiter, async (req, res) => { /* ... */ });
```

### 4. Add Input Validation

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

Use in auth routes:

```javascript
import { validateRegister, validateLogin, validate } from '../validators/auth.js';

router.post('/register', validateRegister, validate, async (req, res) => { /* ... */ });
router.post('/login', validateLogin, validate, async (req, res) => { /* ... */ });
```

### 5. Improve File Upload Security

Update `server/src/middleware/upload.js`:

```javascript
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Allowed file types
const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
};

// File filter function
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    // Generate random filename to prevent path traversal
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = ALLOWED_FILE_TYPES[file.mimetype];
    cb(null, `${randomName}.${ext}`);
  },
});

// Initialize upload with restrictions
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Max 5 files per request
  },
  fileFilter: fileFilter,
});

export default upload;
```

### 6. Add Socket.io Authentication

Update `server/src/server.js`:

```javascript
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

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
  console.log(`User ${socket.userId} connected`);
  
  // Automatically join user's personal room
  socket.join(`user:${socket.userId}`);
  
  socket.on('joinCohort', (cohortId) => {
    // TODO: Verify user has access to this cohort
    socket.join(`cohort:${cohortId}`);
  });

  socket.on('joinTeam', (teamId) => {
    // TODO: Verify user has access to this team
    socket.join(`team:${teamId}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});
```

Update `client/src/lib/socket.js`:

```javascript
import { io } from 'socket.io-client';
import { getUser, getToken } from './auth.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000/chat';

let socket;

export function getSocket() {
  if (!socket) {
    const token = getToken();
    socket = io(SOCKET_URL, { 
      transports: ['websocket'],
      auth: { token } // Send token for authentication
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

### 7. Implement Proper Logging

Install winston:

```bash
npm install winston
```

Create `server/src/logger.js`:

```javascript
import winston from 'winston';
import { NODE_ENV } from './config.js';

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
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

// Console logging in development
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;
```

Replace all `console.log` and `console.error` with:

```javascript
import logger from '../logger.js';

// Instead of console.log
logger.info('Server started', { port: PORT });

// Instead of console.error
logger.error('Database connection failed', { error: err.message });
```

### 8. Add Request Logging

Install morgan:

```bash
npm install morgan
```

In `server/src/server.js`:

```javascript
import morgan from 'morgan';
import logger from './logger.js';

// HTTP request logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
} else {
  app.use(morgan('dev'));
}
```

### 9. Environment Variable Validation

Already implemented in updated `config.js` - ensures JWT_SECRET is strong in production.

### 10. CORS Hardening

Update CORS configuration in `server/src/server.js`:

```javascript
app.use(cors({ 
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 📋 Security Checklist

Before deploying to production:

- [ ] All security packages installed (helmet, rate-limit, etc.)
- [ ] JWT_SECRET is strong (minimum 32 characters)
- [ ] Environment variables validated on startup
- [ ] Rate limiting enabled on all routes
- [ ] Auth routes have stricter rate limits
- [ ] Input validation on all user inputs
- [ ] MongoDB query sanitization enabled
- [ ] File upload validation implemented
- [ ] Socket.io authentication enabled
- [ ] Proper logging with winston
- [ ] Request logging with morgan
- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured
- [ ] Security headers set with helmet
- [ ] Database credentials secured
- [ ] No sensitive data in logs
- [ ] Error messages don't leak system info
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention
- [ ] CSRF tokens (if using cookies)

---

## 🔐 Additional Recommendations

### 1. Use HTTP-Only Cookies for Tokens (Better than localStorage)

**Why:** localStorage is vulnerable to XSS attacks. HTTP-only cookies are more secure.

Update auth routes to set cookies:

```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### 2. Implement Refresh Tokens

Add a refresh token mechanism to reduce token exposure time.

### 3. Add CSRF Protection

If using cookies:

```bash
npm install csurf
```

### 4. Database Encryption at Rest

Enable MongoDB encryption (available in MongoDB Enterprise or Atlas).

### 5. Regular Security Audits

```bash
# Run regularly
npm audit
npm audit fix

# For deeper analysis
npm install -g snyk
snyk test
```

### 6. Dependency Updates

Keep dependencies updated:

```bash
npm outdated
npm update
```

### 7. Secrets Management

For production, use:
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Environment-specific .env files (never commit to git)

### 8. WAF (Web Application Firewall)

Consider using:
- Cloudflare WAF
- AWS WAF
- ModSecurity

### 9. DDoS Protection

Use services like:
- Cloudflare
- AWS Shield
- Akamai

### 10. Security Headers

Test your deployed app at:
- https://securityheaders.com
- https://observatory.mozilla.org

---

## 🛡️ Penetration Testing

Before launch, conduct:

1. **Automated scanning:**
   - OWASP ZAP
   - Burp Suite
   - Nikto

2. **Manual testing:**
   - SQL/NoSQL injection
   - XSS attacks
   - CSRF attacks
   - Authentication bypass
   - Authorization bypass
   - File upload vulnerabilities

3. **Third-party audit:**
   Consider hiring security professionals for production apps.

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Socket.io Security](https://socket.io/docs/v4/middlewares/)

---

**Status:** These improvements are MANDATORY for production deployment.  
**Priority:** CRITICAL  
**Timeline:** Implement before any public release.
