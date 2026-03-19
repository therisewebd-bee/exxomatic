import { Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.ts';
import { ApiResponse } from '../utils/apiResponse.utils.ts';
import { ApiError } from '../utils/apiError.utils.ts';
import {
  createVehicleComplianceDb,
  updateVehicleComplianceDb,
  deleteVehicleComplianceDb,
  findVehicleComplianceByIdDb,
  findVehicleCompliancesDb,
} from '../dbQuery/vehicleCompliance.dbquery.ts';
import {
  CreateVehicleComplianceInput,
  UpdateVehicleComplianceInput,
  FindVehicleComplianceQueryInput,
  ComplianceIdParam,
} from '../dto/vehicleCompliance.dto.ts';
import { ValidatedRequest } from '../types/request.ts';

const logComplianceHandler = AsyncHandler(async (req: ValidatedRequest<CreateVehicleComplianceInput>, res: Response) => {
  const { body } = req.validated;

  const logged = await createVehicleComplianceDb({ body });

  return res
    .status(201)
    .json(new ApiResponse(201, logged, 'Compliance record logged successfully'));
});

const getCompliances = AsyncHandler(async (req: ValidatedRequest<FindVehicleComplianceQueryInput>, res: Response) => {
  const { query } = req.validated;

  const result = await findVehicleCompliancesDb({ query });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Compliance records retrieved successfully'));
});

const getCompliance = AsyncHandler(async (req: ValidatedRequest<ComplianceIdParam>, res: Response) => {
  const { params } = req.validated;

  const record = await findVehicleComplianceByIdDb({ params });
  if (!record) {
    throw new ApiError(404, 'Compliance record not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, 'Compliance record retrieved successfully'));
});

const updateComplianceHandler = AsyncHandler(async (req: ValidatedRequest<UpdateVehicleComplianceInput & ComplianceIdParam>, res: Response) => {
  const { body, params } = req.validated;

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  const updated = await updateVehicleComplianceDb({ params }, { body });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Compliance record updated successfully'));
});

const deleteComplianceHandler = AsyncHandler(async (req: ValidatedRequest<ComplianceIdParam>, res: Response) => {
  const { params } = req.validated;

  const result = await deleteVehicleComplianceDb({ params });

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
