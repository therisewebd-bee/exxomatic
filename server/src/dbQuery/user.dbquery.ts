import { prismaAdapter } from './dbInit.ts';
import {
  CreateAccountInput,
  FindUserQueryInput,
  UpdateUserInput,
  UserIdParam,
} from '../dto/user.dto.ts';
import { catchService } from '../utils/utilHandler.ts';

//UDS here stands for User Data Schema
//catchServcie here is a highOrder fucntion
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createUserAccountDb = catchService(
  async (data: any) => {
    return await prismaAdapter.user.create({
      data,
    });
  },
  'DB-Call:User',
  'Account Creation'
);

const findUserAccountByEmailDb = catchService(
  async (email: string) => {
    return await prismaAdapter.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true,
      },
    });
  },
  'DB-Call:User',
  'Find Account'
);

const findUserAccountByIdDb = catchService(
  async (userId: string) => {
    return await prismaAdapter.user.findFirst({
      where: {
        id: userId,
      },
    });
  },
  'DB-Call:User',
  'Find Account By Id'
);

const updateUserAccountDb = catchService(
  async (userId: string, data: any) => {
    return await prismaAdapter.user.update({
      where: {
        id: userId,
      },
      data,
    });
  },
  'DB-Call:User',
  'Update User Account'
);

const deleteUserAccountDb = catchService(
  async (userId: string) => {
    return await prismaAdapter.user.delete({
      where: {
        id: userId,
      },
    });
  },
  'DB-Call:User',
  'Delete User Account'
);

const findUserAccountsDb = catchService(
  async (filters: { email?: string; role?: any; page?: number; limit?: number }) => {
    const { email, role, page = 1, limit = 10 } = filters;

    return await prismaAdapter.user.findMany({
      where: {
        email,
        role,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  },
  'DB-Call:User',
  'Find User Accounts'
);

export {
  createUserAccountDb,
  findUserAccountByEmailDb,
  findUserAccountByIdDb,
  updateUserAccountDb,
  deleteUserAccountDb,
  findUserAccountsDb,
};
