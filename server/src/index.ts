import http from 'http';
import startTcpServer from './services/tcp/server.js';
import logger from './services/logger/logger.js';
import app from './app.js';
import { config } from './config/config.js';

const startServers = () => {
  try {
    // 1. Start HTTP Server
    const httpServer = http.createServer(app);
    const PORT = config.port;

    httpServer.listen(PORT, () => {
      logger.info(`HTTP Server running on port ${PORT}`);
    });

    // 2. Start TCP Server (Tracker Communication)
    startTcpServer();
    logger.info('TCP Server started for tracker communication');

  } catch (error) {
    logger.error('Failed to start servers:', error);
    process.exit(1);
  }
};

startServers();
