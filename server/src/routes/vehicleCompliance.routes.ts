import { Router } from 'express';
import {
    logComplianceHandler,
    getCompliances,
    getCompliance,
    updateComplianceHandler,
    deleteComplianceHandler,
} from '../controllers/vehicleCompliance.controllers.js';
import { validate } from '../middleware/validate.middleware.js';
import {
    createVehicleComplianceSchema,
    updateVehicleComplianceSchema,
    findVehicleComplianceQuerySchema,
    complianceIdParamSchema,
} from '../dto/vehicleCompliance.dto.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyAuth);

router.post('/', validate(createVehicleComplianceSchema), logComplianceHandler);
router.get('/', validate(findVehicleComplianceQuerySchema, true), getCompliances);
router.get('/:complianceId', validate(complianceIdParamSchema, true), getCompliance);
router.patch('/:complianceId', validate(complianceIdParamSchema, true), validate(updateVehicleComplianceSchema), updateComplianceHandler);
router.delete('/:complianceId', validate(complianceIdParamSchema, true), deleteComplianceHandler);

export default router;
