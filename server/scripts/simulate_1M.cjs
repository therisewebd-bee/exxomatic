const net = require('net');
const { Worker, isMainThread, workerData } = require('worker_threads');
const os = require('os');

/**
 * Super-Scale 1 Million Vehicle Simulator (Multi-Threaded) — $SLU Format
 * 
 * Scalability Design:
 * 1. Stateless: No massive arrays. Vehicles are generated on-the-fly from index.
 * 2. Multi-Core: Distributes load across all available CPU cores.
 * 3. Batching: Writes multiple packets in single socket calls to reduce syscalls.
 *
 * Packet format: $SLU{IMEI},{CMD_ID},{SERIAL},{ISO_TS},{EID},...*{CHECKSUM}
 */

const TOTAL_VEHICLES = 1000000;
const SERVER_HOST = '54.205.0.61';
const SERVER_PORT = 5000;
const CORE_COUNT = Math.max(1, Math.floor(os.cpus().length / 2));
const VEHICLES_PER_WORKER = Math.floor(TOTAL_VEHICLES / CORE_COUNT);

if (isMainThread) {
  console.log(`\n🚀 Initializing 1 MILLION Vehicle Stress Test ($SLU Format)...`);
  console.log(`💻 Cores Detected: ${CORE_COUNT}`);
  console.log(`📱 Vehicles per Core: ${VEHICLES_PER_WORKER.toLocaleString()}`);

  let totalSent = 0n;
  let lastSent = 0n;

  // Real-time Dashboard
  setInterval(() => {
    const tps = Number(totalSent - lastSent);
    lastSent = totalSent;
    const mem = process.memoryUsage().heapUsed / 1024 / 1024;

    console.clear();
    console.log(`\n======================================================`);
    console.log(` 💎 SUPERSCALE 1M SIMULATOR DASHBOARD ($SLU) `);
    console.log(`======================================================`);
    console.log(` 📱 Concurrent Vehicles : ${TOTAL_VEHICLES.toLocaleString()}`);
    console.log(` ⚡ Throughput          : ${tps.toLocaleString()} updates/sec`);
    console.log(` 🧠 Simulator Memory    : ${mem.toFixed(2)} MB`);
    console.log(` 🧵 Active Workers      : ${CORE_COUNT}`);
    console.log(`======================================================`);
    console.log(` Press Ctrl+C to terminate simulation.\n`);
  }, 1000);

  for (let i = 0; i < CORE_COUNT; i++) {
    const worker = new Worker(__filename, {
      workerData: {
        startId: i * VEHICLES_PER_WORKER,
        count: VEHICLES_PER_WORKER,
        workerId: i
      }
    });

    worker.on('message', (msg) => {
      if (msg.type === 'stats') {
        totalSent += BigInt(msg.count);
      }
    });
  }
} else {
  // --- Worker Thread Logic ---
  const { parentPort } = require('worker_threads');
  const { startId, count, workerId } = workerData;
  const socketCount = 50; // Sockets per worker
  const sockets = [];
  let connected = 0;

  // Per-worker serial counter
  let serialCounter = startId * 100;

  /**
   * Build a $SLU packet on-the-fly from an ID.
   */
  function buildSluPacket(id, now) {
    const imei = '86' + String(id).padStart(13, '0');
    const isoTs = now.toISOString().replace('.000Z', '+00:00').replace(/\.\d{3}Z$/, '+00:00');
    const serial = ++serialCounter;

    // Pseudo-random movement based on time and ID
    const lat = 20 + (Math.sin(id + now.getTime() / 10000) * 5);
    const lng = 78 + (Math.cos(id + now.getTime() / 10000) * 5);
    const speed = Math.floor(40 + Math.random() * 20);
    const ign = speed > 0 ? 1 : 0;
    const heading = Math.floor(Math.random() * 360);
    const alt = (400 + Math.random() * 200).toFixed(1);
    const odo = (Math.random() * 50000).toFixed(3).padStart(10, '0');
    const vbat = (3.8 + Math.random() * 0.5).toFixed(3);
    const vin = (12 + Math.random() * 15).toFixed(3);
    const batHealth = Math.floor(70 + Math.random() * 30);
    const batCharge = Math.floor(40 + Math.random() * 60);
    const temp = (20 + Math.random() * 20).toFixed(1);

    const body = `$SLU${imei},06,${serial},${isoTs},01,${isoTs},${lat.toFixed(6)},${lng.toFixed(6)},${speed},${odo},${heading},${alt},${ign},${ign},0,0,,56112,0.81,,,${vbat},${vin},${batHealth},${batCharge},,,,3,${ign},${ign},0,${temp},,,,,,,,,0,2`;
    let xor = 0;
    for (let i = 1; i < body.length; i++) xor ^= body.charCodeAt(i);
    const checksum = xor.toString(16).toUpperCase().padStart(2, '0').slice(-2);

    return body + '*' + checksum + '\n';
  }

  const connect = () => {
    for (let i = 0; i < socketCount; i++) {
      const s = new net.Socket();
      s.connect(SERVER_PORT, SERVER_HOST, () => {
        connected++;
        if (connected === socketCount) startStreaming();
      });
      s.on('error', () => { });
      sockets.push(s);
    }
  };

  const startStreaming = () => {
    const THROTTLE_MS = 50; // Delay between batches to prevent 100% CPU lockup
    let sentInCycle = 0;

    const sendBatch = () => {
      const workloadPerTick = 500;
      const now = new Date();

      for (let i = 0; i < workloadPerTick; i++) {
        const id = startId + (Math.floor(Math.random() * count));
        const packet = buildSluPacket(id, now);

        const socket = sockets[id % socketCount];
        if (!socket.destroyed) {
          socket.write(packet);
          sentInCycle++;
        }
      }

      parentPort.postMessage({ type: 'stats', count: sentInCycle });
      sentInCycle = 0;
      setTimeout(sendBatch, THROTTLE_MS);
    };

    sendBatch();
  };

  connect();
}
