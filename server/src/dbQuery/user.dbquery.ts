import { prismaAdapter } from "./dbInit.js";
import { CreateAccountInput, FindUserQueryInput, UpdateUserInput, UserIdParam } from "../dto/user.dto.js";
import { catchService } from "../utils/utilHandler.js";



//UDS here stands for User Data Schema
//catchServcie here is a highOrder fucntion 
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createUserAccount = catchService(async (userDataScheam: CreateAccountInput) => {
    return await prismaAdapter.user.create({
        data: {
            ...userDataScheam.body
        }
    })
}, "DB-Call:User", "Account Creation");

const findUserAccountByEmail = catchService(async (findUSD: FindUserQueryInput) => {
    return await prismaAdapter.user.findUnique({
        where: {
            email: findUSD.query.email
        },
        select: {
            id: true,
            email: true,
            password: true,
            role: true
        }
    })
}, "DB-Call:User", "Find Account");


const findUserAccountById = catchService(async (uID: UserIdParam) => {
    return await prismaAdapter.user.findUnique({
        where: {
            id: uID.params.userId
        }
    })
}, "DB-Call:User", "Find Account By Id");


const updateUserAccount = catchService(async (uID: UserIdParam, userDataScheam: UpdateUserInput) => {
    return await prismaAdapter.user.update({
        where: {
            id: uID.params.userId
        },
        data: {
            ...userDataScheam.body
        }
    })
}, "DB-Call:User", "Update User Account");


const deleteUserAccount = catchService(async (uID: UserIdParam) => {
    return await prismaAdapter.user.delete({
        where: {
            id: uID.params.userId
        }
    })
}, "DB-Call:User", "Delete User Account");


const findUserAccounts = catchService(async (findUSD: FindUserQueryInput) => {
    const { email, role, page = 1, limit = 10 } = findUSD.query;

    return await prismaAdapter.user.findMany({
        where: {
            email,
            role
        },
        skip: (page - 1) * limit,
        take: limit
    })
}, "DB-Call:User", "Find User Accounts");