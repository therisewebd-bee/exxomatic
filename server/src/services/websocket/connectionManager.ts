import { WebSocket } from 'ws';
import { verifyToken } from '../../utils/auth.utils.js';
import logger from '../logger/logger.js';
import { prismaAdapter } from '../../dbQuery/dbInit.js';

interface ClientIdentity {
  id: string;
  email: string;
  role: 'Admin' | 'Customer';
}

interface AuthenticatedSocket extends WebSocket {
  identity?: ClientIdentity;
  authorizedImeis?: Set<string>;
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
    } catch (error) {
      logger.warn(`[conn-manager] auth failed: ${error}`);
      return false;
    }
  }

  public removeClient(ws: AuthenticatedSocket): void {
    this.clients.delete(ws);
  }

  /**
   * Get all clients authorized to see updates for a specific IMEI
   */
  public getAuthorizedClients(imei?: string): AuthenticatedSocket[] {
    const authorized: AuthenticatedSocket[] = [];

    for (const client of this.clients) {
      if (!client.identity) continue;

      // Admins see everything
      if (client.identity.role === 'Admin') {
        authorized.push(client);
        continue;
      }

      // Customers only see their own IMEIs
      if (imei && client.authorizedImeis?.has(imei)) {
        authorized.push(client);
      }
    }

    return authorized;
  }
}

export const connectionManager = ConnectionManager.getInstance();
export type { AuthenticatedSocket };
