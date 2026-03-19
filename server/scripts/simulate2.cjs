const net = require('net');

/**
 * Lightweight IoT Fleet Simulator (100 devices)
 * Simple script to test the full pipeline without heavy load.
 * Uses the $1,AEPL hardware format.
 *
 * Usage: node scripts/simulate.js [device_count] [host] [port]
 */

const DEVICE_COUNT = parseInt(process.argv[2] || '100', 10);
const SERVER_HOST = process.argv[3] || 'localhost';
const SERVER_PORT = parseInt(process.argv[4] || '5000', 10);

// Real data points near Pune
const BASE_POINTS = [
  { lat: 18.593136, lng: 73.829690 },
  { lat: 18.593001, lng: 73.829747 },
  { lat: 18.592979, lng: 73.829753 },
  { lat: 18.592881, lng: 73.829765 },
  { lat: 18.592803, lng: 73.829818 },
  { lat: 18.592840, lng: 73.829937 },
  { lat: 18.593555, lng: 73.829886 },
  { lat: 18.594763, lng: 73.829407 },
  { lat: 18.604882, lng: 73.823992 },
  { lat: 18.665967, lng: 73.782845 },
];

// Generate devices with unique IMEIs, each starting at a random base point
const devices = [];
for (let i = 0; i < DEVICE_COUNT; i++) {
  const base = BASE_POINTS[i % BASE_POINTS.length];
  devices.push({
    imei: '8607' + String(10000000000 + i).padStart(11, '0'),
    lat: base.lat + (Math.random() - 0.5) * 0.01,
    lng: base.lng + (Math.random() - 0.5) * 0.01,
  });
}

let interval = null;

function fmtDate(d) {
  return String(d.getDate()).padStart(2,'0') + String(d.getMonth()+1).padStart(2,'0') + d.getFullYear();
}
function fmtTime(d) {
  return String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0') + String(d.getSeconds()).padStart(2,'0');
}

function connect() {
  const client = new net.Socket();

  client.connect(SERVER_PORT, SERVER_HOST, () => {
    console.log(`✅ Connected to ${SERVER_HOST}:${SERVER_PORT}`);
    console.log(`📡 Streaming ${DEVICE_COUNT} devices every 2 seconds...\n`);

    let tick = 0;

    const sendBatch = () => {
      tick++;
      const now = new Date();
      const d = fmtDate(now);
      const t = fmtTime(now);
      let buf = '';

      for (const dev of devices) {
        // Small random walk (~50m per tick)
        dev.lat += (Math.random() - 0.5) * 0.0005;
        dev.lng += (Math.random() - 0.5) * 0.0005;
        const speed = (Math.random() * 60).toFixed(2);

        buf += `$1,AEPL,0.0.1,NR,2,H,${dev.imei},XXXXXXXXXX,1,${d},${t},${dev.lat.toFixed(6)},N,${dev.lng.toFixed(6)},E,${speed},${(Math.random()*360).toFixed(2)},10,553.00,1.27,1.00,AIRTEL,1,1,23.20,4.20,0,O,28,404,90,110E,E0EB,,0000,00,000074,9822,*\n`;
      }

      client.write(buf);
      console.log(`  [tick ${tick}] sent ${DEVICE_COUNT} device updates`);
    };

    sendBatch();
    interval = setInterval(sendBatch, 2000);
  });

  client.on('close', () => {
    console.log('\n❌ Connection closed. Reconnecting in 5s...');
    if (interval) clearInterval(interval);
    setTimeout(connect, 5000);
  });

  client.on('error', (err) => {
    console.error(`⚠️  Error: ${err.message}`);
    if (interval) clearInterval(interval);
    interval = null;
  });
}

connect();
