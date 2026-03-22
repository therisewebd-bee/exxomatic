import { prismaAdapter } from './dbInit.ts';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  FindVehicleQueryInput,
  VehicleIdParam,
} from '../dto/vehicle.dto.ts';
import { catchService } from '../utils/utilHandler.ts';
import { vehicleCache } from '../services/tracker/vehicleCache.ts';



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

    // Sync cache
    vehicleCache.addVehicle(vehicle.imei);
    
    // If geofences assigned, force an audit on the very first GPS ping
    if (geofenceIds && geofenceIds.length > 0) {
      vehicleCache.forceAudit(vehicle.imei);
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

    // Sync cache: force audit on next ping to pick up geofence changes
    vehicleCache.forceAudit(vehicle.imei);

    return vehicle;
  },
  'DB-Call:Vehicle',
  'Update Vehicle'
);

const deleteVehicleDb = catchService(
  async (vehicleId: string) => {
    return await prismaAdapter.$transaction(async (tx: any) => {
      // 1. Fetch vehicle to get the IMEI (needed for LocationLog lookup)
      const vehicle = await tx.vehicleInfo.findUnique({
        where: { id: vehicleId },
        select: { imei: true },
      });

      if (!vehicle) return null;

      // 2. Delete related LocationLogs (linked by IMEI)
      await tx.locationLog.deleteMany({
        where: { imei: vehicle.imei },
      });

      // 3. Delete related Compliance records (linked by vehicleId)
      await tx.vehicleCompliance.deleteMany({
        where: { vehicleId: vehicleId },
      });

      // 4. Delete Geofence relations (linked by vehicleId)
      // Note: schema has onDelete: Cascade but we do it explicitly for safety/clarity
      await tx.vehiclesOnGeofences.deleteMany({
        where: { vehicleId: vehicleId },
      });

      // 5. Finally delete the vehicle itself
      const deleted = await tx.vehicleInfo.delete({
        where: {
          id: vehicleId,
        },
      });

      // 6. Sync cache
      vehicleCache.removeVehicle(vehicle.imei);

      return deleted;
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
    const { customerId, imei, vechicleNumb, page = 1, limit = 100 } = filters;

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
