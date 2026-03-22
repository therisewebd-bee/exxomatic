import logger from '../logger/logger.ts';
import { prismaAdapter } from '../../dbQuery/dbInit.ts';

const DEFAULT_RETENTION_DAYS = 30;
const CRON_INTERVAL_MS = 6 * 60 * 60 * 1000; // Run every 6 hours

let retentionTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Deletes locationLog rows older than the retention period.
 * Uses a raw DELETE with a date cutoff to avoid loading rows into memory.
 */
const pruneOldLogs = async (): Promise<void> => {
  const retentionDays = Number(process.env.LOG_RETENTION_DAYS) || DEFAULT_RETENTION_DAYS;
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  try {
    const result = await prismaAdapter.$executeRaw`
      DELETE FROM "LocationLog" WHERE "timestamp" < ${cutoff}
    `;
    logger.info(`[retention] pruned ${result} location logs older than ${retentionDays} days`);
  } catch (error: any) {
    logger.error(`[retention] prune failed: ${error.message}`);
  }
};

/**
 * Starts the retention cron job. Call once at startup.
 */
export const startRetentionCron = (): void => {
  if (retentionTimer) return;

  // Run once immediately on startup, then every 6 hours
  pruneOldLogs();
  retentionTimer = setInterval(pruneOldLogs, CRON_INTERVAL_MS);

  const days = Number(process.env.LOG_RETENTION_DAYS) || DEFAULT_RETENTION_DAYS;
  logger.info(`[retention] cron started: pruning logs older than ${days} days every 6h`);
};

export const stopRetentionCron = (): void => {
  if (retentionTimer) {
    clearInterval(retentionTimer);
    retentionTimer = null;
  }
};
