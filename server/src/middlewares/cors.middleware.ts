import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from '../config/config.js';

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
      const cleanAllowed = allowed.trim().toLowerCase();
      const cleanOrigin = origin.trim().toLowerCase();
      
      // Direct match
      if (cleanAllowed === cleanOrigin) return true;
      // Domain match (ends with domain.com)
      const domainOnly = cleanAllowed.replace(/^https?:\/\//, '');
      if (cleanOrigin.endsWith(domainOnly)) return true;
      return false;
    });

    if (isAllowed || config.nodeEnv === 'development' || config.nodeEnv === 'dev') {
      callback(null, true);
    } else {
      console.error(`[CORS REJECT] Origin: "${origin}" | Expected one of:`, config.allowedOrigins);
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
