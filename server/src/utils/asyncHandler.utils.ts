import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger/logger.ts';

/**
 * Higher Order Function to handle asynchronous express routes
 * Support generic Request types for validated data
 */
const AsyncHandler = <R extends Request = Request>(
  requestHanlder: (req: R, res: Response, next: NextFunction) => any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHanlder(req as any, res, next)).catch((error: any) => {
      logger.error(`[${req.method}] ${req.path}`, {
        message: error.message,
        stack: error.stack,
      });
      next(error);
    });
  };
};

export default AsyncHandler;
