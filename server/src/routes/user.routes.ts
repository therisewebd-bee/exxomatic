import { Router } from 'express';
import {
    registerUserHandler,
    loginUserHandler,
    getUsers,
    getUser,
    updateUserHandler,
    deleteUserHandler,
} from '../controllers/user.controllers.ts';
import { validate } from '../middlewares/validate.middleware.ts';
import {
    createAccountSchema,
    loginAccountSchema,
    updateUserSchema,
    userIdParamSchema,
    findUserQuerySchema,
} from '../dto/user.dto.ts';
import { verifyAuth } from '../middlewares/auth.middleware.ts';

const router = Router();

router.post('/register', validate(createAccountSchema), registerUserHandler);
router.post('/login', validate(loginAccountSchema), loginUserHandler);

// Protected routes
router.get('/', verifyAuth, validate(findUserQuerySchema, true), getUsers);
router.get('/:userId', verifyAuth, validate(userIdParamSchema, true), getUser);
router.patch('/:userId', verifyAuth, validate(userIdParamSchema, true), validate(updateUserSchema), updateUserHandler);
router.delete('/:userId', verifyAuth, validate(userIdParamSchema, true), deleteUserHandler);

export default router;
