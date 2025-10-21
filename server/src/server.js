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

// CORS and body parsing
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
    environment: process.env.NODE_ENV || 'development',
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