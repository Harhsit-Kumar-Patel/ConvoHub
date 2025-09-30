import mongoose from 'mongoose';
import { MONGODB_URI } from './config.js';

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
}
