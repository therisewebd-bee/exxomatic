import http from 'http';
import startTcpServer from './services/tcp/server.ts';
import logger from './services/logger/logger.ts';
import app from './app.ts';
import { config } from './config/config.ts';
import { wsService } from './services/websocket/socket.ts';
import { vehicleCache } from './services/tracker/vehicleCache.ts';
import { startRetentionCron } from './services/retention/retention.ts';

const startServers = async () => {
  try {
    // 0. Initialize Vehicle Cache
    await vehicleCache.init();

    // 1. Start HTTP Server
    const httpServer = http.createServer(app);
    const PORT = Number(config.port);
    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`HTTP Server running on port ${PORT}`);
    });

    // 1.5 Start WebSocket Server
    wsService.init(httpServer);
    logger.info('WebSocket Server initialized');

    // 2. Start TCP Server (Tracker Communication)
    startTcpServer();
    logger.info('TCP Server started for tracker communication');

    // 3. Start Location Log Retention Cron
    startRetentionCron();

  } catch (error) {
    logger.error('Failed to start servers:', error);
    process.exit(1);
  }
};

startServers();

