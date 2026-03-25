import { Router } from 'express';
import {
    logLocationHandler,
    getHistory,
    getLocationLog,
    deleteLocationHandler,
} from '../controllers/location.controllers.ts';
import { validate } from '../middlewares/validate.middleware.ts';
import {
    createLocationLogSchema,
    findLocationQuerySchema,
    locationIdParamSchema,
} from '../dto/location.dto.ts';
import { verifyAuth } from '../middlewares/auth.middleware.ts';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createLocationLogSchema), logLocationHandler);
router.get('/history', validate(findLocationQuerySchema, true), getHistory);
router.get('/:locationId', validate(locationIdParamSchema, true), getLocationLog);
router.delete('/:locationId', validate(locationIdParamSchema, true), deleteLocationHandler);

export default router;
