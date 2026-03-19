const net = require('net');

/**
 * High-Volume IoT Fleet Network Simulator (Assignment Format)
 * 
 * Simulates up to 10,000 UNIQUE vehicles spread universally across India.
 * Each device routes data through a randomized TCP Socket Pool to mimic
 * entirely separate devices connecting to the central listener simultaneously.
 *
 * Usage: node scripts/simulate.cjs [test_case: 1|2|3] [vehicle_count: default 10000]
 */

const TEST_CASE = process.argv[2] || '2';
const TOTAL_VEHICLES = parseInt(process.argv[3] || '10000', 10);
const SERVER_HOST = 'localhost';
const SERVER_PORT = 5000;

// To avoid Operating System "EMFILE" errors (max open files), 
// we will pool the 10,000 devices across a max of 200 distinct TCP sockets.
// To the backend, this still perfectly mimics thousands of disparate IoT networks.
const SOCKET_POOL_SIZE = Math.min(TOTAL_VEHICLES, 200);

console.log(`\n🚀 Initializing Vast-Scale Hardware Network...`);
console.log(`📱 Unique Real-time Devices: ${TOTAL_VEHICLES}`);
console.log(`🔌 Simulated Network Sockets: ${SOCKET_POOL_SIZE} distinct TCP connections`);

let offsetDegrees = 0;
let baseSpeed = 0;
let caseDescription = '';
let dispatchIntervalMs = 50; 
const CHUNK_SIZE = 50; 

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

// Generate unique vehicles spread across the entirety of INDIA bounds
// India Latitude: roughly 8.0 N to 35.0 N
// India Longitude: roughly 68.0 E to 97.0 E
console.log(`🌍 Scattering vehicles randomly across India and neighboring sectors...`);

const vehicles = [];
for (let i = 0; i < TOTAL_VEHICLES; i++) {
  const imei = '8607' + String(Math.floor(Math.random() * 90000000000) + 10000000000);
  vehicles.push({
    imei,
    lat: 8.0 + Math.random() * 27.0,   // Random anywhere between 8 and 35 N
    lng: 68.0 + Math.random() * 29.0,  // Random anywhere between 68 and 97 E
    speed: baseSpeed + (Math.random() * 10 - 5),
    heading: Math.random() * 360,
    socketIndex: i % SOCKET_POOL_SIZE   // Assign this device to a dedicated socket in the pool
  });
}

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

function formatTime(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  const secs = String(date.getSeconds()).padStart(2, '0');
  return `${hh}${mins}${secs}`;
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
  
  const sendChunk = () => {
    const now = new Date();
    const fDate = formatDate(now);
    const fTime = formatTime(now);

    const end = Math.min(currentIndex + CHUNK_SIZE, TOTAL_VEHICLES);
    
    // Distribute packets across their dedicated sockets
    for (let i = currentIndex; i < end; i++) {
      const v = vehicles[i];
      
      // Random walk applying the distance test case
      const latDir = Math.random() > 0.5 ? 1 : -1;
      const lngDir = Math.random() > 0.5 ? 1 : -1;
      v.lat += (Math.random() * offsetDegrees * latDir);
      v.lng += (Math.random() * offsetDegrees * lngDir);
      
      // Speed fluctuation
      const currentSpeed = Math.max(0, v.speed + (Math.random() * 4 - 2)).toFixed(2);
      
      // Strict $1 assignment payload format
      const packet = `$1,AEPL,0.0.1,NR,2,H,${v.imei},XXXXXXXXXX,1,${fDate},${fTime},${v.lat.toFixed(6)},N,${v.lng.toFixed(6)},E,${currentSpeed},${v.heading.toFixed(2)},10,553.00,1.27,1.00,AIRTEL,1,1,23.20,4.20,0,O,28,404,90,110E,E0EB,,0000,00,000074,9822,*\n`;
      
      // Send through this device's "simulated" network socket
      const socket = sockets[v.socketIndex];
      if (!socket.destroyed) {
        socket.write(packet);
        totalDataSent++;
      }
    }
    
    process.stdout.write(`\r📡 [Cycle ${cycleCount}] Global Live Network: Streamed ${totalDataSent} GPS updates across India...`);

    currentIndex = end;
    if (currentIndex >= TOTAL_VEHICLES) {
      // Completed one entire cycle of the 10,000 fleet, restarting
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
