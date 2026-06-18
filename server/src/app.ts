import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { corsMiddleware } from './middlewares/cors.middleware.ts';
import mainRouter from './routes/index.ts';

const app = express();



// 1. CORS First (Handle preflights immediately)
app.use(corsMiddleware);

// 2. Helmet with Cross-Origin Resource Policy
app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Routes
import { preventDuplicateRequests } from './middlewares/preventDuplicateRequests.ts';

app.use('/api', preventDuplicateRequests, mainRouter);

// ─── Serve Frontend Static Build (Production) ──────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '../../frontend/dist');

app.use(express.static(frontendDist));

// SPA catch-all: serve index.html for any non-API route
app.get('*', (req, res, next) => {
  // Skip API routes and health check
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next(); // fall through to 404 if dist doesn't exist (dev mode)
  });
});

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
