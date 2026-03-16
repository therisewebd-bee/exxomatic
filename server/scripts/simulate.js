const net = require('net');

/**
 * IoT Tracker Simulator
 * Connects to the TCP server and streams $SLU formatted data.
 */

const SERVER_HOST = 'localhost';
const SERVER_PORT = 5000; // TCP server now on port 5000
const IMEI = '352353081356070';

// Initial real data points from your logs
const INITIAL_POINTS = [
  { lat: 18.593136, lng: 73.829690 },
  { lat: 18.593001, lng: 73.829747 },
  { lat: 18.592979, lng: 73.829753 },
  { lat: 18.592881, lng: 73.829765 },
  { lat: 18.592803, lng: 73.829818 },
  { lat: 18.592806, lng: 73.829844 },
  { lat: 18.592840, lng: 73.829937 },
  { lat: 18.593555, lng: 73.829886 },
  { lat: 18.594763, lng: 73.829407 },
  { lat: 18.604882, lng: 73.823992 },
  { lat: 18.665967, lng: 73.782845 }
];

// Generate extended log points (looping and incrementing)
const LOG_POINTS = [...INITIAL_POINTS];
const EXTENSION_COUNT = 5000; // Generate 5000 more points for long streaming

let lastPoint = INITIAL_POINTS[INITIAL_POINTS.length - 1];
for (let i = 0; i < EXTENSION_COUNT; i++) {
  // Simulate continuous movement in a general direction with some random jitter
  lastPoint = {
    lat: lastPoint.lat + 0.00015 + (Math.random() - 0.5) * 0.00005,
    lng: lastPoint.lng - 0.00012 + (Math.random() - 0.5) * 0.00005
  };
  LOG_POINTS.push({ ...lastPoint });
}

const client = new net.Socket();

client.connect(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Connected to TCP server on port ${SERVER_PORT}`);
  console.log(`Streaming ${LOG_POINTS.length} points...`);
  
  let index = 0;

  const sendPacket = () => {
    if (index >= LOG_POINTS.length) {
       console.log('Finished streaming all points. Looping back...');
       index = 0;
    }

    const point = LOG_POINTS[index];
    const time = new Date().toISOString();
    
    // $SLU<imei>,<type>,<seq>,<time>,<type2>,<time2>,<lat>,<lng>,<speed>,<odo>,<heading>,<alt>,<ign>,...
    const packet = `$SLU${IMEI},06,${527835 + index},${time},01,${time},${point.lat.toFixed(6)},${point.lng.toFixed(6)},45.0,019420.190,160,495.0,1,0,0,0,0,,52544,0.73,,,04.167,24.831,79,65,,,25,3,1,1,0,42.0\n`;
    
    console.log(`[${index}/${LOG_POINTS.length}] Sending: ${packet.trim().substring(0, 80)}...`);
    client.write(packet);
    index++;
  };

  // Send every 2 seconds
  const interval = setInterval(sendPacket, 2000);

  client.on('close', () => {
    console.log('Connection closed');
    clearInterval(interval);
  });
});

client.on('error', (err) => {
  console.error('Socket error:', err.message);
  process.exit(1);
});
