import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger/logger.js';

const AsyncHandler = (
  requestHanlder: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHanlder(req, res, next)).catch((error: any) => {
      logger.error(`[${req.method}] ${req.path}`, {
        message: error.message,
        stack: error.stack,
      });
      next(error);
    });
  };
};

export default AsyncHandler;
