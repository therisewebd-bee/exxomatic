import logger from '../logger/logger.ts';
import { createLocationLogDb, createLocationLogsBatchDb } from '../../dbQuery/location.dbquery.ts';
import { checkWithInGeofenceDb, checkWithInGeofenceBatchDb } from '../../dbQuery/geofence.dbquery.ts';
import { wsService } from '../websocket/socket.ts';
import { vehicleCache } from './vehicleCache.ts';
import { sendGeofenceBreachEmail } from '../email/emailAlert.ts';

export interface TrackerPayload {
  imei: string;
  lat: number;
  lng: number;
  speed?: number;
  altitude?: number;
  heading?: number;
  ignition?: boolean;
  timestamp?: Date;
  [key: string]: any; // Accept extended diagnostic fields (SLU format)
}

export type MotionStatus = 'moving' | 'idle' | 'stopped' | 'offline';


export interface NormalizedTrackerResponse {
  location: any;
  geofences: any[];
  status: 'NORMAL' | 'ALERT';
  motionStatus: MotionStatus;
  diagnostics?: any; // New payload attachment for UI metrics without trashing DB schema
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

    if (speed > 2) {
      motionStatus = 'moving';
    } else if (hasIgnition) {
      motionStatus = 'idle';
    }

    const { imei: _i, lat: _la, lng: _ln, speed: _s, ignition: _ig, timestamp: _t, altitude: _a, heading: _h, ...diagnostics } = data;

    const result: NormalizedTrackerResponse = {
      location: {
        imei,
        lat: Number(lat),
        lng: Number(lng),
        speed: Number(speed),
        ignition: hasIgnition,
        timestamp: timestamp.toISOString(),
        altitude: data.altitude ? Number(data.altitude) : undefined,
        heading: data.heading ? Number(data.heading) : undefined
      },
      geofences: insideFences,
      status: isBreached ? 'ALERT' : 'NORMAL',
      motionStatus,
      diagnostics: Object.keys(diagnostics).length > 0 ? diagnostics : undefined
    };

    // 2. Immediate Broadcast
    wsService.broadcast('tracker:live', result, imei, lat, lng, isBreached);

    if (isBreached && needsAudit && vehicleCache.shouldNotify(imei)) {
      const geofenceName = allAssignedFences.map(f => f.name).join(', ');
      wsService.broadcast('geofence:breach', {
        imei,
        action: 'exited',
        geofence: { name: geofenceName },
        timestamp: timestamp.toISOString(),
      }, imei);
      vehicleCache.markNotified(imei);

      // Fire-and-forget: queue geofence breach email via Cloudflare Worker
      sendGeofenceBreachEmail({ imei, geofenceName, lat, lng, timestamp: timestamp.toISOString() }).catch(() => {});
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
      timestamp,
      // $SLU hardware diagnostics
      odometer: data.odometer,
      engine: data.engine,
      rpm: data.rpm,
      batteryVoltage: data.batteryVoltage,
      inputVoltage: data.inputVoltage,
      batteryHealth: data.batteryHealth != null ? Math.round(data.batteryHealth) : undefined,
      batteryCharge: data.batteryCharge != null ? Math.round(data.batteryCharge) : undefined,
      temperature: data.temperature,
      gpsFix: data.gpsFix != null ? Math.round(data.gpsFix) : undefined,
      digitalInput1: data.digitalInput1,
      digitalInput2: data.digitalInput2,
      digitalOutput1: data.digitalOutput1,
      totalEngineDuration: data.totalEngineDuration != null ? Math.round(data.totalEngineDuration) : undefined,
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

    if (speed > 2) {
      motionStatus = 'moving';
    } else if (hasIgnition) {
      motionStatus = 'idle';
    }

    // 3. Normalization
    const { imei: _i, lat: _la, lng: _ln, speed: _s, ignition: _ig, timestamp: _t, altitude: _a, heading: _h, ...diagnostics } = data;

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
      motionStatus,
      diagnostics: Object.keys(diagnostics).length > 0 ? diagnostics : undefined
    };

    // 4. Persistence-triggered broadcasting
    wsService.broadcast('tracker:live', result, imei, Number(locationLog.lat), Number(locationLog.lng), isBreached);

