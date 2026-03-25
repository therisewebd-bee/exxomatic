import { Router } from 'express';
import {
    registerVehicleHandler,
    getVehicles,
    getVehicle,
    updateVehicleHandler,
    deleteVehicleHandler,
} from '../controllers/vehicle.controllers.ts';
import { validate } from '../middlewares/validate.middleware.ts';
import {
    createVehicleSchema,
    updateVehicleSchema,
    vehicleIdParamSchema,
    findVehicleQuerySchema,
} from '../dto/vehicle.dto.ts';
import { verifyAuth } from '../middlewares/auth.middleware.ts';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createVehicleSchema), registerVehicleHandler);
router.get('/', validate(findVehicleQuerySchema, true), getVehicles);
router.get('/:vehicleId', validate(vehicleIdParamSchema, true), getVehicle);
router.patch('/:vehicleId', validate(vehicleIdParamSchema, true), validate(updateVehicleSchema), updateVehicleHandler);
router.delete('/:vehicleId', validate(vehicleIdParamSchema, true), deleteVehicleHandler);

export default router;
