import { prismaAdapter } from './dbInit.ts';
import {
  CreateGeofenceInput,
  UpdateGeofenceInput,
  FindGeofenceQueryInput,
  GeofenceIdParam,
} from '../dto/geofence.dto.ts';
import { catchService } from '../utils/utilHandler.ts';
import { vehicleCache } from '../services/tracker/vehicleCache.ts';
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

    // Transaction: pure DB work only, no side effects
    const { geofence, linkedVehicles } = await prismaAdapter.$transaction(async (tx: any) => {
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
          // Fetch linked vehicles for post-tx audit
          const vList = vehicleIds?.length > 0
            ? await tx.vehicleInfo.findMany({ where: { id: { in: vehicleIds } }, select: { imei: true } })
            : [];
          return { geofence: existing, linkedVehicles: vList };
        }

      const geofence = await tx.geofence.create({
        data: { name, zoneHash, isActive },
      });

      if (vehicleIds && vehicleIds.length > 0) {
        await tx.vehiclesOnGeofences.createMany({
          data: vehicleIds.map((vId: string) => ({
            vehicleId: vId,
            geofenceId: geofence.id,
          })),
        });
      }

      await tx.$executeRaw`
            UPDATE "Geofence" 
            SET "zone" = ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(zone)}), 4326)
            WHERE "id" = ${geofence.id}::uuid
        `;

      // Fetch linked vehicles for post-tx audit
      const vList = vehicleIds?.length > 0
        ? await tx.vehicleInfo.findMany({ where: { id: { in: vehicleIds } }, select: { imei: true } })
        : [];

      return { geofence, linkedVehicles: vList };
    });

    // Post-transaction: lightweight cache sync (no DB connection held)
    for (const v of linkedVehicles) {
      vehicleCache.forceAudit(v.imei);
    }

    return geofence;
  },
  'DB-Call Geo',
  'creating GeoFence'
);


const updateGeofenceDb = catchService(
  async (geofenceId: string, data: any) => {
    const { vehicleIds, name, zone, isActive } = data;

    const { geofence, linkedVehicles } = await prismaAdapter.$transaction(async (tx: any) => {
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

      // Fetch linked vehicles for post-tx audit
      const vList = vehicleIds?.length > 0
        ? await tx.vehicleInfo.findMany({ where: { id: { in: vehicleIds } }, select: { imei: true } })
        : [];

      return { geofence, linkedVehicles: vList };
    });

    // Post-transaction: lightweight cache sync (no DB connection held)
    for (const v of linkedVehicles) {
      vehicleCache.forceAudit(v.imei);
    }

    return geofence;
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
    // Return ALL geofences assigned to this vehicle with their current 'isInside' status
    const result = await prismaAdapter.$queryRaw<
      {
        geoId: string;
        name: string;
        isInside: boolean;
        isActive: boolean;
      }[]
    >`
        SELECT 
            g.id as "geoId",
            g.name as "name",
            g."isActive" as "isActive",
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

    return result;
  },
  'DB-Call Geo',
  'checking in GeoFence'
);

const GEOFENCE_BATCH_CHUNK_SIZE = 1000;

const checkWithInGeofenceBatchDb = catchService(
  async (points: { imei: string; lat: number; lng: number }[]) => {
    if (points.length === 0) return [];

    // Chunk large batches to avoid PostgreSQL query timeouts
    if (points.length > GEOFENCE_BATCH_CHUNK_SIZE) {
      const allResults: any[] = [];
      for (let i = 0; i < points.length; i += GEOFENCE_BATCH_CHUNK_SIZE) {
        const chunk = points.slice(i, i + GEOFENCE_BATCH_CHUNK_SIZE);
        const chunkResults = await prismaAdapter.$queryRaw<
          {
            imei: string;
            geoId: string;
            name: string;
            isInside: boolean;
            isActive: boolean;
          }[]
        >`
            SELECT 
                pts.imei,
                g.id as "geoId",
                g.name as "name",
                g."isActive" as "isActive",
                ST_Contains(
                    g.zone,
                    ST_SetSRID(ST_MakePoint(pts.lng::float, pts.lat::float), 4326)
                ) AS "isInside"
            FROM json_to_recordset(${JSON.stringify(chunk)}::json) as pts(imei text, lat float, lng float)
            INNER JOIN "VehicleInfo" v ON v.imei = pts.imei
            INNER JOIN "VehiclesOnGeofences" vg ON vg."vehicleId" = v.id
            INNER JOIN "Geofence" g ON g.id = vg."geofenceId"
            WHERE g."isActive" = true 
            AND g.zone IS NOT NULL
        `;
        allResults.push(...chunkResults);
      }
      return allResults;
    }

    // Small batch — single query
    const result = await prismaAdapter.$queryRaw<
      {
        imei: string;
        geoId: string;
        name: string;
        isInside: boolean;
        isActive: boolean;
      }[]
    >`
        SELECT 
            pts.imei,
            g.id as "geoId",
            g.name as "name",
            g."isActive" as "isActive",
            ST_Contains(
                g.zone,
                ST_SetSRID(ST_MakePoint(pts.lng::float, pts.lat::float), 4326)
            ) AS "isInside"
        FROM json_to_recordset(${JSON.stringify(points)}::json) as pts(imei text, lat float, lng float)
        INNER JOIN "VehicleInfo" v ON v.imei = pts.imei
        INNER JOIN "VehiclesOnGeofences" vg ON vg."vehicleId" = v.id
        INNER JOIN "Geofence" g ON g.id = vg."geofenceId"
        WHERE g."isActive" = true 
        AND g.zone IS NOT NULL
    `;

    return result;
  },
  'DB-Call Geo',
  'checking in GeoFence Batch'
);


const deleteGeofenceDb = catchService(
  async (geofenceId: string) => {
    return await prismaAdapter.$transaction(async (tx: any) => {
      // Check how many vehicles are linked to this geofence
      const linkedCount = await tx.vehiclesOnGeofences.count({
        where: { geofenceId },
      });

      if (linkedCount > 1) {
        throw new Error(`Cannot delete: this geofence is linked to ${linkedCount} vehicles. Please edit the geofence and unlink vehicles first.`);
      }

      // CASCADE in schema handles VehiclesOnGeofences cleanup automatically
      return await tx.geofence.delete({
        where: { id: geofenceId },
      });
    });
  },
  'DB-Call Geo',
  'deleting GeoFence'
);

export {
  createGeofenceDb,
  findAllGeofenceDb,
  findGeofenceByIdDb,
  checkWithInGeofenceDb,
  checkWithInGeofenceBatchDb,
  updateGeofenceDb,
  deleteGeofenceDb,
  hashGeofence,
};
