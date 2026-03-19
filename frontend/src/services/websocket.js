/**
 * Singleton WebSocket manager with auto-reconnect.
 * Connects directly to the backend WS server and passes
 * the JWT token via query parameter for authentication.
 */

let socket = null;
let listeners = {};
let reconnectTimer = null;
let reconnectDelay = 1000;

function getWsUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const wsBase = apiUrl.replace(/^http/, 'ws');

  // Retrieve token from localStorage (saved by AuthContext on login)
  const token = localStorage.getItem('fleet_token_val');
  if (token) {
    return `${wsBase}?token=${encodeURIComponent(token)}`;
  }
  return wsBase;
}

export function connect() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const url = getWsUrl();

  // Don't even attempt if no token is available
  if (!url.includes('token=')) {
    console.warn('[ws] no auth token available, skipping connection');
    scheduleReconnect();
    return;
  }

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('[ws] connected ✅');
    reconnectDelay = 1000;
  };

  socket.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      const event = msg.event;
      const data = msg.data;

      if (listeners[event]) {
        listeners[event].forEach((cb) => cb(data));
      }
    } catch (err) {
      console.warn('[ws] bad message', err);
    }
  };

  socket.onclose = (e) => {
    console.log(`[ws] disconnected (code: ${e.code}), reconnecting...`);
    scheduleReconnect();
  };

  socket.onerror = (err) => {
    console.error('[ws] error', err);
    // Don't call socket.close() here - onclose will fire automatically
  };
}

function scheduleReconnect() {
  clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
    connect();
  }, reconnectDelay);
}

export function disconnect() {
  clearTimeout(reconnectTimer);
  if (socket) {
    socket.onclose = null;
    socket.close();
    socket = null;
  }
}

export function on(event, callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
}

export function off(event, callback) {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter((cb) => cb !== callback);
}

export function sendViewport(bounds) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'map:viewport',
      data: bounds
    }));
  }
}
