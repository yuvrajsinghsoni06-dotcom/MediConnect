import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment.js';
import { isDbConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bloodSafetyRoutes from './routes/bloodSafetyRoutes.js';
import generalRoutes from './routes/generalRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Cross-Origin Resource Sharing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logging (skip during automated test runs)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// System Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mysqlConnected: isDbConnected(),
    environment: config.env
  });
});

// Mount Routes under /api/v1 and /api (alias for backward compatibility)
const apiRouters = [config.apiPrefix, '/api'];

apiRouters.forEach(prefix => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/blood-safety`, bloodSafetyRoutes);
  app.use(`${prefix}`, generalRoutes);
});

// Central Error Handler
app.use(errorHandler);

export default app;
