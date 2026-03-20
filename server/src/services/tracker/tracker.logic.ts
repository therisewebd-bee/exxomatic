import logger from '../logger/logger.ts';
import { createLocationLogDb } from '../../dbQuery/location.dbquery.ts';
import { checkWithInGeofenceDb } from '../../dbQuery/geofence.dbquery.ts';
import { wsService } from '../websocket/socket.ts';
import { vehicleCache } from './vehicleCache.ts';

export interface TrackerPayload {
  imei: string;
  lat: number;
  lng: number;
  speed?: number;
  ignition?: boolean;
  timestamp?: Date;
}

export interface NormalizedTrackerResponse {
  location: any;
  geofences: any[];
  status: 'NORMAL' | 'ALERT';
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

    const result: NormalizedTrackerResponse = {
      location: { imei, lat, lng, speed: data.speed, ignition: data.ignition, timestamp: timestamp.toISOString() },
      geofences: insideFences,
      status: isBreached ? 'ALERT' : 'NORMAL',
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
    const locationLog = await createLocationLogDb({ imei, lat, lng, timestamp });

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

    // 3. Normalization
    const result: NormalizedTrackerResponse = {
      location: locationLog,
      geofences: insideFences,
      status: isBreached ? 'ALERT' : 'NORMAL',
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
