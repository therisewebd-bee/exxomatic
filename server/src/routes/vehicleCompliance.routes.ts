import { Router } from 'express';
import {
    logComplianceHandler,
    getCompliances,
    getCompliance,
    updateComplianceHandler,
    deleteComplianceHandler,
    getLiveFuelRate,
} from '../controllers/vehicleCompliance.controllers.ts';
import { validate } from '../middleware/validate.middleware.ts';
import {
    createVehicleComplianceSchema,
    updateVehicleComplianceSchema,
    findVehicleComplianceQuerySchema,
    complianceIdParamSchema,
} from '../dto/vehicleCompliance.dto.ts';
import { verifyAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createVehicleComplianceSchema), logComplianceHandler);
router.get('/', validate(findVehicleComplianceQuerySchema, true), getCompliances);
router.get('/fuel/live-rate', getLiveFuelRate);
router.get('/:complianceId', validate(complianceIdParamSchema, true), getCompliance);
router.patch('/:complianceId', validate(complianceIdParamSchema, true), validate(updateVehicleComplianceSchema), updateComplianceHandler);
router.delete('/:complianceId', validate(complianceIdParamSchema, true), deleteComplianceHandler);

export default router;