    if (isBreached && needsAudit && vehicleCache.shouldNotify(imei)) {
      const geofenceName = allAssignedFences.map(f => f.name).join(', ');
      wsService.broadcast('geofence:breach', {
        imei,
        action: 'exited',
        geofence: { name: geofenceName },
        timestamp: timestamp.toISOString(),
      }, imei);
      vehicleCache.markNotified(imei);

      // Fire-and-forget: queue geofence breach email via Cloudflare Worker
      sendGeofenceBreachEmail({ imei, geofenceName, lat: Number(locationLog.lat), lng: Number(locationLog.lng), timestamp: timestamp.toISOString() }).catch(() => {});
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
        timestamp: data.timestamp || new Date(),
        // $SLU hardware diagnostics
        odometer: data.odometer,
        engine: data.engine,
        rpm: data.rpm,
        batteryVoltage: data.batteryVoltage,
        inputVoltage: data.inputVoltage,
        batteryHealth: data.batteryHealth != null ? Math.round(data.batteryHealth) : undefined,
        batteryCharge: data.batteryCharge != null ? Math.round(data.batteryCharge) : undefined,
        temperature: data.temperature,
        gpsFix: data.gpsFix != null ? Math.round(data.gpsFix) : undefined,
        digitalInput1: data.digitalInput1,
        digitalInput2: data.digitalInput2,
        digitalOutput1: data.digitalOutput1,
        totalEngineDuration: data.totalEngineDuration != null ? Math.round(data.totalEngineDuration) : undefined,
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

      if (speed > 2) {
        motionStatus = 'moving';
      } else if (hasIgnition) {
        motionStatus = 'idle';
      }

      const { imei: _i, lat: _la, lng: _ln, speed: _s, ignition: _ig, timestamp: _t, altitude: _a, heading: _h, ...diagnostics } = data;

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
        motionStatus,
        diagnostics: Object.keys(diagnostics).length > 0 ? diagnostics : undefined
      };

      // Broadcast triggers WebSocket buffers natively
      wsService.broadcast('tracker:live', result, imei, Number(lat), Number(lng), isBreached);

      if (isBreached && needsAudit && vehicleCache.shouldNotify(imei)) {
        const geofenceName = allAssignedFences.map(f => f.name).join(', ');
        wsService.broadcast('geofence:breach', {
          imei,
          action: 'exited',
          geofence: { name: geofenceName },
          timestamp: timestamp.toISOString(),
        }, imei);
        vehicleCache.markNotified(imei);

        // Fire-and-forget: queue geofence breach email via Cloudflare Worker
        sendGeofenceBreachEmail({ imei, geofenceName, lat: Number(lat), lng: Number(lng), timestamp: timestamp.toISOString() }).catch(() => {});
      }
    }

  } catch (error: any) {
    logger.error(`[tracker-logic] mass batch pipeline failure: ${error.message}`);
    throw error;
  }
};

/**
 * Immediate Geofence Audit (Used when geofence assignments change)
 * Force-evaluates a vehicle's status against its assigned geofences
 * based on its last known position.
 */
export const performOneTimeAudit = async (imei: string, lat: number, lng: number): Promise<void> => {
  try {
    const allAssignedFences = await checkWithInGeofenceDb(imei, lat, lng);
    const insideFences = allAssignedFences.filter((f: any) => f.isInside);
    const isBreached = allAssignedFences.length > 0 && insideFences.length === 0;

    // 1. Update memory cache instantly
    vehicleCache.updateAuditState(imei, lat, lng, isBreached ? 'ALERT' : 'NORMAL');

    // 2. Broadcast to UI so the marker turns red/green immediately
    const result: NormalizedTrackerResponse = {
      location: {
        imei,
        lat: Number(lat),
        lng: Number(lng),
        timestamp: new Date().toISOString()
      },
      geofences: insideFences,
      status: isBreached ? 'ALERT' : 'NORMAL',
      motionStatus: 'stopped' // Default for stationary audits
    };

    wsService.broadcast('tracker:live', result, imei, Number(lat), Number(lng), isBreached);

    if (isBreached && vehicleCache.shouldNotify(imei)) {
      wsService.broadcast('geofence:breach', {
        imei,
        action: 'exited',
        geofence: { name: allAssignedFences.map((f: any) => f.name).join(', ') },
        timestamp: new Date().toISOString(),
      }, imei);
      vehicleCache.markNotified(imei);
    }
  } catch (err) {
    logger.error(`[one-time-audit] failure for ${imei}: ${err}`);
  }
};
