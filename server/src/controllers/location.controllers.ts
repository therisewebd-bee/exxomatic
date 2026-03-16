import { Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import { ApiError } from '../utils/apiError.utils.js';
import {
  findLocationLogsDb,
  findLocationLogByIdDb,
  deleteLocationLogDb,
} from '../dbQuery/location.dbquery.js';
import {
  CreateLocationLogInput,
  FindLocationQueryInput,
  LocationIdParam,
} from '../dto/location.dto.js';
import { ValidatedRequest } from '../types/request.js';
import { processTrackerUpdate } from '../services/tracker/tracker.logic.js';

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

const getHistory = AsyncHandler(async (req: ValidatedRequest<FindLocationQueryInput>, res: Response) => {
  const { query } = req.validated;

  const logs = await findLocationLogsDb({ query });

  return res
    .status(200)
    .json(new ApiResponse(200, logs, 'Location history retrieved successfully'));
});

const getLocationLog = AsyncHandler(async (req: ValidatedRequest<LocationIdParam>, res: Response) => {
  const { params } = req.validated;

  const log = await findLocationLogByIdDb({ params });
  if (!log) {
    throw new ApiError(404, 'Location log not found');
  }

  return res.status(200).json(new ApiResponse(200, log, 'Location log retrieved successfully'));
});

const deleteLocationHandler = AsyncHandler(async (req: ValidatedRequest<LocationIdParam>, res: Response) => {
  const { params } = req.validated;

  const result = await deleteLocationLogDb({ params });

  return res.status(200).json(new ApiResponse(200, result, 'Location log deleted successfully'));
});

export { logLocationHandler, getHistory, getLocationLog, deleteLocationHandler };
