import { Router } from 'express';
import {
    logLocationHandler,
    getHistory,
    getLocationLog,
    deleteLocationHandler,
} from '../controllers/location.controllers.js';
import { validate } from '../middleware/validate.middleware.js';
import {
    createLocationLogSchema,
    findLocationQuerySchema,
    locationIdParamSchema,
} from '../dto/location.dto.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createLocationLogSchema), logLocationHandler);
router.get('/history', validate(findLocationQuerySchema, true), getHistory);
router.get('/:locationId', validate(locationIdParamSchema, true), getLocationLog);
router.delete('/:locationId', validate(locationIdParamSchema, true), deleteLocationHandler);

export default router;
