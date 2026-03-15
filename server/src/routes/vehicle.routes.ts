import { Router } from 'express';
import {
    registerVehicleHandler,
    getVehicles,
    getVehicle,
    updateVehicleHandler,
    deleteVehicleHandler,
} from '../controllers/vehicle.controllers.js';
import { validate } from '../middleware/validate.middleware.js';
import {
    createVehicleSchema,
    updateVehicleSchema,
    vehicleIdParamSchema,
    findVehicleQuerySchema,
} from '../dto/vehicle.dto.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createVehicleSchema), registerVehicleHandler);
router.get('/', validate(findVehicleQuerySchema, true), getVehicles);
router.get('/:vehicleId', validate(vehicleIdParamSchema, true), getVehicle);
router.patch('/:vehicleId', validate(vehicleIdParamSchema), validate(updateVehicleSchema), updateVehicleHandler);
router.delete('/:vehicleId', validate(vehicleIdParamSchema, true), deleteVehicleHandler);

export default router;
