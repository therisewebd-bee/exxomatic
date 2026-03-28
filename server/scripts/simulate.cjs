const net = require('net');

/**
 * High-Volume IoT Fleet Network Simulator ($SLU Format)
 * 
 * Simulates up to 10,000 UNIQUE vehicles spread universally across India.
 * Each device routes data through a randomized TCP Socket Pool to mimic
 * entirely separate devices connecting to the central listener simultaneously.
 *
 * Packet format: $SLU{IMEI},{CMD_ID},{SERIAL},{ISO_TS},{EID},...*{CHECKSUM}
 *
 * Usage: node scripts/simulate.cjs [test_case: 1|2|3] [vehicle_count: default 10000]
 */

const TEST_CASE = process.argv[2] || '2';
const TOTAL_VEHICLES = parseInt(process.argv[3] || '5', 10);
const STRESS_MULTIPLIER = parseInt(process.argv[4] || '1', 10);
const SERVER_HOST = '13.49.240.170';
const SERVER_PORT = 5000;

// To avoid Operating System "EMFILE" errors (max open files), 
// we will pool the devices across a max of 200 distinct TCP sockets.
const SOCKET_POOL_SIZE = Math.min(TOTAL_VEHICLES, 200);

console.log(`\n🚀 Initializing Vast-Scale Hardware Network ($SLU Format)...`);
console.log(`📱 Unique Real-time Devices: ${TOTAL_VEHICLES}`);
console.log(`🔌 Simulated Network Sockets: ${SOCKET_POOL_SIZE} distinct TCP connections`);
console.log(`🔥 STRESS MULTIPLIER: ${STRESS_MULTIPLIER}x (Throughput Amp)`);

let offsetDegrees = 0;
let baseSpeed = 0;
let caseDescription = '';
// Scale throughput linearly with the stress multiplier
let dispatchIntervalMs = Math.max(5, 50 / STRESS_MULTIPLIER);
const CHUNK_SIZE = Math.floor(50 * STRESS_MULTIPLIER);

// 1 km is roughly 0.008983 degrees
switch (TEST_CASE) {
  case '1':
    offsetDegrees = 2.5 * 0.008983; // ~2.5 km jumps
    baseSpeed = 120.5;
    caseDescription = 'Case 1 (Massive Map Jumps - 2.5km distance per ping)';
    break;
  case '2':
    offsetDegrees = 0.2 * 0.008983; // ~200m jumps
    baseSpeed = 45.2;
    caseDescription = 'Case 2 (City Roaming - 200m distance per ping)';
    break;
  case '3':
    offsetDegrees = 0.01 * 0.008983; // ~10m jumps
    baseSpeed = 4.5;
    caseDescription = 'Case 3 (Micro Movements / Idling - 10m distance per ping)';
    break;
  default:
    offsetDegrees = 0.2 * 0.008983;
    baseSpeed = 45.2;
    caseDescription = 'Default (200m)';
}

console.log(`🧪 Activating: ${caseDescription}`);

// Generate unique vehicles spread across the entirety of the Globe bounds
console.log(`🌍 Scattering vehicles globally across the entire world...`);

const vehicles = [];
for (let i = 0; i < TOTAL_VEHICLES; i++) {
  const imei = '8607' + String(Math.floor(Math.random() * 90000000000) + 10000000000);
  vehicles.push({
    imei,
    lat: (Math.random() * 180) - 90,
    lng: (Math.random() * 360) - 180,
    speed: baseSpeed + (Math.random() * 10 - 5),
    heading: Math.random() * 360,
    odometer: Math.random() * 50000,
    serial: Math.floor(Math.random() * 100000),
    socketIndex: i % SOCKET_POOL_SIZE
  });
}

/**
 * Build a $SLU format packet string.
 * Format: $SLU{IMEI},{CMD_ID},{SERIAL},{EDI},{EID},{LDI},{LTDD},{LGDD},{SPDK},{ODOD},
 *         {HEAD},{ALTD},{IGN},{ENG},{DRV},{RPM},{DUR},{TDUR},{STRT},{STP},{IDL},
 *         {VBAT},{VIN},{BATH},{BATC},{V3},{CFL},{SATN},{FIX},{IN1},{IN2},{OUT1},
 *         {TVI},{TI1},{TV1},{TH1},{TV2},{TI2},{TH2},{CV1},{EXTRA}*{CHECKSUM}
 */
