import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ApiError } from '../utils/apiError.utils.ts';
import logger from '../services/logger/logger.ts';

const inFlightRequests = new Set<string>();

/**
 * Global API Debounce Middleware
 * Prevents duplicate concurrent state-changing requests (POST, PUT, PATCH, DELETE).
 * Generates an idempotency key based on Method, URL, Auth Token/IP, and Body.
 * If a request with the exact same key is already processing, it returns 429.
 */
export const preventDuplicateRequests = (req: Request, res: Response, next: NextFunction) => {
  // Only apply to state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  // Create idempotency key: HTTP Method + Path + Auth/IP + Body
  // We check headers/cookies since req.user might not be parsed yet globally
  const authId = req.headers.authorization || req.cookies?.token || req.ip || 'unknown';
  const rawKey = `${req.method}:${req.originalUrl}:${authId}:${JSON.stringify(req.body || {})}`;
  
  const hashKey = crypto.createHash('sha256').update(rawKey).digest('hex');

  if (inFlightRequests.has(hashKey)) {
    logger.warn(`[Debounce] Blocked duplicate in-flight request: ${req.method} ${req.originalUrl}`);
    return next(new ApiError(429, 'This request is already processing. Please wait.'));
  }

  inFlightRequests.add(hashKey);

  // Remove the lock once the response is sent or connection drops
  const releaseLock = () => {
    inFlightRequests.delete(hashKey);
    res.removeListener('finish', releaseLock);
    res.removeListener('close', releaseLock);
  };

  res.on('finish', releaseLock);
  res.on('close', releaseLock);

  next();
};
