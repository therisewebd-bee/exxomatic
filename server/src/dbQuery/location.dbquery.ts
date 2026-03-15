import { prismaAdapter } from './dbInit.js';
import {
  CreateLocationLogInput,
  FindLocationQueryInput,
  LocationIdParam,
} from '../dto/location.dto.js';
import { catchService } from '../utils/utilHandler.js';

//LDS here stands for Location Data Schema
//catchServcie here is a highOrder fucntion
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createLocationLog = catchService(
  async (locationDataScheam: CreateLocationLogInput) => {
    return await prismaAdapter.locationLog.create({
      data: {
        ...locationDataScheam.body,
      },
    });
  },
  'DB-Call:Location',
  'Create Location Log'
);

const findLocationLogs = catchService(
  async (findLDS: FindLocationQueryInput) => {
    const { imei, startDate, endDate, limit = 100 } = findLDS.query;
    return await prismaAdapter.locationLog.findMany({
      where: {
        imei,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  },
  'DB-Call:Location',
  'Find Location Logs'
);

const findLocationLogById = catchService(
  async (lID: LocationIdParam) => {
    return await prismaAdapter.locationLog.findUnique({
      where: {
        id: lID.params.locationId,
      },
    });
  },
  'DB-Call:Location',
  'Find Location Log By Id'
);

const deleteLocationLog = catchService(
  async (lID: LocationIdParam) => {
    return await prismaAdapter.locationLog.delete({
      where: {
        id: lID.params.locationId,
      },
    });
  },
  'DB-Call:Location',
  'Delete Location Log'
);

export { createLocationLog, findLocationLogs, findLocationLogById, deleteLocationLog };
