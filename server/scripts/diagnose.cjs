const net = require('net');
const { WebSocket } = require('ws');

/**
 * Diagnostic script to test the entire TCP → Parser → WebSocket pipeline
 * 
 * Usage: node scripts/diagnose.cjs <jwt_token>
 * 
 * 1. Connects to WebSocket on port 5001 with your JWT token
 * 2. Sends a test TCP packet on port 5000
 * 3. Checks if the WS receives the broadcast
 */

const TOKEN = process.argv[2];
if (!TOKEN) {
  console.error('❌ Usage: node scripts/diagnose.cjs <jwt_token>');
  console.error('   Get your token from browser localStorage: localStorage.getItem("fleet_token_val")');
  process.exit(1);
}

const WS_URL = `ws://localhost:5001?token=${encodeURIComponent(TOKEN)}`;
const TCP_HOST = 'localhost';
const TCP_PORT = 5000;
const TEST_IMEI = '860738079276675';

console.log('\n🔍 Fleet Tracker Pipeline Diagnostic\n');
console.log('─'.repeat(50));

// Step 1: Connect WebSocket
console.log('\n📶 Step 1: Connecting WebSocket...');
const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ WebSocket connected successfully!');
  
  // Step 2: Listen for messages
  console.log('\n📶 Step 2: Listening for WS messages...');
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log(`\n📨 WS Message received!`);
    console.log(`   Event: ${msg.event}`);
    console.log(`   Data:`, JSON.stringify(msg.data, null, 2));
    
    if (msg.event === 'tracker:live' || msg.event === 'tracker:unknown') {
      console.log('\n✅✅✅ PIPELINE WORKING! Data flows from TCP → Parser → WS → Client');
      setTimeout(() => process.exit(0), 1000);
    }
  });

  // Step 3: Send test TCP packet
  setTimeout(() => {
    console.log('\n📶 Step 3: Sending test TCP packet...');
    const client = new net.Socket();
    client.connect(TCP_PORT, TCP_HOST, () => {
      const now = new Date();
      const d = String(now.getDate()).padStart(2,'0') + String(now.getMonth()+1).padStart(2,'0') + now.getFullYear();
      const t = String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0') + String(now.getSeconds()).padStart(2,'0');
      
      const packet = JSON.stringify({ imei: TEST_IMEI, lat: 18.520400, lng: 73.856700, timestamp: new Date().toISOString() }) + "\\n";
      
      console.log(`   Sent packet for IMEI: ${TEST_IMEI}`);
      console.log(`   Packet: ${packet.substring(0, 80)}...`);
      client.write(packet);
      
      setTimeout(() => client.destroy(), 2000);
    });
    
    client.on('error', (err) => {
      console.error(`❌ TCP connection failed: ${err.message}`);
      console.error('   Is the backend server running? (npm run dev in /server)');
    });
  }, 1000);

  // Timeout
  setTimeout(() => {
    console.log('\n❌ TIMEOUT: No WS message received after 10 seconds.');
    console.log('   Possible issues:');
    console.log('   1. Token is invalid/expired - try logging in again');
    console.log('   2. Backend is not running - check npm run dev in /server');
    console.log('   3. TCP parser failed - check server logs');
    process.exit(1);
  }, 10000);
});

ws.on('error', (err) => {
  console.error(`❌ WebSocket connection failed: ${err.message}`);
  console.error('   Is the backend running on port 5001?');
  process.exit(1);
});

ws.on('close', (code, reason) => {
  console.log(`\n⚠️  WebSocket closed. Code: ${code}, Reason: ${reason}`);
  if (code === 1008) {
    console.error('   ❌ Authentication rejected! Your token is invalid or expired.');
    console.error('   Get a fresh token: login to the app, then in browser console run:');
    console.error('   localStorage.getItem("fleet_token_val")');
  }
  process.exit(1);
});
