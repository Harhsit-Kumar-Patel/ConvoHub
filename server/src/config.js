import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please set these variables before starting the server.');
    process.exit(1);
  }
  
  // Warn about insecure JWT secret
  if (process.env.JWT_SECRET === 'change_me' || process.env.JWT_SECRET.length < 32) {
    console.error('ERROR: JWT_SECRET is too weak. Please use a strong secret (minimum 32 characters).');
    console.error('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))";');
    process.exit(1);
  }
}

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/convohub';
export const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV || 'development';
