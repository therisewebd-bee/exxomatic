import logger from '../logger/logger.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

interface AuditState {
  lat: number;
  lng: number;
  status: 'NORMAL' | 'ALERT';
  timestamp: number;
  lastNotificationTime?: number;
}

class VehicleCache {
  private static instance: VehicleCache;
  private registeredImeis: Set<string> = new Set();
  private auditStates: Map<string, AuditState> = new Map();
  private loaded: boolean = false;

  private constructor() {}

  public static getInstance(): VehicleCache {
    if (!VehicleCache.instance) {
      VehicleCache.instance = new VehicleCache();
    }
    return VehicleCache.instance;
  }

  public async init(): Promise<void> {
    try {
      const vehicles = await prismaAdapter.vehicleInfo.findMany({ select: { imei: true } });
      this.registeredImeis = new Set(vehicles.map(v => v.imei));
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
   * Determine if a geofence audit is required based on distance (1km) AND time (5m)
   * The first ping after server start always triggers an audit ("comes alive")
   */
  public shouldAudit(imei: string, lat: number, lng: number): boolean {
    const last = this.auditStates.get(imei);
    if (!last) return true; // Initial audit when vehicle "comes alive"
    
    const now = Date.now();
    const timeSinceLastAudit = now - last.timestamp;
    const minInterval = 5 * 60 * 1000; // 5 minutes throttle

    // If it's been less than 5 minutes since the last audit, we suppress unless it's critical
    if (timeSinceLastAudit < minInterval) {
        return false;
    }

    // Check distance from last AUDIT location
    const dist = this.calculateDistance(last.lat, last.lng, lat, lng);
    return dist > 1.0; // 1.0 km threshold
  }

  /**
   * Determine if a breach notification should be sent (Debounce 30 mins)
   */
  public shouldNotify(imei: string): boolean {
    const last = this.auditStates.get(imei);
    if (!last || last.status === 'NORMAL') return true; // Notify on first transition to ALERT

    const now = Date.now();
    const lastNotify = last.lastNotificationTime || 0;
    const cooldown = 30 * 60 * 1000; // 30 minutes

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
      lastNotificationTime: status === 'ALERT' ? (existing?.lastNotificationTime || 0) : 0
    });
  }

  public markNotified(imei: string): void {
    const existing = this.auditStates.get(imei);
    if (existing) {
      existing.lastNotificationTime = Date.now();
      this.auditStates.set(imei, existing);
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Forces a geofence audit on the next incoming ping for this vehicle.
   * Useful when geofence assignments change.
   */
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
