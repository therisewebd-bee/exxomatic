import logger from '../logger/logger.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

class VehicleCache {
  private static instance: VehicleCache;
  private registeredImeis: Set<string> = new Set();
  private loaded: boolean = false;

  private constructor() {}

  public static getInstance(): VehicleCache {
    if (!VehicleCache.instance) {
      VehicleCache.instance = new VehicleCache();
    }
    return VehicleCache.instance;
  }

  /**
   * Load all IMEIs from the database on startup
   */
  public async init(): Promise<void> {
    try {
      const vehicles = await prismaAdapter.vehicleInfo.findMany({
        select: { imei: true }
      });
      
      this.registeredImeis = new Set(vehicles.map(v => v.imei));
      this.loaded = true;
      logger.info(`[cache] loaded ${this.registeredImeis.size} registered vehicles into memory`);
    } catch (error: any) {
      logger.error(`[cache] failed to load vehicles: ${error.message}`);
    }
  }

  /**
   * Check if a vehicle is registered. O(1) lookup.
   */
  public isRegistered(imei: string): boolean {
    if (!this.loaded) {
      logger.warn('[cache] isRegistered called before cache was initialized');
      return false; // Fail safe
    }
    return this.registeredImeis.has(imei);
  }

  /**
   * Add a newly registered vehicle to the cache
   */
  public addVehicle(imei: string): void {
    this.registeredImeis.add(imei);
    logger.info(`[cache] added new vehicle to cache: ${imei}`);
  }

  /**
   * Remove a deleted vehicle from the cache
   */
  public removeVehicle(imei: string): void {
    this.registeredImeis.delete(imei);
    logger.info(`[cache] removed vehicle from cache: ${imei}`);
  }
}

export const vehicleCache = VehicleCache.getInstance();
