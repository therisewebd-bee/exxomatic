import { Router } from 'express';
import userRouter from './user.routes.ts';
import vehicleRouter from './vehicle.routes.ts';
import locationRouter from './location.routes.ts';
import complianceRouter from './vehicleCompliance.routes.ts';
import geofenceRouter from './geofence.routes.ts';

const router = Router();

router.use('/users', userRouter);
router.use('/vehicles', vehicleRouter);
router.use('/locations', locationRouter);
router.use('/compliance', complianceRouter);
router.use('/geofences', geofenceRouter);

export default router;
