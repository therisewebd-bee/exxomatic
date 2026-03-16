import { Router } from 'express';
import {
    createGeofenceHandler,
    updateGeofenceHandler,
    getGeofenceHandler,
    getAllGeofencesHandler,
    checkGeofenceHandler,
} from '../controllers/geofence.controllers.js';
import { validate } from '../middleware/validate.middleware.js';
import {
    createGeofenceSchema,
    updateGeofenceSchema,
    geofenceIdParamSchema,
    findGeofenceQuerySchema,
} from '../dto/geofence.dto.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createGeofenceSchema), createGeofenceHandler);
router.get('/', validate(findGeofenceQuerySchema, true), getAllGeofencesHandler);
router.get('/check', validate(findGeofenceQuerySchema, true), checkGeofenceHandler);
router.get('/:geofenceId', validate(geofenceIdParamSchema, true), getGeofenceHandler);
router.patch('/:geofenceId', validate(geofenceIdParamSchema, true), validate(updateGeofenceSchema), updateGeofenceHandler);

export default router;
