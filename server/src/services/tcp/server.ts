import net from 'net';
import logger from '../logger/logger.ts';
import { TrackerPayload } from '../tracker/tracker.logic.ts';
import { parseRawSluData } from './dataParser.ts';
import { bufferLocationUpdate, startFlushTimer } from './buffer.ts';
import { config } from '../../config/config.ts';
import { wsService } from '../websocket/socket.ts';
import { vehicleCache } from '../tracker/vehicleCache.ts';

const unknownPings = new Map<string, number>();

const startTcpServer = async (): Promise<void> => {
  // Initialize the persistence buffer timer
  startFlushTimer();

  const server = net.createServer((socket) => {
    logger.info(`[tcp] device connected:${socket.remoteAddress}`);

    socket.on('data', async (data: Buffer) => {
      const rawData = data.toString().trim();
      
      // Handle multiple packets in a single TCP data event (newline-delimited)
      const lines = rawData.split('\n').filter(l => l.trim());
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          let payload: TrackerPayload | null = null;

          if (trimmed.startsWith('$')) {
            payload = parseRawSluData(trimmed);
          } else {
            try {
              const parsed = JSON.parse(trimmed);
              payload = {
                imei: parsed.imei,
                lat: Number(parsed.lat),
                lng: Number(parsed.lng),
                timestamp: parsed.timestamp ? new Date(parsed.timestamp) : new Date()
              };
            } catch (e) {
              logger.warn(`[tcp] invalid JSON or format: ${trimmed.substring(0, 60)}...`);
            }
          }

          if (payload) {
            if (!vehicleCache.isRegistered(payload.imei)) {
              // Unregistered device -> do not save to DB
              const now = Date.now();
              const lastPing = unknownPings.get(payload.imei) || 0;
              // Throttle WS broadcasts to max 1 every 2 seconds per IMEI
              if (now - lastPing > 2000) {
                unknownPings.set(payload.imei, now);
                wsService.broadcast('tracker:live', {
                  location: {
                    imei: payload.imei,
                    lat: payload.lat,
                    lng: payload.lng,
                    speed: payload.speed || 0,
                    ignition: payload.ignition ?? false,
                    timestamp: (payload.timestamp || new Date()).toISOString(),
                  },
                  status: 'UNKNOWN_DEVICE'
                }); // Broadcast to Admins (no imei filter = Admin-only)
              }
            } else {
              // 1. Buffer for batch DB persistence (O(1) Map overwrite per IMEI)
              bufferLocationUpdate(payload);

              // 2. Immediate lightweight WS broadcast for live dashboard
              wsService.broadcast('tracker:live', {
                location: {
                  imei: payload.imei,
                  lat: payload.lat,
                  lng: payload.lng,
                  speed: payload.speed,
                  ignition: payload.ignition,
                  timestamp: (payload.timestamp || new Date()).toISOString(),
                },
                status: 'LIVE_FEED'
              }, payload.imei);
            }
          }
        } catch (error: any) {
          logger.error(`[tcp] processing error: ${error.message}`);
        }
      }
    });

    socket.on('close', () => {
      logger.info('[tcp] device disconnected');
    });

    socket.on('error', (err) => {
      logger.error(`[tcp] error: ${err.message}`);
    });
  });

  const PORT = Number(config.tcpPort);
  server.listen(PORT, () => {
    logger.info(`[tcp] server up on port ${PORT}`);
  });
};

export default startTcpServer;
