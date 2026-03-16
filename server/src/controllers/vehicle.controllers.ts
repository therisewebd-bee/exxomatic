import { Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import { ApiError } from '../utils/apiError.utils.js';
import {
  createVehicleDb,
  updateVehicleDb,
  deleteVehicleDb,
  findVehicleByIdDb,
  findVehiclesDb,
} from '../dbQuery/vehicle.dbquery.js';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  FindVehicleQueryInput,
  VehicleIdParam,
} from '../dto/vehicle.dto.js';
import { ValidatedRequest } from '../types/request.js';

const registerVehicleHandler = AsyncHandler(async (req: ValidatedRequest<CreateVehicleInput>, res: Response) => {
  const { body } = req.validated;

  const created = await createVehicleDb({ body });

  return res.status(201).json(new ApiResponse(201, created, 'Vehicle registered successfully'));
});

const getVehicles = AsyncHandler(async (req: ValidatedRequest<FindVehicleQueryInput>, res: Response) => {
  const { query } = req.validated;

  const vehicles = await findVehiclesDb({ query });

  return res.status(200).json(new ApiResponse(200, vehicles, 'Vehicles retrieved successfully'));
});

const getVehicle = AsyncHandler(async (req: ValidatedRequest<VehicleIdParam>, res: Response) => {
  const { params } = req.validated;

  const vehicle = await findVehicleByIdDb({ params });
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  return res.status(200).json(new ApiResponse(200, vehicle, 'Vehicle retrieved successfully'));
});

const updateVehicleHandler = AsyncHandler(async (req: ValidatedRequest<UpdateVehicleInput & VehicleIdParam>, res: Response) => {
  const { body, params } = req.validated;

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  const updated = await updateVehicleDb({ params }, { body });

  return res.status(200).json(new ApiResponse(200, updated, 'Vehicle updated successfully'));
});

const deleteVehicleHandler = AsyncHandler(async (req: ValidatedRequest<VehicleIdParam>, res: Response) => {
  const { params } = req.validated;

  const result = await deleteVehicleDb({ params });

  return res.status(200).json(new ApiResponse(200, result, 'Vehicle deleted successfully'));
});

export {
  registerVehicleHandler,
  getVehicles,
  getVehicle,
  updateVehicleHandler,
  deleteVehicleHandler,
};
