import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { CORS_ORIGIN, PORT } from './config.js';
import { connectDB } from './db.js';
import apiRouter from './routes/index.js';

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

// Middleware
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Socket.io basic namespaces/rooms
io.of('/chat').on('connection', (socket) => {
  // Join cohort room
  socket.on('joinCohort', (cohortId) => {
    socket.join(`cohort:${cohortId}`);
  });

  // Cohort message
  socket.on('cohortMessage', ({ cohortId, message }) => {
    io.of('/chat').to(`cohort:${cohortId}`).emit('cohortMessage', {
      message,
      cohortId,
      at: new Date().toISOString(),
    });
  });

  // Direct message (p2p via rooms per user)
  socket.on('identify', (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on('directMessage', ({ toUserId, message }) => {
    io.of('/chat').to(`user:${toUserId}`).emit('directMessage', {
      message,
      at: new Date().toISOString(),
    });
  });
});

async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
