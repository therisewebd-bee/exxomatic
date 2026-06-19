/**
 * Singleton WebSocket manager with auto-reconnect.
 * In demo mode, simulates live vehicle movement via setInterval
 * instead of connecting to a real WebSocket server.
 */

import { DEMO_MODE } from './api';
import { DEMO_VEHICLES } from '../lib/demoData';

let socket = null;
let listeners = {};
let reconnectTimer = null;
let reconnectDelay = 1000;
let demoTimer = null;

// ─── Demo Mode: Vehicle Movement Simulator ───────────────────
// Keeps mutable copies of vehicle positions for realistic drift
let demoPositions = null;

function initDemoPositions() {
  if (demoPositions) return;
  demoPositions = DEMO_VEHICLES.map((v) => ({
    imei: v.imei,
    lat: v.lat,
    lng: v.lng,
    speed: v.speed,
    ignition: v.status !== 'stopped',
    heading: Math.random() * 360,
    // Each vehicle has a movement pattern
    pattern: v.status === 'stopped' ? 'parked' : v.status === 'idle' ? 'idling' : 'cruising',
    patternTimer: 0,
  }));
}

function tickDemoVehicles() {
  if (!demoPositions) return;

  const batch = [];
  const now = new Date().toISOString();

  for (const pos of demoPositions) {
    // Advance pattern timer and occasionally switch behavior
    pos.patternTimer++;
    if (pos.patternTimer > 15 + Math.random() * 30) {
      pos.patternTimer = 0;
      const roll = Math.random();
      if (roll < 0.5) {
        pos.pattern = 'cruising';
      } else if (roll < 0.75) {
        pos.pattern = 'idling';
      } else {
        pos.pattern = 'parked';
      }
    }

    // Apply movement based on pattern
    switch (pos.pattern) {
      case 'cruising': {
        pos.speed = 25 + Math.random() * 55;
        pos.ignition = true;
        // Drift in current heading with slight turn
        pos.heading += (Math.random() - 0.5) * 20;
        const rad = (pos.heading * Math.PI) / 180;
        const dist = 0.0002 + Math.random() * 0.0004; // ~20-60m per tick
        pos.lat += Math.cos(rad) * dist;
        pos.lng += Math.sin(rad) * dist;
        break;
      }
      case 'idling':
        pos.speed = 0;
        pos.ignition = true;
        // Tiny jitter
        pos.lat += (Math.random() - 0.5) * 0.00005;
        pos.lng += (Math.random() - 0.5) * 0.00005;
        break;
      case 'parked':
        pos.speed = 0;
        pos.ignition = false;
        break;
    }

    const motionStatus = pos.speed > 2 ? 'moving' : pos.ignition ? 'idle' : 'stopped';

    batch.push({
      status: 'OK',
      motionStatus,
      batchEvent: 'tracker:live',
      location: {
        imei: pos.imei,
        lat: parseFloat(pos.lat.toFixed(6)),
        lng: parseFloat(pos.lng.toFixed(6)),
        speed: Math.round(pos.speed),
        ignition: pos.ignition,
        timestamp: now,
      },
      diagnostics: {
        battery: 12.2 + Math.random() * 0.8,
        temp: 65 + Math.random() * 30,
      },
    });
  }

  // Fire the batch event to all listeners
  if (listeners['tracker:live:batch']) {
    listeners['tracker:live:batch'].forEach((cb) => cb(batch));
  }
  if (listeners['tracker:live']) {
    listeners['tracker:live'].forEach((cb) => cb(batch));
  }

  // Occasionally simulate a geofence breach notification
  if (Math.random() < 0.02) {
    const randomVehicle = demoPositions[Math.floor(Math.random() * demoPositions.length)];
    const breachData = {
      imei: randomVehicle.imei,
      action: Math.random() > 0.5 ? 'entered' : 'exited',
      geofence: {
        name: ['Delhi NCR Hub', 'Mumbai Distribution Ring', 'Bangalore Tech Park'][Math.floor(Math.random() * 3)],
      },
      lat: randomVehicle.lat,
      lng: randomVehicle.lng,
    };
    if (listeners['geofence:breach']) {
      listeners['geofence:breach'].forEach((cb) => cb(breachData));
    }
  }
}

function startDemoSimulator() {
  if (demoTimer) return;
  initDemoPositions();
  // Tick every 2 seconds for smooth movement
  demoTimer = setInterval(tickDemoVehicles, 2000);
  // Fire one immediate tick so data appears instantly
  setTimeout(tickDemoVehicles, 300);
}

function stopDemoSimulator() {
  if (demoTimer) {
    clearInterval(demoTimer);
    demoTimer = null;
  }
}

// ─── Real WebSocket Logic ────────────────────────────────────
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
  // ── Demo Mode: use simulator instead of real WS ──
  if (DEMO_MODE) {
    startDemoSimulator();
    return;
  }

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
  // ── Demo Mode cleanup ──
  if (DEMO_MODE) {
    stopDemoSimulator();
    return;
  }

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
  // In demo mode, no need to send viewport — simulator covers all vehicles
  if (DEMO_MODE) return;

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'map:viewport',
      data: bounds
    }));
  }
}
