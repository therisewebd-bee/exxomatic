import logger from '../logger/logger.ts';
import { TrackerPayload, processTrackerUpdate, processTrackerUpdateBatch } from '../tracker/tracker.logic.ts';

/**
 * In-memory buffer to reduce DB overhead for high-frequency trackers.
 * Flushes every 2 minutes.
 */

let locationBuffer = new Map<string, TrackerPayload>();
let isFlushing = false;
let flushTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Add an update to the buffer. 
 * Overwrites existing entry for the same IMEI to keep only the latest.
 */
export const bufferLocationUpdate = (payload: TrackerPayload): void => {
  locationBuffer.set(payload.imei, payload);
};

/**
 * Flush all buffered updates through the main normalization pipeline
 */
export const flushBuffer = async (): Promise<void> => {
  if (isFlushing || locationBuffer.size === 0) return;

  isFlushing = true;
  const snapshot = new Map(locationBuffer);
  locationBuffer.clear();

  logger.info(`[buffer] flushing ${snapshot.size} vehicle updates`);

  const updates = Array.from(snapshot.values());
  
  try {
    // Pass the entire thousands-long array into the Vectorized Processor
    await processTrackerUpdateBatch(updates);

    logger.debug(`[buffer] flush success: ${updates.length} vehicles persisted via bulk transaction`);
  } catch (error: any) {
    logger.error(`[buffer] critical flush failure: ${error.message}`);
    // Restore snapshot to buffer if it's not already overwritten
    snapshot.forEach((val, key) => {
      if (!locationBuffer.has(key)) locationBuffer.set(key, val);
    });
  } finally {
    isFlushing = false;
  }
};

export const startFlushTimer = (intervalMs: number = 120000): void => {
  if (flushTimer) return;
  flushTimer = setInterval(flushBuffer, intervalMs);
  logger.info(`[buffer] timer started: flushing every ${intervalMs / 1000}s`);
};

// Shutdown handlers
const finalFlush = async () => {
  logger.info('[buffer] process exit: final flush');
  if (flushTimer) clearInterval(flushTimer);
  await flushBuffer();
};

process.on('SIGTERM', finalFlush);
process.on('SIGINT', finalFlush);
