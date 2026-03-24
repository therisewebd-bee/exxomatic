import net from 'net';
import cluster from 'cluster';
import logger from '../logger/logger.ts';
import { TrackerPayload, processLiveUpdate } from '../tracker/tracker.logic.ts';
import { parseRawSluData } from './dataParser.ts';
import { bufferLocationUpdate, startFlushTimer } from './buffer.ts';
import { config } from '../../config/config.ts';
import { wsService } from '../websocket/socket.ts';
import { vehicleCache } from '../tracker/vehicleCache.ts';

// ── Constants ────────────────────────────────────────────────────
const MAX_CONNECTIONS = 5000;
const SOCKET_TIMEOUT_MS = 120_000; // 2 minutes — kill dead GPS devices
const INITIAL_SLAB_SIZE = 64 * 1024; // 64 KB pre-allocated per socket
const MAX_SLAB_SIZE = 1024 * 1024; // 1 MB cap — destroy socket if exceeded
const MAX_INFLIGHT = 500; // Concurrency cap for processLiveUpdate promises
const UNKNOWN_PING_CAP = 10_000;
const UNKNOWN_PING_MAX_AGE_MS = 30_000; // 30s temporal eviction

// ── State ────────────────────────────────────────────────────────
const unknownPings = new Map<string, number>();
let activeConnections = 0;
let inflight = 0;

// Periodic GC for unknownPings — true temporal eviction every 60s
setInterval(() => {
  if (unknownPings.size === 0) return;
  const cutoff = Date.now() - UNKNOWN_PING_MAX_AGE_MS;
  for (const [imei, ts] of unknownPings) {
    if (ts < cutoff) unknownPings.delete(imei);
  }
}, 60_000);

const startTcpServer = async (): Promise<void> => {
  startFlushTimer(config.bufferFlushInterval);

  const server = net.createServer((socket) => {
    // ── Connection limit guard ─────────────────────────────────
    activeConnections++;
    if (activeConnections > MAX_CONNECTIONS) {
      logger.warn(`[tcp] connection limit (${MAX_CONNECTIONS}) exceeded, rejecting`);
      socket.destroy();
      activeConnections--;
      return;
    }

    // ── Socket timeout for dead devices ────────────────────────
    socket.setTimeout(SOCKET_TIMEOUT_MS);
    socket.on('timeout', () => {
      logger.info(`[tcp] socket timeout, destroying: ${socket.remoteAddress}`);
      socket.destroy();
    });

    // ── Pre-allocated slab buffer ──────────────────────────────
    let slab = Buffer.allocUnsafe(INITIAL_SLAB_SIZE);
    let used = 0;

    socket.on('data', (chunk: Buffer) => {
      // Grow slab if needed
      if (used + chunk.length > slab.length) {
        const newSize = Math.min(slab.length * 2, MAX_SLAB_SIZE);
        if (used + chunk.length > newSize) {
          // Exceeded max slab — protect memory, destroy socket
          logger.warn(`[tcp] slab overflow (${used + chunk.length} bytes), destroying socket`);
          socket.destroy();
          return;
        }
        const newSlab = Buffer.allocUnsafe(newSize);
        slab.copy(newSlab, 0, 0, used);
        slab = newSlab;
      }

      // Copy chunk into slab (no Buffer.concat allocation)
      chunk.copy(slab, used);
      used += chunk.length;

      // Process complete lines
      let searchFrom = 0;
      let newlineIndex: number;
      while ((newlineIndex = slab.indexOf(10, searchFrom)) !== -1 && newlineIndex < used) {
        const lineBuffer = slab.subarray(searchFrom, newlineIndex);
        searchFrom = newlineIndex + 1;

        if (lineBuffer.length === 0) continue;
        const line = lineBuffer.toString('utf-8').trim();
        if (!line) continue;

        try {
          let payload: TrackerPayload | null = null;

          if (line.charCodeAt(0) === 36) { // '$'
            payload = parseRawSluData(line);
          } else {
            try {
              const parsed = JSON.parse(line);
              payload = {
                imei: parsed.imei,
                lat: Number(parsed.lat),
                lng: Number(parsed.lng),
                timestamp: parsed.timestamp ? new Date(parsed.timestamp) : new Date()
              };
            } catch (_) { }
          }

          if (payload) {
            if (!vehicleCache.isRegistered(payload.imei)) {
              // ── Unknown device throttling ────────────────────
              if (unknownPings.size > UNKNOWN_PING_CAP) {
                const firstKey = unknownPings.keys().next().value;
                if (firstKey) unknownPings.delete(firstKey);
              }

              const now = Date.now();
              const lastPing = unknownPings.get(payload.imei) || 0;
              if (now - lastPing > 2000) {
                unknownPings.set(payload.imei, now);
                vehicleCache.unknownPayloads.set(payload.imei, payload);
                wsService.broadcast('tracker:unknown', {
                  location: {
                    imei: payload.imei,
                    lat: payload.lat,
                    lng: payload.lng,
                    speed: payload.speed || 0,
                    ignition: payload.ignition ?? false,
                    timestamp: (payload.timestamp || new Date()).toISOString(),
                  },
                  status: 'UNKNOWN_DEVICE'
                }, payload.imei, payload.lat, payload.lng);
              }
            } else {
              // Always buffer for persistence (cheap, synchronous)
              bufferLocationUpdate(payload);

              // ── Backpressure semaphore ────────────────────────
              // Only fire processLiveUpdate if under concurrency cap
              if (inflight < MAX_INFLIGHT) {
                inflight++;
                processLiveUpdate(payload)
                  .catch(err => logger.error(`[tcp] live update error: ${err.message}`))
                  .finally(() => { inflight--; });
              }
              // If over cap, the update is still persisted via buffer flush — just no immediate WS broadcast
            }
          }
        } catch (error: any) {
          logger.error(`[tcp] processing error: ${error.message}`);
        }
      }

      // Compact slab: shift remaining bytes to front
      if (searchFrom > 0) {
        if (searchFrom < used) {
          slab.copy(slab, 0, searchFrom, used);
        }
        used -= searchFrom;
      }
    });

    socket.on('close', () => {
      activeConnections--;
      logger.info(`[tcp] device disconnected (active: ${activeConnections})`);
    });

    socket.on('error', (err) => {
      logger.error(`[tcp] error: ${err.message}`);
    });
  });

  const PORT = Number(config.tcpPort);
  const wid = cluster.isWorker ? `worker ${process.pid}` : 'primary';
  server.listen({ port: PORT, host: '0.0.0.0', exclusive: false }, () => {
    logger.info(`[tcp] ${wid} listening on port ${PORT} (max ${MAX_CONNECTIONS} connections)`);
  });
};

export default startTcpServer;

