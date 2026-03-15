import startTcpServer from "./services/tcp/server.js";
import logger from "./services/logger/logger.js";

logger.info("statring server ...")

startTcpServer();