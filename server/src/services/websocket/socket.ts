import { WebSocketServer } from 'ws';
import { Server } from 'http';
import logger from '../logger/logger.ts';
import { SocketResponse, SocketEvent } from '../../utils/socketResponse.utils.ts';
import { connectionManager, AuthenticatedSocket } from './connectionManager.ts';

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

      // Extract token from query or cookie
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      let token = url.searchParams.get('token');
      
      // Fallback to cookie if query param is empty/invalid
      if (!token || token === 'undefined' || token === 'null') {
        token = this.extractTokenFromCookie(req.headers.cookie);
      }

      // Final check against literal strings
      if (token === 'undefined' || token === 'null') {
        token = null;
      }

      if (!token) {
        logger.warn('[ws] connection rejected: no token');
        ws.close(1008, 'Authentication required');
        return;
      }

      const isAuthenticated = await connectionManager.authenticate(ws, token);
      if (!isAuthenticated) {
        ws.close(1008, 'Invalid token');
        return;
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

      // Send welcome message
      this.sendToClient(ws, SocketResponse.format('welcome', { message: 'Connected to live fleet tracker' }));
    });

    logger.info('[ws] server initialized with secure management');
  }

  /**
   * Broadcast with data isolation and spatial filtering
   * @param event Event name
   * @param data Payload
   * @param imei Mandatory for Customer isolation, optional for global broadcasts
   * @param lat Optional latitude for spatial filtering
   * @param lng Optional longitude for spatial filtering
   */
  public broadcast<T>(event: string, data: T, imei?: string, lat?: number, lng?: number): void {
    // Only apply spatial filtering to tracking updates to keep critical alerts like geofence breaches global
    const filterLat = event === 'tracker:live' ? lat : undefined;
    const filterLng = event === 'tracker:live' ? lng : undefined;

    const clients = connectionManager.getAuthorizedClients(imei, filterLat, filterLng);
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
