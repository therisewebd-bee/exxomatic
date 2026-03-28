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
import { verifyAuth, requireAdmin } from '../middlewares/auth.middleware.ts';

const router = Router();

// Public auth entrypoint
router.post('/login', validate(loginAccountSchema), loginUserHandler);

// Protected Admin-only routes for completely managing the user lifecycle
router.post('/register', verifyAuth, requireAdmin, validate(createAccountSchema), registerUserHandler);
router.get('/', verifyAuth, requireAdmin, validate(findUserQuerySchema, true), getUsers);
router.get('/:userId', verifyAuth, requireAdmin, validate(userIdParamSchema, true), getUser);
router.patch('/:userId', verifyAuth, requireAdmin, validate(userIdParamSchema, true), validate(updateUserSchema), updateUserHandler);
router.delete('/:userId', verifyAuth, requireAdmin, validate(userIdParamSchema, true), deleteUserHandler);

export default router;
