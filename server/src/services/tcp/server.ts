import net from 'net';
import logger from '../logger/logger.js';
import { processTrackerUpdate, TrackerPayload } from '../tracker/tracker.logic.js';
import { parseRawSluData } from './dataParser.js';
import { bufferLocationUpdate, startFlushTimer } from './buffer.js';
import { config } from '../../config/config.js';

const startTcpServer = async (): Promise<void> => {
  // Initialize the persistence buffer timer
  startFlushTimer();

  const server = net.createServer((socket) => {
    logger.info(`[tcp] device connected:${socket.remoteAddress}`);

    socket.on('data', async (data: Buffer) => {
      const rawData = data.toString().trim();
      logger.info(`[tcp] data received: ${rawData}`);
      
      try {
        let payload: TrackerPayload | null = null;

        if (rawData.startsWith('$SLU')) {
          payload = parseRawSluData(rawData);
        } else {
          try {
            const parsed = JSON.parse(rawData);
            payload = {
              imei: parsed.imei,
              lat: Number(parsed.lat),
              lng: Number(parsed.lng),
              timestamp: parsed.timestamp ? new Date(parsed.timestamp) : new Date()
            };
          } catch (e) {
            logger.warn(`[tcp] invalid JSON or format: ${rawData}`);
          }
        }

        if (payload) {
          await processTrackerUpdate(payload);
          logger.info(`[tcp] update processed for ${payload.imei}`);
        }
      } catch (error: any) {
        logger.error(`[tcp] processing error: ${error.message}`);
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
