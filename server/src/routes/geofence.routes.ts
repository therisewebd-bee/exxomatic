import { Router } from 'express';
import {
    createGeofenceHandler,
    updateGeofenceHandler,
    getGeofenceHandler,
    getAllGeofencesHandler,
    checkGeofenceHandler,
} from '../controllers/geofence.controllers.ts';
import { validate } from '../middleware/validate.middleware.ts';
import {
    createGeofenceSchema,
    updateGeofenceSchema,
    geofenceIdParamSchema,
    findGeofenceQuerySchema,
} from '../dto/geofence.dto.ts';
import { verifyAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createGeofenceSchema), createGeofenceHandler);
router.get('/', validate(findGeofenceQuerySchema, true), getAllGeofencesHandler);
router.get('/check', validate(findGeofenceQuerySchema, true), checkGeofenceHandler);
router.get('/:geofenceId', validate(geofenceIdParamSchema, true), getGeofenceHandler);
router.patch('/:geofenceId', validate(geofenceIdParamSchema, true), validate(updateGeofenceSchema), updateGeofenceHandler);

export default router;
