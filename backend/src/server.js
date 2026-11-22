import app from './app.js';
import { config } from './config/environment.js';
import { testConnection } from './config/db.js';

async function startServer() {
  console.log('----------------------------------------------------');
  console.log('MediConnect Healthcare & Blood Safety API Server');
  console.log(`Environment: ${config.env}`);
  console.log('----------------------------------------------------');

  // Verify MySQL connectivity
  await testConnection();

  const server = app.listen(config.port, () => {
    console.log(`[HTTP] Server actively listening on http://localhost:${config.port}`);
    console.log(`[HTTP] Endpoints mounted at: ${config.apiPrefix}`);
    console.log(`[HTTP] Health check: http://localhost:${config.port}/health`);
  });

  process.on('SIGTERM', () => {
    console.log('[HTTP] SIGTERM received. Gracefully closing server...');
    server.close(() => {
      console.log('[HTTP] Server closed.');
      process.exit(0);
    });
  });
}

startServer();
