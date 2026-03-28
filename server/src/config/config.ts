import dotenv from 'dotenv';
import path from 'path';
import os from 'os';

dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  tcpPort: process.env.TCP_PORT || 5000,
  bufferFlushInterval: Number(process.env.BUFFER_FLUSH_INTERVAL) || 120000,
  wsBatchInterval: Number(process.env.WS_BATCH_INTERVAL) || 250,
  clusterWorkers: Number(process.env.CLUSTER_WORKERS) || os.cpus().length,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'your-cookie-secret',
  dbUrl: process.env.DATABASE_URL,
  frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:5173').trim().replace(/^["'](.*)["']$/, '$1'),
  allowedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://exxomatic.netlify.app',
    'https://codeczero-test.duckdns.org',
    (process.env.FRONTEND_URL || '').trim().replace(/^["'](.*?)["']$/, '$1'),
  ].filter(Boolean) as string[],
  emailWorkerUrl: (process.env.EMAIL_WORKER_URL || '').trim(),
};