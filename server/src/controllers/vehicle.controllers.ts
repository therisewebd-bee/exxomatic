import { Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.ts';
import { ApiResponse } from '../utils/apiResponse.utils.ts';
import { ApiError } from '../utils/apiError.utils.ts';
import {
  createVehicleDb,
  updateVehicleDb,
  deleteVehicleDb,
  findVehicleByIdDb,
  findVehiclesDb,
} from '../dbQuery/vehicle.dbquery.ts';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  FindVehicleQueryInput,
  VehicleIdParam,
} from '../dto/vehicle.dto.ts';
import { ValidatedRequest } from '../types/request.ts';
import { vehicleCache } from '../services/tracker/vehicleCache.ts';
import { processTrackerUpdate } from '../services/tracker/tracker.logic.ts';

/**
 * POST /api/vehicles
 * Admin  → can pass `customerId` in body to register on behalf of a customer.
 * Customer → vehicle is always assigned to their own account.
 */
const registerVehicleHandler = AsyncHandler(async (req: ValidatedRequest<CreateVehicleInput> | any, res: Response) => {
  const { body } = req.validated;
  const customerId = req.user?.role === 'Admin' && body.customerId
    ? body.customerId
    : req.user?.id;

  const created = await createVehicleDb({
    ...body,
    customerId
  });
  vehicleCache.addVehicle(created.imei);

  // Instantly process and broadcast the most recent unknown payload to un-stick the frontend
  const stashedPayload = vehicleCache.unknownPayloads.get(created.imei);
  if (stashedPayload) {
    vehicleCache.unknownPayloads.delete(created.imei);
    processTrackerUpdate(stashedPayload).catch() // fire-and-forget
  }

  return res.status(201).json(new ApiResponse(201, created, 'Vehicle registered successfully'));
});

/**
 * GET /api/vehicles
 * Admin    → sees all vehicles (can optionally filter by customerId query).
 * Customer → only sees their own vehicles.
 */
const getVehicles = AsyncHandler(async (req: ValidatedRequest<FindVehicleQueryInput> | any, res: Response) => {
  const { query } = req.validated;

  const filters = { ...query };

  // Customers can only ever see their own fleet
  if (req.user?.role !== 'Admin') {
    filters.customerId = req.user?.id;
  }

  const vehicles = await findVehiclesDb(filters);

  return res.status(200).json(new ApiResponse(200, vehicles, 'Vehicles retrieved successfully'));
});

/**
 * GET /api/vehicles/:vehicleId
 * Admin    → can view any vehicle.
 * Customer → can only view their own vehicle.
 */
const getVehicle = AsyncHandler(async (req: ValidatedRequest<VehicleIdParam> | any, res: Response) => {
  const { params } = req.validated;

  const vehicle = await findVehicleByIdDb(params.vehicleId);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  if (req.user?.role !== 'Admin' && vehicle.customerId !== req.user?.id) {
    throw new ApiError(403, 'You do not have permission to access this vehicle');
  }

  return res.status(200).json(new ApiResponse(200, vehicle, 'Vehicle retrieved successfully'));
});

/**
 * PATCH /api/vehicles/:vehicleId
 * Admin    → can update any vehicle.
 * Customer → can only update their own vehicle.
 */
const updateVehicleHandler = AsyncHandler(async (req: ValidatedRequest<UpdateVehicleInput & VehicleIdParam> | any, res: Response) => {
  const { body, params } = req.validated;

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  if (req.user?.role !== 'Admin') {
    const vehicle = await findVehicleByIdDb(params.vehicleId);
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');
    if (vehicle.customerId !== req.user?.id) {
      throw new ApiError(403, 'You do not have permission to update this vehicle');
    }
  }

  const updated = await updateVehicleDb(params.vehicleId, body);

  return res.status(200).json(new ApiResponse(200, updated, 'Vehicle updated successfully'));
});

/**
 * DELETE /api/vehicles/:vehicleId
 * Admin    → can delete any vehicle.
 * Customer → can only delete their own vehicle.
 */
const deleteVehicleHandler = AsyncHandler(async (req: ValidatedRequest<VehicleIdParam> | any, res: Response) => {
  const { params } = req.validated;

  if (req.user?.role !== 'Admin') {
    const vehicle = await findVehicleByIdDb(params.vehicleId);
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');
    if (vehicle.customerId !== req.user?.id) {
      throw new ApiError(403, 'You do not have permission to delete this vehicle');
    }
  }

  const result = await deleteVehicleDb(params.vehicleId);
  if (result) {
    vehicleCache.removeVehicle(result.imei);
  }

  return res.status(200).json(new ApiResponse(200, result, 'Vehicle deleted successfully'));
});

export {
  registerVehicleHandler,
  getVehicles,
  getVehicle,
  updateVehicleHandler,
  deleteVehicleHandler,
};
