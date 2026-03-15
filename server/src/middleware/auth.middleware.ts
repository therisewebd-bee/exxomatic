import { Request, Response, NextFunction } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.js';
import { ApiError } from '../utils/apiError.utils.js';
import { verifyToken } from '../utils/auth.utils.js';
import { findUserAccountById } from '../dbQuery/user.dbquery.js';

export const verifyAuth = AsyncHandler(async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decoded = verifyToken(token);

    const user = await findUserAccountById({ params: { userId: decoded.id } });
    if (!user) {
      throw new ApiError(401, 'Invalid access token - user not found');
    }

    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
