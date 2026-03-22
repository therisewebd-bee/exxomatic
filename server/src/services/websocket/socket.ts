import { WebSocketServer } from 'ws';
import { Server } from 'http';
import logger from '../logger/logger.ts';
import { SocketResponse, SocketEvent } from '../../utils/socketResponse.utils.ts';
import { connectionManager, AuthenticatedSocket } from './connectionManager.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';
import { config } from '../../config/config.ts';

class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer | null = null;

  // High-Performance Grid-Based Buffer (0.5 degree cells)
  private gridBuffer: Map<string, any[]> = new Map();
  private alertBuffer: any[] = [];
  private lastPosCache: Map<string, any> = new Map(); // LRU cache for priority loads
  private batchTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public init(server: Server): void {
    this.wss = new WebSocketServer({
      server,
      // Enable per-message compression (~60-70% bandwidth savings on JSON batches)
      perMessageDeflate: {
        zlibDeflateOptions: { level: 1 }, // Fast compression (speed over ratio)
        threshold: 1024, // Only compress messages > 1 KB
      },
    });

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

      // Optimized Priority Load: memory cache first, guarded DB fallback
      if (ws.identity) {
        try {
          const cachedUpdates: any[] = [];
          for (const [imei, update] of this.lastPosCache) {
            if (ws.identity.role === 'Admin' || ws.authorizedImeis?.has(imei)) {
              cachedUpdates.push(update);
              if (cachedUpdates.length >= 30 && ws.identity.role === 'Customer') break;
              if (cachedUpdates.length >= 200 && ws.identity.role === 'Admin') break;
            }
          }

          if (cachedUpdates.length > 0) {
            this.sendToClient(ws, SocketResponse.format('tracker:live:batch', cachedUpdates));
          }

          // Cold cache fallback — guarded for Admin to prevent full table scans
          if (cachedUpdates.length < 5) {
            const isCustomer = ws.identity.role === 'Customer';
            const queryOptions: any = {
              where: isCustomer ? { customerId: ws.identity.id } : {},
              select: { imei: true },
              orderBy: { createdAt: 'asc' as const },
              take: isCustomer ? 30 : 100, // Admin capped at 100, not unlimited
            };
            const priorityVehicles = await prismaAdapter.vehicleInfo.findMany(queryOptions);
            const priorityImeis = priorityVehicles.map((v: any) => v.imei);
            connectionManager.setPriorityImeis(ws, priorityImeis);

            const latestLogs = await prismaAdapter.locationLog.findMany({
              where: { imei: { in: priorityImeis } },
              distinct: ['imei'],
              orderBy: [{ imei: 'asc' }, { timestamp: 'desc' }],
            });

            const initialBatch = latestLogs.map((log: any) => ({
              location: {
                imei: log.imei,
                lat: Number(log.lat),
                lng: Number(log.lng),
                speed: Number(log.speed || 0),
                ignition: log.ignition,
                timestamp: log.timestamp.toISOString(),
              },
              status: 'NORMAL',
              motionStatus:
                Number(log.speed || 0) > 3 ? 'moving' : log.ignition ? 'idle' : 'stopped',
            }));

            if (initialBatch.length > 0) {
              this.sendToClient(ws, SocketResponse.format('tracker:live:batch', initialBatch));
            }
          }
        } catch (e) {
          logger.error(`[ws] priority load error: ${e}`);
        }
      }

      ws.on('message', (message: string) => {
        try {
          const parsed = JSON.parse(message);
          if (parsed.type === 'map:viewport' && parsed.data) {
            connectionManager.setViewport(ws, parsed.data);
          }
        } catch (e) {
          // Ignore malformed messages
        }
      });

      ws.on('close', () => {
        connectionManager.removeClient(ws);
      });

      ws.on('error', (error) => {
        logger.error(`[ws] error: ${error.message}`);
      });

      this.sendToClient(
        ws,
        SocketResponse.format('welcome', { message: 'Connected to live fleet tracker' })
      );
    });

    logger.info('[ws] server initialized with secure management');
    this.startBatchTimer();
  }

  private startBatchTimer(): void {
    if (this.batchTimer) return;
    this.batchTimer = setInterval(() => {
      this.flushBroadcasts();
    }, config.wsBatchInterval);
  }

  private flushBroadcasts(): void {
    if (this.gridBuffer.size === 0 && this.alertBuffer.length === 0) return;

    const allClients = connectionManager.activeClients;
    if (allClients.length === 0) {
      this.gridBuffer.clear();
      this.alertBuffer = [];
      return;
    }

    // Pre-serialize alert payload ONCE (shared across all clients)
    let alertMessage: string | null = null;
    if (this.alertBuffer.length > 0) {
      alertMessage = JSON.stringify(SocketResponse.format('tracker:live:batch', this.alertBuffer));
    }

    for (const client of allClients) {
      try {
        if (client.readyState !== 1) continue;

        if (!client.viewport) {
          // No viewport: Admin gets alerts only
          if (client.identity?.role === 'Admin' && alertMessage) {
            client.send(alertMessage);
          }
          continue;
        }

        const { minLat, maxLat, minLng, maxLng } = client.viewport;
        const clientBatch: any[] = [];

        // Spatial grid lookup
        const startLat = Math.floor(minLat * 2);
        const endLat = Math.floor(maxLat * 2);
        const startLng = Math.floor(minLng * 2);
        const endLng = Math.floor(maxLng * 2);

        for (let latIdx = startLat; latIdx <= endLat; latIdx++) {
          for (let lngIdx = startLng; lngIdx <= endLng; lngIdx++) {
            const cellKey = `${latIdx}:${lngIdx}`;
            const cellUpdates = this.gridBuffer.get(cellKey);
            if (cellUpdates) {
              for (const update of cellUpdates) {
                clientBatch.push(update);
                if (clientBatch.length > 500) break;
              }
            }
            if (clientBatch.length > 500) break;
          }
          if (clientBatch.length > 500) break;
        }

        // Merge alerts + spatial updates into one message
        if (clientBatch.length > 0 || alertMessage) {
          const finalBatch = this.alertBuffer.length > 0
            ? [...this.alertBuffer, ...clientBatch]
            : clientBatch;
          if (finalBatch.length > 0) {
            client.send(JSON.stringify(SocketResponse.format('tracker:live:batch', finalBatch)));
          }
        }
      } catch (err: any) {
        // Per-client try-catch: one bad socket can't abort the loop
        logger.warn(`[ws] send error for client: ${err.message}`);
      }
    }

    this.gridBuffer.clear();
    this.alertBuffer = [];
  }

  public broadcast<T>(
    event: string,
    data: any,
    imei?: string,
    lat?: number,
    lng?: number,
    isAlert: boolean = false
  ): void {
    // 1. LRU Cache: delete-then-reinsert to maintain recency order
    if (imei) {
      this.lastPosCache.delete(imei); // Remove old position to update insertion order
      this.lastPosCache.set(imei, data);
      if (this.lastPosCache.size > 2000) {
        // Evict LEAST recently used (first entry in Map iteration order)
        const lruKey = this.lastPosCache.keys().next().value;
        if (lruKey) this.lastPosCache.delete(lruKey);
      }
    }

    if (isAlert) {
      this.alertBuffer.push(data);
      return;
    }

    // 2. Spatial Grid Masking
    if (lat !== undefined && lng !== undefined) {
      const latIdx = Math.floor(lat * 2);
      const lngIdx = Math.floor(lng * 2);
      const cellKey = `${latIdx}:${lngIdx}`;

      if (!this.gridBuffer.has(cellKey)) {
        this.gridBuffer.set(cellKey, []);
      }
      this.gridBuffer.get(cellKey)?.push(data);
    }
  }

  public sendToClient<T>(ws: AuthenticatedSocket, event: SocketEvent<T>): void {
    if (ws.readyState === 1) {
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

