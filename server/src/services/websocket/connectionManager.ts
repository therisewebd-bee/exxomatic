import { WebSocket } from 'ws';
import { verifyToken } from '../../utils/auth.utils.ts';
import logger from '../logger/logger.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

interface ClientIdentity {
  id: string;
  email: string;
  role: 'Admin' | 'Customer';
}

interface Viewport {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface AuthenticatedSocket extends WebSocket {
  identity?: ClientIdentity;
  authorizedImeis?: Set<string>;
  priorityImeis?: Set<string>; // First 30 vehicles or critical ones
  viewport?: Viewport;
}

class ConnectionManager {
  private static instance: ConnectionManager;
  private clients: Set<AuthenticatedSocket> = new Set();

  private constructor() {}

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  public async authenticate(ws: AuthenticatedSocket, token: string): Promise<boolean> {
    try {
      const decoded = verifyToken(token) as ClientIdentity;
      ws.identity = decoded;

      // Fetch authorized IMEIs if Customer
      if (decoded.role === 'Customer') {
        const vehicles = await prismaAdapter.vehicleInfo.findMany({
          where: { customerId: decoded.id },
          select: { imei: true },
        });
        ws.authorizedImeis = new Set(vehicles.map((v) => v.imei));
      }

      this.clients.add(ws);
      logger.info(`[conn-manager] client authenticated: ${decoded.email} (${decoded.role})`);
      return true;
    } catch (error: any) {
      logger.warn(`[conn-manager] auth failed: ${error.message || error} | Token received: ${token.substring(0, 15)}...`);
      return false;
    }
  }

  public removeClient(ws: AuthenticatedSocket): void {
    this.clients.delete(ws);
  }

  public setPriorityImeis(ws: AuthenticatedSocket, imeis: string[]): void {
    ws.priorityImeis = new Set(imeis);
  }

  public setViewport(ws: AuthenticatedSocket, bounds: Viewport): void {
    ws.viewport = bounds;
  }

  /**
   * Get all clients authorized to see updates for a specific IMEI, optionally filtered by spatial location
   */
  public getAuthorizedClients(imei?: string, lat?: number, lng?: number, isAlert: boolean = false): AuthenticatedSocket[] {
    const authorized: AuthenticatedSocket[] = [];

    for (const client of this.clients) {
      if (!client.identity) continue;

      // 1. Check Identity/Role Authorization
      let isRoleAuthorized = false;
      if (client.identity.role === 'Admin') {
        isRoleAuthorized = true;
      } else if (imei && client.authorizedImeis?.has(imei)) {
        isRoleAuthorized = true;
      }

      if (!isRoleAuthorized) continue;

      // 2. Check Spatial (Viewport) Authorization if lat/lng are provided
      // If vehicle is in ALERT state or is a PRIORITY vehicle, we bypass spatial filtering
      const isPriority = isAlert || (imei && client.priorityImeis?.has(imei));

      if (!isPriority && lat !== undefined && lng !== undefined && client.viewport) {
        const { minLat, maxLat, minLng, maxLng } = client.viewport;
        const inViewport = lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
        
        if (!inViewport) continue;
      }

      authorized.push(client);
    }

    return authorized;
  }
}

export const connectionManager = ConnectionManager.getInstance();
export type { AuthenticatedSocket };
