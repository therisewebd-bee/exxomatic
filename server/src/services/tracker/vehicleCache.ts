import logger from '../logger/logger.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

interface AuditState {
  lat: number;
  lng: number;
  status: 'NORMAL' | 'ALERT';
  timestamp: number;
  lastNotificationTime?: number;
}

const MAX_AUDIT_ENTRIES = 50_000;
const AUDIT_GC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const STALE_AUDIT_AGE_MS = 30 * 60 * 1000; // 30 minutes

// ~1km in degrees at equator (conservative estimate)
const BBOX_THRESHOLD_DEG = 0.009;

class VehicleCache {
  private static instance: VehicleCache;
  private registeredImeis: Set<string> = new Set();
  private auditStates: Map<string, AuditState> = new Map();
  private loaded: boolean = false;

  private constructor() {
    // Periodic GC for auditStates — evict stale entries
    setInterval(() => this.gcAuditStates(), AUDIT_GC_INTERVAL_MS);
  }

  public static getInstance(): VehicleCache {
    if (!VehicleCache.instance) {
      VehicleCache.instance = new VehicleCache();
    }
    return VehicleCache.instance;
  }

  public async init(): Promise<void> {
    try {
      const vehicles = await prismaAdapter.vehicleInfo.findMany({ select: { imei: true } });
      this.registeredImeis = new Set(vehicles.map((v: any) => v.imei));
      this.loaded = true;
      logger.info(`[cache] loaded ${this.registeredImeis.size} vehicles`);
    } catch (error: any) {
      logger.error(`[cache] init failed: ${error.message}`);
    }
  }

  public isRegistered(imei: string): boolean {
    return this.loaded && this.registeredImeis.has(imei);
  }

  /**
   * Determine if a geofence audit is required.
   * Logic: Distance checked FIRST — if moved >1km, always audit.
   * Time throttle (5m) only applies if vehicle hasn't moved significantly.
   */
  public shouldAudit(imei: string, lat: number, lng: number): boolean {
    const last = this.auditStates.get(imei);
    if (!last) return true; // Initial audit when vehicle "comes alive"

    // Fast bounding box pre-check (avoids expensive Haversine for nearby points)
    const dLat = Math.abs(lat - last.lat);
    const dLng = Math.abs(lng - last.lng);

    if (dLat > BBOX_THRESHOLD_DEG || dLng > BBOX_THRESHOLD_DEG) {
      // Moved significantly — verify with Haversine
      const dist = this.calculateDistance(last.lat, last.lng, lat, lng);
      if (dist > 1.0) return true; // >1km movement always triggers audit
    }

    // If vehicle hasn't moved much, apply time-based throttle
    const now = Date.now();
    const timeSinceLastAudit = now - last.timestamp;
    const minInterval = 5 * 60 * 1000;
    return timeSinceLastAudit >= minInterval;
  }

  /**
   * Determine if a breach notification should be sent (Debounce 30 mins)
   */
  public shouldNotify(imei: string): boolean {
    const last = this.auditStates.get(imei);
    if (!last || last.status === 'NORMAL') return true;

    const now = Date.now();
    const lastNotify = last.lastNotificationTime || 0;
    const cooldown = 30 * 60 * 1000;

    return (now - lastNotify) > cooldown;
  }

  public getAuditState(imei: string): AuditState | undefined {
    return this.auditStates.get(imei);
  }

  public updateAuditState(imei: string, lat: number, lng: number, status: 'NORMAL' | 'ALERT'): void {
    const existing = this.auditStates.get(imei);
    this.auditStates.set(imei, { 
      lat, 
      lng, 
      status, 
      timestamp: Date.now(),
      // Preserve notification cooldown across transitions to prevent spam on brief exits
      lastNotificationTime: existing?.lastNotificationTime || 0
    });
  }

  public markNotified(imei: string): void {
    const existing = this.auditStates.get(imei);
    if (existing) {
      existing.lastNotificationTime = Date.now();
    }
  }

  /**
   * Fast bounding box + Haversine distance calculation
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Periodic GC: evict stale audit entries for unregistered or dormant vehicles
   */
  private gcAuditStates(): void {
    if (this.auditStates.size <= MAX_AUDIT_ENTRIES) return;

    const cutoff = Date.now() - STALE_AUDIT_AGE_MS;
    for (const [imei, state] of this.auditStates) {
      if (!this.registeredImeis.has(imei) || state.timestamp < cutoff) {
        this.auditStates.delete(imei);
      }
    }
    logger.debug(`[cache-gc] auditStates trimmed to ${this.auditStates.size}`);
  }

  public forceAudit(imei: string): void {
    this.auditStates.delete(imei);
  }

  public addVehicle(imei: string): void { 
    this.registeredImeis.add(imei); 
  }

  public removeVehicle(imei: string): void { 
    this.registeredImeis.delete(imei); 
    this.auditStates.delete(imei); 
  }
}

export const vehicleCache = VehicleCache.getInstance();

