import { Request, Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.ts';
import { ApiResponse } from '../utils/apiResponse.utils.ts';
import { ApiError } from '../utils/apiError.utils.ts';
import {
  createGeofenceDb,
  updateGeofenceDb,
  findGeofenceByIdDb,
  findAllGeofenceDb,
  checkWithInGeofenceDb,
  deleteGeofenceDb,
} from '../dbQuery/geofence.dbquery.ts';
import {
  CreateGeofenceInput,
  UpdateGeofenceInput,
  FindGeofenceQueryInput,
  GeofenceIdParam,
} from '../dto/geofence.dto.ts';
import { ValidatedRequest } from '../types/request.ts';

const createGeofenceHandler = AsyncHandler(async (req: ValidatedRequest<CreateGeofenceInput> | any, res: Response) => {
  const { body } = req.validated;

  const customerId = req.user?.role === 'Admin' && body.customerId
    ? body.customerId
    : req.user?.id;

  const created = await createGeofenceDb({ ...body, customerId });

  return res.status(201).json(new ApiResponse(201, created, 'Geofence created successfully'));
});

const updateGeofenceHandler = AsyncHandler(async (req: ValidatedRequest<UpdateGeofenceInput & GeofenceIdParam> | any, res: Response) => {
  const { body, params } = req.validated;

  if (req.user?.role !== 'Admin') {
    const geofence = await findGeofenceByIdDb(params.geofenceId);
    if (!geofence) throw new ApiError(404, 'Geofence not found');
    if (geofence.customerId !== req.user?.id) {
      throw new ApiError(403, 'Permission denied');
    }
  }

  const updated = await updateGeofenceDb(params.geofenceId, body);

  return res.status(200).json(new ApiResponse(200, updated, 'Geofence updated successfully'));
});

const getGeofenceHandler = AsyncHandler(async (req: ValidatedRequest<GeofenceIdParam> | any, res: Response) => {
  const { params } = req.validated;

  const geofence = await findGeofenceByIdDb(params.geofenceId);
  if (!geofence) {
    throw new ApiError(404, 'Geofence not found');
  }

  if (req.user?.role !== 'Admin') {
    const isOwner = geofence.customerId === req.user?.id;
    const hasLinkedVehicle = geofence.vehicles?.some(
      (vg: any) => vg.vehicle?.customerId === req.user?.id
    );

    if (!isOwner && !hasLinkedVehicle) {
      throw new ApiError(403, 'Permission denied');
    }
  }

  return res.status(200).json(new ApiResponse(200, geofence, 'Geofence retrieved successfully'));
});

const getAllGeofencesHandler = AsyncHandler(async (req: ValidatedRequest<FindGeofenceQueryInput> | any, res: Response) => {
  const { query } = req.validated;
  const page = query.page || 1;
  const limit = query.limit || 10;

  const filters: any = {};
  if (req.user?.role !== 'Admin') {
    filters.OR = [
      { customerId: req.user?.id },
      { vehicles: { some: { vehicle: { customerId: req.user?.id } } } }
    ];
  }

  const geofences = await findAllGeofenceDb(page, limit, filters);

  return res.status(200).json(new ApiResponse(200, geofences, 'Geofences retrieved successfully'));
});

const checkGeofenceHandler = AsyncHandler(async (req: ValidatedRequest<FindGeofenceQueryInput>, res: Response) => {
  const { query } = req.validated;

  if (!query.imei || query.lat == null || query.lng == null) {
    throw new ApiError(400, 'imei, lat, and lng are required for geofence check');
  }

  const result = await checkWithInGeofenceDb(query.imei, Number(query.lat), Number(query.lng));

  return res.status(200).json(new ApiResponse(200, result, 'Geofence check completed'));
});

const deleteGeofenceHandler = AsyncHandler(async (req: ValidatedRequest<GeofenceIdParam> | any, res: Response) => {
  const { params } = req.validated;
  const id = params.geofenceId!;

  const geofence = await findGeofenceByIdDb(id);
  if (!geofence) {
    throw new ApiError(404, 'Geofence not found');
  }

  if (req.user?.role !== 'Admin' && geofence.customerId !== req.user?.id) {
    throw new ApiError(403, 'Permission denied');
  }

  await deleteGeofenceDb(id);

  return res.status(200).json(new ApiResponse(200, null, 'Geofence deleted successfully'));
});

export {
  createGeofenceHandler,
  updateGeofenceHandler,
  getGeofenceHandler,
  getAllGeofencesHandler,
  checkGeofenceHandler,
  deleteGeofenceHandler,
};
