import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/convohub';
export const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
