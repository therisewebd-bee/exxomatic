import { Request, Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import { ApiError } from '../utils/apiError.utils.js';
import {
  createLocationLog,
  findLocationLogs,
  findLocationLogById,
  deleteLocationLog,
} from '../dbQuery/location.dbquery.js';
import {
  CreateLocationLogInput,
  FindLocationQueryInput,
  LocationIdParam,
} from '../dto/location.dto.js';

const logLocationHandler = AsyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateLocationLogInput['body'];

  const logged = await createLocationLog({ body });

  return res.status(201).json(new ApiResponse(201, logged, 'Location logged successfully'));
});

const getHistory = AsyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as FindLocationQueryInput['query'];

  const logs = await findLocationLogs({ query });

  return res
    .status(200)
    .json(new ApiResponse(200, logs, 'Location history retrieved successfully'));
});

const getLocationLog = AsyncHandler(async (req: Request, res: Response) => {
  const params = req.params as unknown as LocationIdParam['params'];

  const log = await findLocationLogById({ params });
  if (!log) {
    throw new ApiError(404, 'Location log not found');
  }

  return res.status(200).json(new ApiResponse(200, log, 'Location log retrieved successfully'));
});

const deleteLocationHandler = AsyncHandler(async (req: Request, res: Response) => {
  const params = req.params as unknown as LocationIdParam['params'];

  const result = await deleteLocationLog({ params });

  return res.status(200).json(new ApiResponse(200, result, 'Location log deleted successfully'));
});

export { logLocationHandler, getHistory, getLocationLog, deleteLocationHandler };
