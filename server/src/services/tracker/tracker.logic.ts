import logger from '../logger/logger.ts';
import { createLocationLogDb, createLocationLogsBatchDb } from '../../dbQuery/location.dbquery.ts';
import { checkWithInGeofenceDb, checkWithInGeofenceBatchDb } from '../../dbQuery/geofence.dbquery.ts';
import { wsService } from '../websocket/socket.ts';
import { vehicleCache } from './vehicleCache.ts';

export interface TrackerPayload {
  imei: string;
  lat: number;
  lng: number;
  speed?: number;
  altitude?: number;
  heading?: number;
  ignition?: boolean;
  timestamp?: Date;
}

export type MotionStatus = 'moving' | 'idle' | 'stopped' | 'offline';


export interface NormalizedTrackerResponse {
  location: any;
  geofences: any[];
  status: 'NORMAL' | 'ALERT';
  motionStatus: MotionStatus;
}

/**
 * Lightweight Live Broadcast (Used by TCP server for immediate UI updates)
 * Performs spatial-optimized geofence checks (every 500m)
 */
export const processLiveUpdate = async (data: TrackerPayload): Promise<void> => {
  const { imei, lat, lng, timestamp = new Date() } = data;

  try {
    const lastAudit = vehicleCache.getAuditState(imei);
    const needsAudit = vehicleCache.shouldAudit(imei, lat, lng);

    let isBreached = lastAudit?.status === 'ALERT';
    let allAssignedFences: any[] = [];
    let insideFences: any[] = [];

    if (needsAudit) {
      allAssignedFences = await checkWithInGeofenceDb(imei, lat, lng);
      insideFences = allAssignedFences.filter(f => f.isInside);
      isBreached = allAssignedFences.length > 0 && insideFences.length === 0;

      vehicleCache.updateAuditState(imei, lat, lng, isBreached ? 'ALERT' : 'NORMAL');

      if (allAssignedFences.length > 0) {
        logger.debug(`[geofence-audit] ${imei} | breach: ${isBreached}`);
      }
    }

    const speed = Number(data.speed || 0);
    const hasIgnition = !!data.ignition;
    let motionStatus: MotionStatus = 'stopped';

    if (speed > 3) {
      motionStatus = 'moving';
    } else if (hasIgnition) {
      motionStatus = 'idle';
    }

    const result: NormalizedTrackerResponse = {
      location: {
        imei,
        lat: Number(lat),
        lng: Number(lng),
        speed: Number(speed),
        ignition: hasIgnition,
        timestamp: timestamp.toISOString()
      },
      geofences: insideFences,
      status: isBreached ? 'ALERT' : 'NORMAL',
      motionStatus
    };

    // 2. Immediate Broadcast
    wsService.broadcast('tracker:live', result, imei, lat, lng, isBreached);

    if (isBreached && needsAudit && vehicleCache.shouldNotify(imei)) {
      wsService.broadcast('geofence:breach', {
        imei,
        action: 'exited',
        geofence: { name: allAssignedFences.map(f => f.name).join(', ') },
        timestamp: timestamp.toISOString(),
      }, imei);
      vehicleCache.markNotified(imei);
    }
  } catch (err) {
    logger.error(`[tracker-live] broadcast failure: ${err}`);
  }
};

/**
 * Full Pipeline (Used by Buffer Flush for persistence)
 */
export const processTrackerUpdate = async (data: TrackerPayload): Promise<NormalizedTrackerResponse> => {
  const { imei, lat, lng, timestamp = new Date() } = data;

  try {
    // 1. Persistence
    const locationLog = await createLocationLogDb({
      imei,
      lat,
      lng,
      speed: data.speed,
      ignition: data.ignition,
      altitude: data.altitude,
      heading: data.heading,
      timestamp
    });

    // 2. Spatial Optimized Geofence Audit
    const lastAudit = vehicleCache.getAuditState(imei);
    const needsAudit = vehicleCache.shouldAudit(imei, lat, lng);

    let isBreached = lastAudit?.status === 'ALERT';
    let allAssignedFences: any[] = [];
    let insideFences: any[] = [];

    if (needsAudit) {
      allAssignedFences = await checkWithInGeofenceDb(imei, lat, lng);
      insideFences = allAssignedFences.filter(f => f.isInside);
      isBreached = allAssignedFences.length > 0 && insideFences.length === 0;

      vehicleCache.updateAuditState(imei, lat, lng, isBreached ? 'ALERT' : 'NORMAL');
    }

    const speed = Number(data.speed || 0);
    const hasIgnition = !!data.ignition;
    let motionStatus: MotionStatus = 'stopped';

    if (speed > 3) {
      motionStatus = 'moving';
    } else if (hasIgnition) {
      motionStatus = 'idle';
    }

    // 3. Normalization
    const result: NormalizedTrackerResponse = {
      location: {
        imei: locationLog.imei,
        lat: Number(locationLog.lat),
        lng: Number(locationLog.lng),
        speed: Number(locationLog.speed || 0),
        ignition: locationLog.ignition,
        timestamp: locationLog.timestamp,
        altitude: locationLog.altitude ? Number(locationLog.altitude) : undefined,
        heading: locationLog.heading ? Number(locationLog.heading) : undefined
      },
      geofences: insideFences,
      status: isBreached ? 'ALERT' : 'NORMAL',
      motionStatus
    };

    // 4. Persistence-triggered broadcasting
    wsService.broadcast('tracker:live', result, imei, Number(locationLog.lat), Number(locationLog.lng), isBreached);

    if (isBreached && needsAudit && vehicleCache.shouldNotify(imei)) {
      wsService.broadcast('geofence:breach', {
        imei,
        action: 'exited',
        geofence: { name: allAssignedFences.map(f => f.name).join(', ') },
        timestamp: timestamp.toISOString(),
      }, imei);
      vehicleCache.markNotified(imei);
    }

    return result;
  } catch (error: any) {
    logger.error(`[tracker-logic] persistence pipeline failure: ${error.message}`);
    throw error;
  }
};

