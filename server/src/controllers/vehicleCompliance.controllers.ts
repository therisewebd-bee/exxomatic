import { Request, Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import { ApiError } from '../utils/apiError.utils.js';
import {
  createVehicleCompliance,
  updateVehicleCompliance,
  deleteVehicleCompliance,
  findVehicleComplianceById,
  findVehicleCompliances,
} from '../dbQuery/vehicleCompliance.dbquery.js';
import {
  CreateVehicleComplianceInput,
  UpdateVehicleComplianceInput,
  FindVehicleComplianceQueryInput,
  ComplianceIdParam,
} from '../dto/vehicleCompliance.dto.js';

const logComplianceHandler = AsyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateVehicleComplianceInput['body'];

  const logged = await createVehicleCompliance({ body });

  return res
    .status(201)
    .json(new ApiResponse(201, logged, 'Compliance record logged successfully'));
});

const getCompliances = AsyncHandler(async (req: Request, res: Response) => {
  const query = req.query as FindVehicleComplianceQueryInput['query'];

  const result = await findVehicleCompliances({ query });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Compliance records retrieved successfully'));
});

const getCompliance = AsyncHandler(async (req: Request, res: Response) => {
  const params = req.params as unknown as ComplianceIdParam['params'];

  const record = await findVehicleComplianceById({ params });
  if (!record) {
    throw new ApiError(404, 'Compliance record not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, 'Compliance record retrieved successfully'));
});

const updateComplianceHandler = AsyncHandler(async (req: Request, res: Response) => {
  const body = req.body as UpdateVehicleComplianceInput['body'];
  const params = req.params as unknown as ComplianceIdParam['params'];

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  const updated = await updateVehicleCompliance({ params }, { body });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Compliance record updated successfully'));
});

const deleteComplianceHandler = AsyncHandler(async (req: Request, res: Response) => {
  const params = req.params as unknown as ComplianceIdParam['params'];

  const result = await deleteVehicleCompliance({ params });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Compliance record deleted successfully'));
});

export {
  logComplianceHandler,
  getCompliances,
  getCompliance,
  updateComplianceHandler,
  deleteComplianceHandler,
};
