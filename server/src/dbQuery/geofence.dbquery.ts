import { prismaAdapter } from './dbInit.ts';
import {
  CreateGeofenceInput,
  UpdateGeofenceInput,
  FindGeofenceQueryInput,
  GeofenceIdParam,
} from '../dto/geofence.dto.ts';
import { catchService } from '../utils/utilHandler.ts';
import crypto from 'crypto';

//this function is creaeted to reduce
//the duplication of geo fence
//so user can re-use it
const hashGeofence = (zone: object) => {
  const normalized = JSON.stringify(zone, Object.keys(zone).sort());
  return crypto.createHash('md5').update(normalized).digest('hex');
};

const createGeofenceDb = catchService(
  async (data: any) => {
    const { vehicleIds, name, zone, isActive } = data;
    const zoneHash = hashGeofence(zone);

    return await prismaAdapter.$transaction(async (tx) => {
      const existing = await tx.geofence.findFirst({
        where: { zoneHash },
      });

      //check has in db and find that geoFence data in it
        if (existing) {
          if (vehicleIds && vehicleIds.length > 0) {
            await tx.vehiclesOnGeofences.createMany({
              data: vehicleIds.map((vId: string) => ({
                vehicleId: vId,
                geofenceId: existing.id,
              })),
              skipDuplicates: true,
            });
          }
          return existing;
        }

      //create new geo fence in case it's not in db
      const geofence = await tx.geofence.create({
        data: {
          name,
          zoneHash,
          isActive,
        },
      });

      if (vehicleIds && vehicleIds.length > 0) {
        await tx.vehiclesOnGeofences.createMany({
          data: vehicleIds.map((vId: string) => ({
            vehicleId: vId,
            geofenceId: geofence.id,
          })),
        });
      }

      //calling raw query as prism dosen't support it
      //this calling of raw query updateds the zone data
      //in geo fence table , and uses geofence to get id of it
      //so it can store data propley
      await tx.$executeRaw`
            UPDATE "Geofence" 
            SET "zone" = ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(zone)}), 4326)
            WHERE "id" = ${geofence.id}::uuid
        `;

      return geofence;
    });
  },
  'DB-Call Geo',
  'creating GeoFence'
);

const updateGeofenceDb = catchService(
  async (geofenceId: string, data: any) => {
    const { vehicleIds, name, zone, isActive } = data;

    return await prismaAdapter.$transaction(async (tx) => {
      const geofence = await tx.geofence.update({
        where: { id: geofenceId },
        data: {
          name,
          isActive,
          zoneHash: zone ? hashGeofence(zone) : undefined,
        },
      });

      if (zone) {
        await tx.$executeRaw`
                UPDATE "Geofence" 
                SET "zone" = ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(zone)}), 4326)
                WHERE "id" = ${geofenceId}::uuid
            `;
      }

      if (vehicleIds) {
        await tx.vehiclesOnGeofences.deleteMany({
          where: { geofenceId },
        });

        if (vehicleIds.length > 0) {
          await tx.vehiclesOnGeofences.createMany({
            data: vehicleIds.map((vId: string) => ({
              vehicleId: vId,
              geofenceId,
            })),
          });
        }
      }

      return geofence;
    });
  },
  'DB-Call Geo',
  'updating GeoFence'
);

const findGeofenceByIdDb = catchService(
  async (geofenceId: string) => {
    return await prismaAdapter.geofence.findFirst({
      where: { id: geofenceId },
      include: {
        vehicles: {
          include: {
            vehicle: true,
          },
        },
      },
    });
  },
  'DB-Call Geo',
  'finding GeoFence with Id'
);

const findAllGeofenceDb = catchService(
  async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    return await prismaAdapter.geofence.findMany({
      skip,
      take: limit,
      include: {
        vehicles: {
          include: {
            vehicle: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
  'DB-Call Geo',
  'finding all GeoFences'
);

const checkWithInGeofenceDb = catchService(
  async (imei: string, lat: number, lng: number) => {
    const result = await prismaAdapter.$queryRaw<
      {
        geoId: string;
        name: string;
        isInside: boolean;
      }[]
    >`
        SELECT 
            g.id as "geoId",
            g.name as "name",
            ST_Contains(
                g.zone,
                ST_SetSRID(ST_MakePoint(${Number(lng)}, ${Number(lat)}), 4326)
            ) AS "isInside"
        FROM "Geofence" g 
        INNER JOIN "VehiclesOnGeofences" vg ON vg."geofenceId" = g.id
        INNER JOIN "VehicleInfo" v ON v.id = vg."vehicleId"
        WHERE v.imei = ${imei}
        AND g."isActive" = true 
        AND g.zone IS NOT NULL
    `;

    return result.filter((fence) => fence.isInside);
  },
  'DB-Call Geo',
  'checking in GeoFence'
);

export {
  createGeofenceDb,
  findAllGeofenceDb,
  findGeofenceByIdDb,
  checkWithInGeofenceDb,
  updateGeofenceDb,
  hashGeofence,
};
