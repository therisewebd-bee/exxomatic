import { Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.ts';
import { ApiResponse } from '../utils/apiResponse.utils.ts';
import { ApiError } from '../utils/apiError.utils.ts';
import {
  findLocationLogsDb,
  findLocationLogByIdDb,
  deleteLocationLogDb,
} from '../dbQuery/location.dbquery.ts';
import {
  CreateLocationLogInput,
  FindLocationQueryInput,
  LocationIdParam,
} from '../dto/location.dto.ts';
import { ValidatedRequest } from '../types/request.ts';
import { processTrackerUpdate } from '../services/tracker/tracker.logic.ts';

const logLocationHandler = AsyncHandler(async (req: ValidatedRequest<CreateLocationLogInput>, res: Response) => {
  const { body } = req.validated;

  // Ensure Normalized Pipeline is used for consistency across all ingress points
  const result = await processTrackerUpdate({
    imei: body.imei,
    lat: body.lat,
    lng: body.lng,
    timestamp: body.timestamp,
  });

  return res.status(201).json(new ApiResponse(201, result, 'Location logged and processed successfully'));
});

import { findVehiclesDb } from '../dbQuery/vehicle.dbquery.ts';

const getHistory = AsyncHandler(async (req: ValidatedRequest<FindLocationQueryInput> | any, res: Response) => {
  const { query } = req.validated;

  if (req.user?.role !== 'Admin') {
    if (!query.imei) {
      throw new ApiError(400, 'tracker imei is required to fetch history');
    }
    const vehicles = await findVehiclesDb({ imei: query.imei, customerId: req.user.id });
    if (!vehicles || vehicles.length === 0) {
      throw new ApiError(403, 'Permission denied: You do not own this tracker');
    }
  }

  const logs = await findLocationLogsDb(query);

  return res
    .status(200)
    .json(new ApiResponse(200, logs, 'Location history retrieved successfully'));
});

const getLocationLog = AsyncHandler(async (req: ValidatedRequest<LocationIdParam>, res: Response) => {
  const { params } = req.validated;

  const log = await findLocationLogByIdDb(params.locationId);
  if (!log) {
    throw new ApiError(404, 'Location log not found');
  }

  return res.status(200).json(new ApiResponse(200, log, 'Location log retrieved successfully'));
});

const deleteLocationHandler = AsyncHandler(async (req: ValidatedRequest<LocationIdParam>, res: Response) => {
  const { params } = req.validated;

  const result = await deleteLocationLogDb(params.locationId);

  return res.status(200).json(new ApiResponse(200, result, 'Location log deleted successfully'));
});

export { logLocationHandler, getHistory, getLocationLog, deleteLocationHandler };
