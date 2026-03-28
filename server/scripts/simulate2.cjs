const net = require('net');

/**
 * Lightweight IoT Fleet Simulator (100 devices) — $SLU Format
 * Simple script to test the full pipeline without heavy load.
 *
 * Usage: node scripts/simulate2.cjs [device_count] [host] [port]
 */

const DEVICE_COUNT = parseInt(process.argv[2] || '100', 10);
const SERVER_HOST = process.argv[3] || '54.205.0.61';
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
    odometer: Math.random() * 50000,
    serial: Math.floor(Math.random() * 100000),
  });
}

/**
 * Build a $SLU packet for a single device.
 */
function buildSluPacket(dev, now) {
  const isoTs = now.toISOString().replace('.000Z', '+00:00').replace(/\.\d{3}Z$/, '+00:00');
  const serial = ++dev.serial;
  const speed = (Math.random() * 60).toFixed(0);
  const ign = parseFloat(speed) > 0 ? 1 : 0;
  const eng = ign;
  const heading = Math.floor(Math.random() * 360);
  const alt = (400 + Math.random() * 200).toFixed(1);
  const odo = dev.odometer.toFixed(3).padStart(10, '0');
  const vbat = (3.8 + Math.random() * 0.5).toFixed(3);
  const vin = (12 + Math.random() * 15).toFixed(3);
  const batHealth = Math.floor(70 + Math.random() * 30);
  const batCharge = Math.floor(40 + Math.random() * 60);
  const temp = (20 + Math.random() * 20).toFixed(1);
  const ignStatus = ign ? '01' : '05'; // renmaed to avoid 'eventId'

  const body = `$SLU${dev.imei},06,${serial},${isoTs},${ignStatus},${isoTs},${dev.lat.toFixed(6)},${dev.lng.toFixed(6)},${speed},${odo},${heading},${alt},${ign},${eng},0,0,,56112,0.81,,,${vbat},${vin},${batHealth},${batCharge},,,,3,${ign},${ign},0,${temp},,,,,,,,,0,2`;
  let xor = 0;
  for (let i = 1; i < body.length; i++) xor ^= body.charCodeAt(i);
  const checksum = xor.toString(16).toUpperCase().padStart(2, '0').slice(-2);

  return body + '*' + checksum + '\n';
}

let interval = null;

function connect() {
  const client = new net.Socket();

  client.connect(SERVER_PORT, SERVER_HOST, () => {
    console.log(`✅ Connected to ${SERVER_HOST}:${SERVER_PORT}`);
    console.log(`📡 Streaming ${DEVICE_COUNT} devices every 2 seconds ($SLU format)...\n`);

    let tick = 0;

    const sendBatch = () => {
      tick++;
      const now = new Date();
      let buf = '';

      for (const dev of devices) {
        // Small random walk (~50m per tick)
        dev.lat += (Math.random() - 0.5) * 0.0005;
        dev.lng += (Math.random() - 0.5) * 0.0005;
        dev.odometer += parseFloat((Math.random() * 0.2).toFixed(3));

        buf += buildSluPacket(dev, now);
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
