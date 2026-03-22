import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { config } from './config/config.ts';
import statusMonitor from 'express-status-monitor';
import mainRouter from './routes/index.ts';

const app = express();

// Performance Monitoring Dashboard (Accessible at /status)
app.use(statusMonitor());

app.use(helmet({
  contentSecurityPolicy: false, // Ease for Leaflet/Simulation testing
}));
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(cors({
  origin: true, // Allow all origins while maintaining credentials support
  credentials: true,
}));
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', mainRouter);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  const response: any = {
    success: false,
    message: err.message ?? 'internal server error',
    status: statusCode,
    path: req.path,
    timeStamp: new Date().toISOString(),
  };

  if (err.service) response.service = err.service;
  if (err.operation) response.operation = err.operation;

  res.status(statusCode).json(response);
});

export default app;
