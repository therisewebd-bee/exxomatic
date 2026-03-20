import { WebSocketServer } from 'ws';
import { Server } from 'http';
import logger from '../logger/logger.ts';
import { SocketResponse, SocketEvent } from '../../utils/socketResponse.utils.ts';
import { connectionManager, AuthenticatedSocket } from './connectionManager.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public init(server: Server): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', async (ws: AuthenticatedSocket, req) => {
      logger.info('[ws] new connection attempt');

      const url = new URL(req.url || '', `http://${req.headers.host}`);
      let token = url.searchParams.get('token');
      
      if (!token || token === 'undefined' || token === 'null') {
        token = this.extractTokenFromCookie(req.headers.cookie);
      }

      if (!token || token === 'undefined' || token === 'null') {
        logger.warn('[ws] connection rejected: no token');
        ws.close(1008, 'Authentication required');
        return;
      }

      const isAuthenticated = await connectionManager.authenticate(ws, token);
      if (!isAuthenticated) {
        ws.close(1008, 'Invalid token');
        return;
      }

      // Fetch Priority IMEIs (First 30 authorized)
      if (ws.identity) {
        try {
          const priorityVehicles = await prismaAdapter.vehicleInfo.findMany({
            where: ws.identity.role === 'Customer' ? { customerId: ws.identity.id } : {},
            select: { imei: true },
            take: 30,
            orderBy: { createdAt: 'asc' }
          });
          connectionManager.setPriorityImeis(ws, priorityVehicles.map(v => v.imei));
        } catch (e) {
          logger.error(`[ws] failed to fetch priority imeis: ${e}`);
        }
      }

      ws.on('message', (message: string) => {
        try {
          const parsed = JSON.parse(message);
          if (parsed.type === 'map:viewport' && parsed.data) {
            connectionManager.setViewport(ws, parsed.data);
            logger.debug(`[ws] viewport updated for ${ws.identity?.email}`);
          }
        } catch (e) {
          logger.warn(`[ws] invalid message: ${message}`);
        }
      });

      ws.on('close', () => {
        logger.info('[ws] client disconnected');
        connectionManager.removeClient(ws);
      });

      ws.on('error', (error) => {
        logger.error(`[ws] error: ${error.message}`);
      });

      this.sendToClient(ws, SocketResponse.format('welcome', { message: 'Connected to live fleet tracker' }));
    });

    logger.info('[ws] server initialized with secure management');
  }

  public broadcast<T>(event: string, data: T, imei?: string, lat?: number, lng?: number, isAlert: boolean = false): void {
    const filterLat = (event === 'tracker:live' && !isAlert) ? lat : undefined;
    const filterLng = (event === 'tracker:live' && !isAlert) ? lng : undefined;

    const clients = connectionManager.getAuthorizedClients(imei, filterLat, filterLng, isAlert);
    const message = JSON.stringify(SocketResponse.format(event, data));
    
    clients.forEach((client) => {
      if (client.readyState === 1) { // ws.OPEN
        client.send(message);
      }
    });
  }

  public sendToClient<T>(ws: AuthenticatedSocket, event: SocketEvent<T>): void {
    if (ws.readyState === 1) { // ws.OPEN
      ws.send(JSON.stringify(event));
    }
  }

  private extractTokenFromCookie(cookie?: string): string | null {
    if (!cookie) return null;
    const match = cookie.match(/fleet_token=([^;]+)/);
    return match ? match[1] : null;
  }
}

export const wsService = WebSocketService.getInstance();
