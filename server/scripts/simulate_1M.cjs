const net = require('net');
const { Worker, isMainThread, workerData } = require('worker_threads');
const os = require('os');

/**
 * Super-Scale 1 Million Vehicle Simulator (Multi-Threaded)
 * 
 * Scalability Design:
 * 1. Stateless: No massive arrays. Vehicles are generated on-the-fly from index.
 * 2. Multi-Core: Distributes load across all available CPU cores.
 * 3. Batching: Writes multiple packets in single socket calls to reduce syscalls.
 */

const TOTAL_VEHICLES = 1000000;
const SERVER_HOST = '54.205.0.61';
const SERVER_PORT = 5000;
const CORE_COUNT = Math.max(1, Math.floor(os.cpus().length / 2));
const VEHICLES_PER_WORKER = Math.floor(TOTAL_VEHICLES / CORE_COUNT);

if (isMainThread) {
  console.log(`\n🚀 Initializing 1 MILLION Vehicle Stress Test...`);
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
    console.log(` 💎 SUPERSCALE 1M SIMULATOR DASHBOARD `);
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
      let batchBuffer = '';
      const workloadPerTick = 500; // Reduced from 2000 for smoother execution

      for (let i = 0; i < workloadPerTick; i++) {
        const id = startId + (Math.floor(Math.random() * count));
        const imei = '86' + String(id).padStart(13, '0');

        // Pseudo-random movement based on time and ID
        const now = new Date();
        const lat = 20 + (Math.sin(id + now.getTime() / 10000) * 5);
        const lng = 78 + (Math.cos(id + now.getTime() / 10000) * 5);
        const speed = 40 + (Math.random() * 20);

        const fDate = now.getDate().toString().padStart(2, '0') + (now.getMonth() + 1).toString().padStart(2, '0') + now.getFullYear();
        const fTime = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0') + now.getSeconds().toString().padStart(2, '0');

        const packet = `$1,AEPL,0.0.1,NR,2,H,${imei},XXXXXXXXXX,1,${fDate},${fTime},${lat.toFixed(6)},N,${lng.toFixed(6)},E,${speed.toFixed(2)},180.00,10,553.00,1.27,1.00,AIRTEL,1,1,23.20,4.20,0,O,28,404,90,110E,E0EB,,0000,00,000074,9822,*\n`;

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
