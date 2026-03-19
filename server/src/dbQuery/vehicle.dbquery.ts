import { prismaAdapter } from './dbInit.ts';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  FindVehicleQueryInput,
  VehicleIdParam,
} from '../dto/vehicle.dto.ts';
import { catchService } from '../utils/utilHandler.ts';

//VDS here stands for Vehicle Data Schema
//catchServcie here is a highOrder fucntion
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createVehicleDb = catchService(
  async (data: any) => {
    const { geofenceIds, ...body } = data;

    const vehicle = await prismaAdapter.vehicleInfo.create({
      data: {
        ...body,
      },
    });

    if (geofenceIds && geofenceIds.length > 0) {
      await prismaAdapter.vehiclesOnGeofences.createMany({
        data: geofenceIds.map((gId: string) => ({
          vehicleId: vehicle.id,
          geofenceId: gId,
        })),
      });
    }

    return vehicle;
  },
  'DB-Call:Vehicle',
  'Vehicle Creation'
);

const updateVehicleDb = catchService(
  async (vehicleId: string, data: any) => {
    const { geofenceIds, ...body } = data;

    const vehicle = await prismaAdapter.vehicleInfo.update({
      where: {
        id: vehicleId,
      },
      data: {
        ...body,
      },
    });

    if (geofenceIds) {
      // Sync relations
      await prismaAdapter.vehiclesOnGeofences.deleteMany({
        where: { vehicleId: vehicleId },
      });

      if (geofenceIds.length > 0) {
        await prismaAdapter.vehiclesOnGeofences.createMany({
          data: geofenceIds.map((gId: string) => ({
            vehicleId: vehicleId,
            geofenceId: gId,
          })),
        });
      }
    }

    return vehicle;
  },
  'DB-Call:Vehicle',
  'Update Vehicle'
);

const deleteVehicleDb = catchService(
  async (vehicleId: string) => {
    // Explicitly delete relations first
    await prismaAdapter.vehiclesOnGeofences.deleteMany({
      where: { vehicleId: vehicleId },
    });

    return await prismaAdapter.vehicleInfo.delete({
      where: {
        id: vehicleId,
      },
    });
  },
  'DB-Call:Vehicle',
  'Delete Vehicle'
);

const findVehicleByIdDb = catchService(
  async (vehicleId: string) => {
    return await prismaAdapter.vehicleInfo.findFirst({
      where: {
        id: vehicleId,
      },
      include: {
        geofences: {
          include: {
            geofence: true,
          },
        },
      },
    });
  },
  'DB-Call:Vehicle',
  'Find Vehicle By Id'
);

const findVehiclesDb = catchService(
  async (filters: { customerId?: string; imei?: string; vechicleNumb?: string; page?: number; limit?: number }) => {
    const { customerId, imei, vechicleNumb, page = 1, limit = 10 } = filters;

    return await prismaAdapter.vehicleInfo.findMany({
      where: {
        customerId,
        imei,
        vechicleNumb,
      },
      include: {
        geofences: {
          include: {
            geofence: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  },
  'DB-Call:Vehicle',
  'Find Vehicles'
);

export { createVehicleDb, updateVehicleDb, deleteVehicleDb, findVehicleByIdDb, findVehiclesDb };
