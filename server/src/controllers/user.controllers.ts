import { Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import { ApiError } from '../utils/apiError.utils.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils.js';
import {
  createUserAccountDb,
  findUserAccountByEmailDb,
  findUserAccountByIdDb,
  updateUserAccountDb,
  deleteUserAccountDb,
  findUserAccountsDb,
} from '../dbQuery/user.dbquery.js';
import {
  CreateAccountInput,
  FindUserQueryInput,
  UpdateUserInput,
  UserIdParam,
  LoginAccountInput,
} from '../dto/user.dto.js';
import { ValidatedRequest } from '../types/request.js';

const registerUserHandler = AsyncHandler(async (req: ValidatedRequest<CreateAccountInput>, res: Response) => {
  const { body } = req.validated;

  // Check if user already exists
  const existingUser = await findUserAccountByEmailDb({ query: { email: body.email } });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(body.password);

  const created = await createUserAccountDb({
    body: {
      ...body,
      password: hashedPassword,
    },
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = created;

  return res
    .status(201)
    .json(new ApiResponse(201, userWithoutPassword, 'User registered successfully'));
});

const loginUserHandler = AsyncHandler(async (req: ValidatedRequest<LoginAccountInput>, res: Response) => {
  const { body } = req.validated;

  const user = await findUserAccountByEmailDb({ query: { email: body.email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await comparePassword(body.password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  const { password: _, ...userWithoutPassword } = user;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  return res
    .status(200)
    .cookie('accessToken', token, cookieOptions)
    .json(new ApiResponse(200, { user: userWithoutPassword, token }, 'Login successful'));
});

const getUsers = AsyncHandler(async (req: ValidatedRequest<FindUserQueryInput>, res: Response) => {
  const { query } = req.validated;

  const users = await findUserAccountsDb({ query });

  return res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

const getUser = AsyncHandler(async (req: ValidatedRequest<UserIdParam>, res: Response) => {
  const { params } = req.validated;

  const user = await findUserAccountByIdDb({ params });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
});

const updateUserHandler = AsyncHandler(async (req: ValidatedRequest<UpdateUserInput & UserIdParam>, res: Response) => {
  const { body, params } = req.validated;

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  const updated = await updateUserAccountDb({ params }, { body });

  return res.status(200).json(new ApiResponse(200, updated, 'User updated successfully'));
});

const deleteUserHandler = AsyncHandler(async (req: ValidatedRequest<UserIdParam>, res: Response) => {
  const { params } = req.validated;

  const result = await deleteUserAccountDb({ params });

  return res.status(200).json(new ApiResponse(200, result, 'User deleted successfully'));
});

export {
  registerUserHandler,
  loginUserHandler,
  getUsers,
  getUser,
  updateUserHandler,
  deleteUserHandler,
};
