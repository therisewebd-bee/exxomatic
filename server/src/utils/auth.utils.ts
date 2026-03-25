import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiError } from './apiError.utils.ts';
import { config } from '../config/config.ts';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain password with a hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token
 */
export const generateToken = (payload: object): string => {
  const secret = config.jwtSecret as string;
  const signOptions = {
    expiresIn: config.jwtExpiresIn,
    algorithm: 'HS256',
  };
  return jwt.sign(payload, secret, signOptions as any);
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): any => {
  const secret = config.jwtSecret;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};
