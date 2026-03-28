import logger from '../logger/logger.ts';
import { config } from '../../config/config.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

/**
 * Cloudflare Email Worker Alert Service
 * Fires geofence breach alert emails by POSTing to the deployed Cloudflare Worker.
 * The Worker queues the email into its D1 database and delivers via SMTP on a cron cycle.
 */

interface GeofenceBreachAlertPayload {
  imei: string;
  geofenceName: string;
  lat: number;
  lng: number;
  timestamp: string;
}

/**
 * Resolve the owner (Customer) email for a given vehicle IMEI.
 * Returns null if vehicle is unassigned or owner not found.
 */
async function resolveOwnerEmail(imei: string): Promise<{ email: string; name: string } | null> {
  try {
    const vehicle = await prismaAdapter.vehicleInfo.findFirst({
      where: { imei },
      select: { customerId: true, vechicleNumb: true },
    });

    if (!vehicle?.customerId) return null;

    const owner = await prismaAdapter.user.findUnique({
      where: { id: vehicle.customerId },
      select: { email: true, name: true },
    });

    return owner ? { email: owner.email, name: owner.name || 'Customer' } : null;
  } catch (err) {
    logger.error(`[email-alert] failed to resolve owner for IMEI ${imei}: ${err}`);
    return null;
  }
}

/**
 * Send a geofence breach alert email via the Cloudflare Email Worker.
 * This is fire-and-forget — it will not block the tracker pipeline.
 */
export async function sendGeofenceBreachEmail(payload: GeofenceBreachAlertPayload): Promise<void> {
  const workerUrl = config.emailWorkerUrl;
  if (!workerUrl) {
    logger.debug('[email-alert] EMAIL_WORKER_URL not configured, skipping geofence email');
    return;
  }

  try {
    const owner = await resolveOwnerEmail(payload.imei);
    if (!owner) {
      logger.debug(`[email-alert] no owner found for IMEI ${payload.imei}, skipping email`);
      return;
    }

    const mapsLink = `https://www.google.com/maps?q=${payload.lat},${payload.lng}`;
    const timeStr = new Date(payload.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const emailPayload = {
      to: owner.email,
      subject: `⚠️ Geofence Alert: Vehicle ${payload.imei} has left ${payload.geofenceName}`,
      templateName: 'geofence_breach',
      templateData: {
        user: { name: owner.name },
        vehicle: { imei: payload.imei },
        geofence: { name: payload.geofenceName },
        location: {
          lat: payload.lat,
          lng: payload.lng,
          mapsLink,
          timestamp: timeStr,
        },
      },
    };

    const response = await fetch(`${workerUrl}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      logger.warn(`[email-alert] worker responded with ${response.status}: ${errBody}`);
    } else {
      logger.info(`[email-alert] geofence breach email queued for ${owner.email} (IMEI: ${payload.imei})`);
    }
  } catch (err) {
    // Fire-and-forget: never throw to prevent blocking the tracker pipeline
    logger.error(`[email-alert] failed to send breach email: ${err}`);
  }
}
