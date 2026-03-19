import logger from '../logger/logger.ts';
import { createLocationLogDb } from '../../dbQuery/location.dbquery.ts';
import { checkWithInGeofenceDb } from '../../dbQuery/geofence.dbquery.ts';
import { wsService } from '../websocket/socket.ts';

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
 * Normalized Pipeline for Tracker Data
 * Shared by TCP Server (after parsing) and HTTP Controllers
 */
export const processTrackerUpdate = async (data: TrackerPayload): Promise<NormalizedTrackerResponse> => {
  const { imei, lat, lng, timestamp = new Date() } = data;

  try {
    // 1. Persistence - Standardized to lat/lng as per Prisma schema
    const locationLog = await createLocationLogDb({
      imei,
      lat,
      lng,
      timestamp,
    });

    // 2. Geofence Audit
    const geofenceBreaches = await checkWithInGeofenceDb(imei, lat, lng);

    // 3. Normalization
    const result: NormalizedTrackerResponse = {
      location: locationLog,
      geofences: geofenceBreaches,
      status: geofenceBreaches.length > 0 ? 'ALERT' : 'NORMAL',
    };

    // 4. Secure Broadcasting
    // WS service handles isolation via ConnectionManager
    wsService.broadcast('tracker:update', result, imei);

    if (geofenceBreaches.length > 0) {
      wsService.broadcast('geofence:breach', {
        imei,
        breaches: geofenceBreaches,
        timestamp: timestamp.toISOString(),
      }, imei);
    }

    return result;
  } catch (error: any) {
    logger.error(`[tracker-logic] pipeline failure: ${error.message}`);
    throw error;
  }
};