function buildSluPacket(v, now) {
  const isoTs = now.toISOString().replace('.000Z', '+00:00').replace(/\.\d{3}Z$/, '+00:00');
  const serial = ++v.serial;

  // Calculate movement
  const speed = Math.max(0, v.speed + (Math.random() * 4 - 2)).toFixed(0);
  const isMoving = parseFloat(speed) > 0;

  // Create randomized realistic event ID
  // 01 = Location Report, 04 = IGN ON, 05 = IGN OFF, 24 = ENG ON, 25 = ENG OFF
  const randEvent = Math.random();
  let ignStatus = '01';
  if (randEvent > 0.95) ignStatus = isMoving ? '04' : '05';
  else if (randEvent > 0.9) ignStatus = isMoving ? '24' : '25';

  const ign = isMoving ? 1 : 0;
  const eng = isMoving ? 1 : 0;
  const drv = isMoving ? 1 : 0;
  const rpm = isMoving ? Math.floor(800 + Math.random() * 2000) : 0;

  const odo = v.odometer.toFixed(3).padStart(10, '0');
  const heading = Math.floor(v.heading) % 360;
  const alt = (400 + Math.random() * 200).toFixed(1);

  const tdur = 56112 + Math.floor(serial / 10);
  const start = 0.81;
  const vbat = (3.8 + Math.random() * 0.5).toFixed(3);
  const vin = (12 + Math.random() * 15).toFixed(3);
  const batHealth = Math.floor(70 + Math.random() * 30);
  const batCharge = Math.floor(40 + Math.random() * 60);
  const temp = (20 + Math.random() * 20).toFixed(1);

  // Reconstruct exact format requested
  // $SLU{IMEI},06,SERIAL,EDI,EID,LDI,LTDD,LGDD,SPDK,ODOD,HEAD,ALTD,IGN,ENG,DRV,RPM,DUR,TDUR,STRT,STP,IDL,VBAT,VIN,BATH,BATC,V3,CFL,SATN,FIX,IN1,IN2,OUT1,TVI,TI1,TV1,TH1,TV2,TI2,TV2,TH2,CV1,Extra1,Extra2
  const fields = [
    `$SLU${v.imei}`, '06', serial, isoTs, ignStatus, isoTs, v.lat.toFixed(6), v.lng.toFixed(6), speed, odo,
    heading, alt, ign, eng, drv, rpm, '', tdur, start, '', '', vbat, vin, batHealth, batCharge, '', '', '',
    '3', '1', '1', '0', temp, '', '', '', '', '', '', '', '', '0', '2'
  ];

  const body = fields.join(',');

  // Simple XOR checksum over body
  let xor = 0;
  for (let i = 1; i < body.length; i++) xor ^= body.charCodeAt(i);
  const checksum = xor.toString(16).toUpperCase().padStart(2, '0').slice(-2);

  return body + '*' + checksum + '\n';
}

// Global scope
const sockets = [];
let connectedCount = 0;
let loopInterval = null;

function bootNetwork() {
  console.log(`\n⏳ Booting device network. Establishing ${SOCKET_POOL_SIZE} discrete TCP connections...`);

  let failedConnections = 0;

  for (let i = 0; i < SOCKET_POOL_SIZE; i++) {
    const client = new net.Socket();
    sockets.push(client);

    client.connect(SERVER_PORT, SERVER_HOST, () => {
      connectedCount++;
      if (connectedCount === SOCKET_POOL_SIZE) {
        console.log(`✅ All Network Nodes online! Initiating global data flood...\n`);
        startStreaming();
      }
    });

    client.on('error', (err) => {
      failedConnections++;
      if (failedConnections === 1) { // Only log once
        console.error(`\n⚠️  Network error: Is the backend TCP server running on port ${SERVER_PORT}?`);
        process.exit(1);
      }
    });
  }
}

function startStreaming() {
  let currentIndex = 0;
  let cycleCount = 1;
  let totalDataSent = 0;
  let lastDataSent = 0;

  // Real-time Dashboard Updater
  const dashboardInterval = setInterval(() => {
    const tps = totalDataSent - lastDataSent;
    lastDataSent = totalDataSent;
    const memUse = process.memoryUsage().heapUsed / 1024 / 1024;

    console.clear();
    console.log(`\n======================================================`);
    console.log(` 🚀 FLEET TRACKER STRESS TEST DASHBOARD ($SLU) `);
    console.log(`======================================================`);
    console.log(` 🧪 Mode        : ${caseDescription}`);
    console.log(` 📱 Devices     : ${TOTAL_VEHICLES} Active`);
    console.log(` 🔌 Sockets     : ${connectedCount} / ${SOCKET_POOL_SIZE}`);
    console.log(` 📡 Total Sent  : ${totalDataSent.toLocaleString()} packets`);
    console.log(` ⚡ Throughput  : ${tps} updates / sec`);
    console.log(` 🧠 Memory      : ${memUse.toFixed(2)} MB`);
    console.log(` ♻️ Cycle       : ${cycleCount} [${Math.floor((currentIndex / TOTAL_VEHICLES) * 100)}%]`);
    console.log(`======================================================`);
    console.log(` Press Ctrl+C to stop simulation.\n`);
  }, 1000);

  const sendChunk = () => {
    const now = new Date();

    const end = Math.min(currentIndex + CHUNK_SIZE, TOTAL_VEHICLES);

    // Distribute packets across their dedicated sockets
    for (let i = currentIndex; i < end; i++) {
      const v = vehicles[i];
      const socket = sockets[v.socketIndex];

      // Simple backpressure: skip sending if socket is congested
      if (socket.destroyed || socket.writableLength > 1024 * 64) {
        continue;
      }

      const latDir = Math.random() > 0.5 ? 1 : -1;
      const lngDir = Math.random() > 0.5 ? 1 : -1;
      v.lat += (Math.random() * offsetDegrees * latDir);
      v.lng += (Math.random() * offsetDegrees * lngDir);
      v.odometer += parseFloat((Math.random() * 0.5).toFixed(3));

      const packet = buildSluPacket(v, now);
      socket.write(packet);
      totalDataSent++;
    }

    currentIndex = end;
    if (currentIndex >= TOTAL_VEHICLES) {
      currentIndex = 0;
      cycleCount++;
    }
  };

  loopInterval = setInterval(sendChunk, dispatchIntervalMs);
}

// Graceful cleanup
process.on('SIGINT', () => {
  console.log('\n\n🛑 Initiating Universal Shutdown... Closing all network nodes.');
  if (loopInterval) clearInterval(loopInterval);
  sockets.forEach(s => s.destroy());
  process.exit(0);
});

bootNetwork();
