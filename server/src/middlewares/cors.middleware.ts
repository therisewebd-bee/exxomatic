import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from '../config/config.ts';

/**
 * Centralized CORS Middleware
 * 
 * Configured to allow cross-origin requests from prioritized frontend origins
 * while maintaining strict credential (cookie) support.
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    const isAllowed = config.allowedOrigins.some((allowed) => {
      // Direct match
      if (allowed === origin) return true;
      // Domain match (for ec2 compute-1 etc if we add them to config)
      if (origin.endsWith(allowed.replace(/^https?:\/\//, ''))) return true;
      return false;
    });

    if (isAllowed || config.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
