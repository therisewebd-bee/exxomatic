import { WebSocketServer } from 'ws';
import { Server } from 'http';
import logger from '../logger/logger.ts';
import { SocketResponse, SocketEvent } from '../../utils/socketResponse.utils.ts';
import { connectionManager, AuthenticatedSocket } from './connectionManager.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer | null = null;
  private broadcastBuffer: Map<string, { data: any; lat?: number; lng?: number; isAlert: boolean }> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;

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

      // Fetch Priority IMEIs (First 30 authorized) and send their last known positions
      if (ws.identity) {
        try {
          const queryOptions: any = {
            where: ws.identity.role === 'Customer' ? { customerId: ws.identity.id } : {},
            select: { imei: true },
            orderBy: { createdAt: 'asc' as const }
          };
          // Customers get 30 priority vehicles, Admins get all
          if (ws.identity.role === 'Customer') {
            queryOptions.take = 30;
          }
          const priorityVehicles = await prismaAdapter.vehicleInfo.findMany(queryOptions);
          
          const priorityImeis = priorityVehicles.map((v: any) => v.imei);
          connectionManager.setPriorityImeis(ws, priorityImeis);

          // Initial Load: Fetch latest position for all priority vehicles natively in 1 query
          const latestLogs = await prismaAdapter.locationLog.findMany({
            where: { imei: { in: priorityImeis } },
            distinct: ['imei'],
            orderBy: [{ imei: 'asc' }, { timestamp: 'desc' }]
          });

          const initialBatch = latestLogs
            .filter((log: any) => log !== null)
            .map((log: any) => ({
              location: {
                imei: log!.imei,
                lat: Number(log!.lat),
                lng: Number(log!.lng),
                speed: Number(log!.speed || 0),
                ignition: log!.ignition,
                timestamp: log!.timestamp.toISOString(),
                altitude: log!.altitude ? Number(log!.altitude) : undefined,
                heading: log!.heading ? Number(log!.heading) : undefined
              },
              status: 'NORMAL',
              motionStatus: Number(log!.speed || 0) > 3 ? 'moving' : (log!.ignition ? 'idle' : 'stopped')
            }));

          if (initialBatch.length > 0) {
            this.sendToClient(ws, SocketResponse.format('tracker:live:batch', initialBatch));
            logger.info(`[ws] sent initial batch of ${initialBatch.length} vehicles to ${ws.identity.email}`);
          }
        } catch (e) {
          logger.error(`[ws] failed to perform initial priority load: ${e}`);
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
    this.startBatchTimer();
  }

  private startBatchTimer(): void {
    if (this.batchTimer) return;
    this.batchTimer = setInterval(() => {
      this.flushBroadcasts();
    }, 250); // 250ms batching interval for snappy updates
  }

  private flushBroadcasts(): void {
    if (this.broadcastBuffer.size === 0) return;

    // 1. Prepare batched updates
    const updates = Array.from(this.broadcastBuffer.entries());
    this.broadcastBuffer.clear();

    const allClients = connectionManager.activeClients; 
    
    for (const client of allClients) {
      if (client.readyState !== 1) continue;

      // Filter updates this specific client is interested in
      const clientBatch = updates
        .filter(([imei, meta]) => 
          connectionManager.isInterestedInUpdate(client, imei, meta.lat, meta.lng, meta.isAlert)
        )
        .map(([_, meta]) => meta.data);

      if (clientBatch.length > 0) {
        client.send(JSON.stringify(SocketResponse.format('tracker:live:batch', clientBatch)));
      }
    }
  }

  public broadcast<T>(event: string, data: T, imei?: string, lat?: number, lng?: number, isAlert: boolean = false): void {
    if ((event === 'tracker:live' || event === 'tracker:unknown') && !isAlert) {
      // Buffer standard updates (99% of traffic)
      this.broadcastBuffer.set(imei || `unknown_${Date.now()}`, { data: { ...data, batchEvent: event }, lat, lng, isAlert });
      return;
    }

    // Immediate broadcast for alerts and other events
    const filterLat = (event === 'tracker:live') ? lat : undefined;
    const filterLng = (event === 'tracker:live') ? lng : undefined;

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
