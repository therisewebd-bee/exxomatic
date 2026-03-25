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
  let apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  // If the URL is relative (starts with /), prepend fixed origin
  if (apiUrl.startsWith('/')) {
    apiUrl = `${window.location.protocol}//${window.location.host}${apiUrl}`;
  }

  // If the API URL has /api, we should strip it for the WebSocket upgrade path 
  // unless the backend is specifically configured for it. Usually it's at the root.
  // Convert http(s) to ws(s)
  const wsBase = apiUrl.replace(/^https/, 'wss').replace(/^http/, 'ws').replace(/\/api\/?$/, '');

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
    scheduleReconnect();
    return;
  }

  const isSecurePage = window.location.protocol === 'https:';
  if (isSecurePage && url.startsWith('ws:')) {
    console.warn('[WS] Blocking insecure WebSocket attempt from HTTPS page. Please configure WSS.');
    scheduleReconnect();
    return;
  }

  try {
    socket = new WebSocket(url);
  } catch (err) {
    console.error('[WS] Failed to create WebSocket:', err);
    scheduleReconnect();
    return;
  }

  socket.onopen = () => {

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

    }
  };

  socket.onclose = (e) => {

    scheduleReconnect();
  };

  socket.onerror = (err) => {

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
