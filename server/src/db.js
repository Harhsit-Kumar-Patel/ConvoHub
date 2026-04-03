import mongoose from 'mongoose';
import { MONGODB_URI } from './config.js';

let dbStatus = {
  connected: false,
  degraded: false,
  lastError: null,
};

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    dbStatus = {
      connected: true,
      degraded: false,
      lastError: null,
    };
  } catch (error) {
    const code = error?.cause?.code || error?.code;
    dbStatus = {
      connected: false,
      degraded: false,
      lastError: error,
    };

    if (code === 'ECONNREFUSED' || code === 'EPERM') {
      const friendlyError = new Error(
        `Unable to connect to MongoDB at ${MONGODB_URI}. Make sure MongoDB is running, or update MONGODB_URI in server/.env to a reachable local or Atlas instance.`
      );
      friendlyError.code = code;
      friendlyError.cause = error;
      throw friendlyError;
    }

    throw error;
  }
}

export function markDBDegraded(error) {
  dbStatus = {
    connected: false,
    degraded: true,
    lastError: error || null,
  };
}

export function getDBStatus() {
  return {
    connected: dbStatus.connected,
    degraded: dbStatus.degraded,
    readyState: mongoose.connection.readyState,
    lastError: dbStatus.lastError?.message || null,
  };
}
