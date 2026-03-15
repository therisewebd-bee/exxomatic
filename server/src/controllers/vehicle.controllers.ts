import { Request, Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import { ApiError } from '../utils/apiError.utils.js';
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  findVehicleById,
  findVehicles,
} from '../dbQuery/vehicle.dbquery.js';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  FindVehicleQueryInput,
  VehicleIdParam,
} from '../dto/vehicle.dto.js';

const registerVehicleHandler = AsyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateVehicleInput['body'];

  const created = await createVehicle({ body });

  return res.status(201).json(new ApiResponse(201, created, 'Vehicle registered successfully'));
});

const getVehicles = AsyncHandler(async (req: Request, res: Response) => {
  const query = req.query as FindVehicleQueryInput['query'];

  const vehicles = await findVehicles({ query });

  return res.status(200).json(new ApiResponse(200, vehicles, 'Vehicles retrieved successfully'));
});

const getVehicle = AsyncHandler(async (req: Request, res: Response) => {
  const params = req.params as unknown as VehicleIdParam['params'];

  const vehicle = await findVehicleById({ params });
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  return res.status(200).json(new ApiResponse(200, vehicle, 'Vehicle retrieved successfully'));
});

const updateVehicleHandler = AsyncHandler(async (req: Request, res: Response) => {
  const body = req.body as UpdateVehicleInput['body'];
  const params = req.params as unknown as VehicleIdParam['params'];

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  const updated = await updateVehicle({ params }, { body });

  return res.status(200).json(new ApiResponse(200, updated, 'Vehicle updated successfully'));
});

const deleteVehicleHandler = AsyncHandler(async (req: Request, res: Response) => {
  const params = req.params as unknown as VehicleIdParam['params'];

  const result = await deleteVehicle({ params });

  return res.status(200).json(new ApiResponse(200, result, 'Vehicle deleted successfully'));
});

export {
  registerVehicleHandler,
  getVehicles,
  getVehicle,
  updateVehicleHandler,
  deleteVehicleHandler,
};
