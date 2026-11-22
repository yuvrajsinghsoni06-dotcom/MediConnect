import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'mediconnect-super-secret-jwt-key-change-in-production-2026';

// Security check: Never allow weak/default JWT secret outside development
if (env === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('super-secret')) {
    throw new Error('FATAL SECURITY CONFIGURATION: A strong JWT_SECRET of at least 32 characters must be provided in production.');
  }
}

// Parse allowed CORS origins (Strict whitelist: explicitly supports local Vite dev origins)
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173';
const allowedOrigins = rawCors.split(',').map(s => s.trim()).filter(Boolean);

export const config = {
  env,
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: allowedOrigins,
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mediconnect_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10)
  }
};
