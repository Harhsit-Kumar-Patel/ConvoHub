import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_PORT = 5001;
const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/convohub';
const DEFAULT_JWT_SECRET = 'dev_secret_key_change_me_in_production';
const DEFAULT_CORS_ORIGIN = 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Validate required environment variables in production
if (isProduction) {
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

export const PORT = process.env.PORT || DEFAULT_PORT;
export const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN;
export { NODE_ENV };
