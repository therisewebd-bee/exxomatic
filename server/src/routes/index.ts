import { Router } from 'express';
import userRouter from './user.routes.js';
import vehicleRouter from './vehicle.routes.js';
import locationRouter from './location.routes.js';
import complianceRouter from './vehicleCompliance.routes.js';
import geofenceRouter from './geofence.routes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/vehicles', vehicleRouter);
router.use('/locations', locationRouter);
router.use('/compliance', complianceRouter);
router.use('/geofences', geofenceRouter);

export default router;
