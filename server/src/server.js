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

  // Add this new event listener for teams
  socket.on('joinTeam', (teamId) => {
    socket.join(`team:${teamId}`);
  });

  // Direct message (p2p via rooms per user)
  socket.on('identify', (userId) => {
    socket.join(`user:${userId}`);
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