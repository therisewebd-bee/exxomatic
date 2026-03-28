import { Request, Response, NextFunction } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.ts';
import { ApiError } from '../utils/apiError.utils.ts';
import { verifyToken } from '../utils/auth.utils.ts';
import { findUserAccountByIdDb } from '../dbQuery/user.dbquery.ts';

export const verifyAuth = AsyncHandler(async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.fleet_token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decoded = verifyToken(token);

    const user = await findUserAccountByIdDb(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Invalid access token - user not found');
    }

    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

export const requireAdmin = AsyncHandler(async (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'Admin') {
    throw new ApiError(403, 'Permission denied: Admin access required');
  }
  next();
});
