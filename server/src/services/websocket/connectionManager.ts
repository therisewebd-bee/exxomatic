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
  private clients: AuthenticatedSocket[] = [];

  public get activeClients(): AuthenticatedSocket[] {
    return this.clients;
  }

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
        ws.authorizedImeis = new Set(vehicles.map((v: any) => v.imei));
      }

      this.clients.push(ws);
      logger.info(`[conn-manager] client authenticated: ${decoded.email} (${decoded.role})`);
      return true;
    } catch (error: any) {
      logger.warn(
        `[conn-manager] auth failed: ${error.message || error} | Token received: ${token.substring(0, 15)}...`
      );
      return false;
    }
  }

  public removeClient(ws: AuthenticatedSocket): void {
    const index = this.clients.indexOf(ws);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }

  public setPriorityImeis(ws: AuthenticatedSocket, imeis: string[]): void {
    ws.priorityImeis = new Set(imeis);
  }

  public setViewport(ws: AuthenticatedSocket, bounds: any): void {
    // Normalize: frontend sends {swLat, swLng, neLat, neLng}, we store as {minLat, minLng, maxLat, maxLng}
    ws.viewport = {
      minLat: bounds.minLat ?? bounds.swLat,
      minLng: bounds.minLng ?? bounds.swLng,
      maxLat: bounds.maxLat ?? bounds.neLat,
      maxLng: bounds.maxLng ?? bounds.neLng,
    };
  }

  /**
   * Get all clients authorized to see updates for a specific IMEI, optionally filtered by spatial location
   */
  public getAuthorizedClients(
    imei?: string,
    lat?: number,
    lng?: number,
    isAlert: boolean = false
  ): AuthenticatedSocket[] {
    const authorized: AuthenticatedSocket[] = [];

    for (const client of this.clients) {
      if (this.isInterestedInUpdate(client, imei, lat, lng, isAlert)) {
        authorized.push(client);
      }
    }

    return authorized;
  }

  /**
   * More efficient check for a single client and update pair
   */
  public isInterestedInUpdate(
    client: AuthenticatedSocket,
    imei?: string,
    lat?: number,
    lng?: number,
    isAlert: boolean = false
  ): boolean {
    if (!client.identity) return false;

    // 1. Check Identity/Role Authorization
    let isRoleAuthorized = false;
    if (client.identity.role === 'Admin') {
      isRoleAuthorized = true;
    } else if (imei && client.authorizedImeis?.has(imei)) {
      isRoleAuthorized = true;
    }

    if (!isRoleAuthorized) return false;

    // 2. Check Spatial (Viewport) Authorization if lat/lng are provided
    // Alerts and priority vehicles always bypass spatial filtering
    const alwaysSend = isAlert || (imei && client.priorityImeis?.has(imei));

    if (alwaysSend) return true;

    // Apply viewport filtering for ALL roles (including Admin) to handle 100K+ vehicles
    // Without this, Admin would receive every single vehicle update and crash the frontend
    if (lat !== undefined && lng !== undefined && client.viewport) {
      const { minLat, maxLat, minLng, maxLng } = client.viewport;

      // For Admin, use a 2x expanded viewport buffer to show nearby vehicles
      // For Customers, use exact viewport
      const isAdminRole = client.identity.role === 'Admin';
      const bufferLat = isAdminRole ? (maxLat - minLat) * 0.5 : 0;
      const bufferLng = isAdminRole ? (maxLng - minLng) * 0.5 : 0;

      const inViewport =
        lat >= minLat - bufferLat &&
        lat <= maxLat + bufferLat &&
        lng >= minLng - bufferLng &&
        lng <= maxLng + bufferLng;

      if (!inViewport) return false;
    }

    return true;
  }
}

export const connectionManager = ConnectionManager.getInstance();
export type { AuthenticatedSocket };
