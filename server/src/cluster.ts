import cluster from 'cluster';
import os from 'os';
import { config } from './config/config.ts';

/**
 * Cluster Mode Entry Point
 * 
 * Primary process forks N workers (default = CPU count).
 * Each worker runs the full server (HTTP + WS + TCP).
 * 
 * TCP connections are distributed by the OS kernel (round-robin on Linux).
 * HTTP/WS connections are distributed by Node.js cluster module (round-robin).
 * Each worker has its own independent WebSocket state (grid buffer, LRU cache).
 * 
 * Usage:
 *   npx tsx src/cluster.ts           (uses all CPU cores)
 *   CLUSTER_WORKERS=4 npx tsx src/cluster.ts  (4 workers)
 *   CLUSTER_WORKERS=1 npx tsx src/cluster.ts  (single-process, same as index.ts)
 */

const numWorkers = config.clusterWorkers;

if (cluster.isPrimary) {
  console.log(`[cluster] Primary ${process.pid} starting ${numWorkers} workers`);

  // Fork workers
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`[cluster] Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Restarting...`);
    cluster.fork(); // Auto-restart crashed workers
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('[cluster] Primary shutting down...');
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill('SIGTERM');
    }
    setTimeout(() => process.exit(0), 5000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

} else {
  // Each worker runs the full server stack
  import('./index.ts');
  console.log(`[cluster] Worker ${process.pid} started`);
}
