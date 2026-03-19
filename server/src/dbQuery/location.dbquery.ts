import { prismaAdapter } from './dbInit.ts';
import {
  CreateLocationLogInput,
  FindLocationQueryInput,
  LocationIdParam,
} from '../dto/location.dto.ts';
import { catchService } from '../utils/utilHandler.ts';

//LDS here stands for Location Data Schema
//catchServcie here is a highOrder fucntion
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createLocationLogDb = catchService(
  async (data: any) => {
    return await prismaAdapter.locationLog.create({
      data,
    });
  },
  'DB-Call:Location',
  'Create Location Log'
);

const findLocationLogsDb = catchService(
  async (filters: { imei?: string; startDate?: Date; endDate?: Date; limit?: number }) => {
    const { imei, startDate, endDate, limit = 100 } = filters;
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

const findLocationLogByIdDb = catchService(
  async (locationId: string) => {
    return await prismaAdapter.locationLog.findFirst({
      where: {
        id: locationId,
      },
    });
  },
  'DB-Call:Location',
  'Find Location Log By Id'
);

const deleteLocationLogDb = catchService(
  async (locationId: string) => {
    return await prismaAdapter.locationLog.delete({
      where: {
        id: locationId,
      },
    });
  },
  'DB-Call:Location',
  'Delete Location Log'
);

export { createLocationLogDb, findLocationLogsDb, findLocationLogByIdDb, deleteLocationLogDb };