/**
 * Massive Vectorized Batch Pipeline (Used by TCP Buffer Flush for extreme performance)
 * Converts thousands of SQL commands into 2 lightning-fast operations.
 */
export const processTrackerUpdateBatch = async (updates: TrackerPayload[]): Promise<void> => {
  if (updates.length === 0) return;

  try {
    // 1. Vectorized Persistence (Single Mongo/Postgres Insert Block)
    await createLocationLogsBatchDb(
      updates.map(data => ({
        imei: data.imei,
        lat: data.lat,
        lng: data.lng,
        speed: data.speed,
        ignition: data.ignition,
        altitude: data.altitude,
        heading: data.heading,
        timestamp: data.timestamp || new Date()
      }))
    );

    // 2. Vectorized Geofence Audit Preparation
    const auditPoints: { imei: string; lat: number; lng: number }[] = [];
    const needsAuditMap = new Map<string, boolean>();

    for (const data of updates) {
      const needsAudit = vehicleCache.shouldAudit(data.imei, data.lat, data.lng);
      needsAuditMap.set(data.imei, needsAudit);
      if (needsAudit) {
        auditPoints.push({
          imei: data.imei,
          lat: Number(data.lat),
          lng: Number(data.lng)
        });
      }
    }

    // 3. Single-Connection PostGIS Execution
    let batchGeoResults: any[] = [];
    if (auditPoints.length > 0) {
      batchGeoResults = await checkWithInGeofenceBatchDb(auditPoints);
    }

    // 4. Memory-Map Results mapping each IMEI to its assigned geofences
    const geoMap = new Map<string, any[]>();
    for (const r of batchGeoResults) {
      if (!geoMap.has(r.imei)) geoMap.set(r.imei, []);
      geoMap.get(r.imei)?.push(r);
    }

    // 5. Finalize, update caches, and queue WebSocket broadcasts
    for (const data of updates) {
      const { imei, lat, lng, timestamp = new Date() } = data;
      const needsAudit = needsAuditMap.get(imei);
      const lastAudit = vehicleCache.getAuditState(imei);

      let isBreached = lastAudit?.status === 'ALERT';
      let allAssignedFences: any[] = [];
      let insideFences: any[] = [];

      if (needsAudit && geoMap.has(imei)) {
        allAssignedFences = geoMap.get(imei) || [];
        insideFences = allAssignedFences.filter(f => f.isInside);
        isBreached = allAssignedFences.length > 0 && insideFences.length === 0;

        vehicleCache.updateAuditState(imei, lat, lng, isBreached ? 'ALERT' : 'NORMAL');
      } else if (needsAudit && !geoMap.has(imei)) {
        // If node was audited but wasn't in DB results at all, there are no geofences.
        vehicleCache.updateAuditState(imei, lat, lng, 'NORMAL');
      }

      const speed = Number(data.speed || 0);
      const hasIgnition = !!data.ignition;
      let motionStatus: MotionStatus = 'stopped';

      if (speed > 3) {
        motionStatus = 'moving';
      } else if (hasIgnition) {
        motionStatus = 'idle';
      }

      const result: NormalizedTrackerResponse = {
        location: {
          imei,
          lat: Number(lat),
          lng: Number(lng),
          speed,
          ignition: hasIgnition,
          timestamp: timestamp.toISOString(),
          altitude: data.altitude ? Number(data.altitude) : undefined,
          heading: data.heading ? Number(data.heading) : undefined
        },
        geofences: insideFences,
        status: isBreached ? 'ALERT' : 'NORMAL',
        motionStatus
      };

      // Broadcast triggers WebSocket buffers natively
      wsService.broadcast('tracker:live', result, imei, Number(lat), Number(lng), isBreached);

      if (isBreached && needsAudit && vehicleCache.shouldNotify(imei)) {
        wsService.broadcast('geofence:breach', {
          imei,
          action: 'exited',
          geofence: { name: allAssignedFences.map(f => f.name).join(', ') },
          timestamp: timestamp.toISOString(),
        }, imei);
        vehicleCache.markNotified(imei);
      }
    }

  } catch (error: any) {
    logger.error(`[tracker-logic] mass batch pipeline failure: ${error.message}`);
    throw error;
  }
};
