/**
 * Demo Store — localStorage-backed in-memory data store.
 * Powers the entire frontend in demo mode (no backend needed).
 *
 * All CRUD operations persist to localStorage so data survives
 * page refreshes. The store is seeded with demo data on first load.
 */
import {
  DEMO_VEHICLES,
  DEMO_GEOFENCES,
  DEMO_USERS,
  DEMO_COMPLIANCES,
} from '../lib/demoData';

const STORAGE_KEY = 'fleettracker_demo_store';

// ─── Helpers ─────────────────────────────────────────────────
let _id = Date.now();
function uid() {
  return `demo-${(++_id).toString(36)}`;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupt storage */ }
  return null;
}

function save(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch { /* storage full — silently ignore */ }
}

// ─── Initialize store ────────────────────────────────────────
function createStore() {
  const cached = load();
  if (cached && cached.vehicles && cached.geofences) return cached;

  const initial = {
    vehicles: [...DEMO_VEHICLES],
    geofences: [...DEMO_GEOFENCES],
    users: [...DEMO_USERS],
    compliances: [...DEMO_COMPLIANCES],
  };
  save(initial);
  return initial;
}

const store = createStore();

// ─── Simulate network delay ─────────────────────────────────
function delay(ms = 150) {
  return new Promise((r) => setTimeout(r, ms + Math.random() * 100));
}

// ─── VEHICLES ────────────────────────────────────────────────
export async function demoGetVehicles() {
  await delay();
  return { data: store.vehicles };
}

export async function demoCreateVehicle(data) {
  await delay(200);
  const vehicle = {
    id: uid(),
    imei: data.imei || `86000${Date.now().toString().slice(-10)}`,
    vechicleNumb: data.vechicleNumb || data.vehicleNumber || '',
    lat: data.lat || 28.6 + Math.random() * 0.1,
    lng: data.lng || 77.2 + Math.random() * 0.1,
    speed: 0,
    status: 'stopped',
    isLive: false,
    isAlert: false,
    plate: data.vechicleNumb || data.vehicleNumber || data.imei,
    isUnregistered: false,
    isDemo: true,
    vehicleType: data.vehicleType || 'Car',
    driverName: data.driverName || '',
    driverPhone: data.driverPhone || '',
    fuelType: data.fuelType || 'Petrol',
    fuelCapacity: data.fuelCapacity || 50,
    fuelLevel: 100,
    engineHours: 0,
    odometer: data.odometer || 0,
    lastService: new Date().toISOString().split('T')[0],
    nextServiceDue: '',
    diagnostics: {},
    ...data,
  };
  store.vehicles.push(vehicle);
  save(store);
  return { data: vehicle };
}

export async function demoUpdateVehicle(id, data) {
  await delay(200);
  const idx = store.vehicles.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error('Vehicle not found');
  store.vehicles[idx] = { ...store.vehicles[idx], ...data };
  save(store);
  return { data: store.vehicles[idx] };
}

export async function demoDeleteVehicle(id) {
  await delay(200);
  store.vehicles = store.vehicles.filter((v) => v.id !== id);
  save(store);
  return { data: { success: true } };
}

// ─── GEOFENCES ───────────────────────────────────────────────
export async function demoGetGeofences() {
  await delay();
  return { data: store.geofences };
}

export async function demoCreateGeofence(data) {
  await delay(200);
  const geo = {
    id: uid(),
    name: data.name,
    zone: data.zone,
    vehicles: data.vehicleIds
      ? data.vehicleIds.map((vid) => {
          const v = store.vehicles.find((vv) => vv.id === vid);
          return v ? { id: v.id, vechicleNumb: v.vechicleNumb } : { id: vid };
        })
      : [],
    createdAt: new Date().toISOString(),
  };
  store.geofences.push(geo);
  save(store);
  return { data: geo };
}

export async function demoDeleteGeofence(id) {
  await delay(200);
  store.geofences = store.geofences.filter((g) => g.id !== id);
  save(store);
  return { data: { success: true } };
}

// ─── USERS ───────────────────────────────────────────────────
export async function demoGetUsers() {
  await delay();
  return { data: store.users };
}

export async function demoCreateUser(data) {
  await delay(200);
  const user = {
    id: uid(),
    name: data.name,
    email: data.email,
    role: data.role || 'Customer',
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  save(store);
  return { data: { user, token: 'demo-token-' + user.id } };
}

export async function demoUpdateUser(id, data) {
  await delay(200);
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');
  store.users[idx] = { ...store.users[idx], ...data };
  save(store);
  return { data: store.users[idx] };
}

export async function demoDeleteUser(id) {
  await delay(200);
  store.users = store.users.filter((u) => u.id !== id);
  save(store);
  return { data: { success: true } };
}

// ─── AUTH ────────────────────────────────────────────────────
export async function demoLogin(data) {
  await delay(300);
  // Accept any credentials — return the first admin user
  const user = store.users.find((u) => u.role === 'Admin') || store.users[0] || {
    id: 'demo-user-auto',
    name: 'Demo User',
    email: data.email || 'demo@demo.com',
    role: 'Admin',
  };
  return {
    data: {
      user,
      token: 'demo-jwt-' + Date.now(),
    },
  };
}

export async function demoSignup(data) {
  await delay(300);
  const result = await demoCreateUser(data);
  // Auto-grant admin for demo
  result.data.user.role = 'Admin';
  return result;
}

// ─── COMPLIANCE ──────────────────────────────────────────────
export async function demoGetCompliances() {
  await delay();
  return { data: store.compliances };
}

export async function demoCreateCompliance(data) {
  await delay(200);
  const record = {
    id: uid(),
    ...data,
    date: data.date || new Date().toISOString(),
    vehicle: store.vehicles.find((v) => v.id === data.vehicleId) || {},
  };
  store.compliances.push(record);
  save(store);
  return { data: record };
}

// ─── LOCATIONS / HISTORY ─────────────────────────────────────
export async function demoGetLocationHistory(params) {
  await delay(300);
  const imei = params.imei || params.get?.('imei');
  const vehicle = store.vehicles.find((v) => v.imei === imei);
  const baseLat = vehicle?.lat || 28.6;
  const baseLng = vehicle?.lng || 77.2;

  // Generate a realistic 24-hour GPS trail
  const points = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const interval = 60000; // 1 point per minute
  const count = Math.min(parseInt(params.limit) || 1440, 1440);

  for (let i = 0; i < count; i++) {
    const t = now - dayMs + i * interval;
    const progress = i / count;

    // Simulate a realistic route: out and back pattern
    const angle = progress * Math.PI * 2;
    const radius = 0.02 + Math.sin(progress * Math.PI) * 0.03;
    const drift = (Math.random() - 0.5) * 0.002;

    const lat = baseLat + Math.sin(angle) * radius + drift;
    const lng = baseLng + Math.cos(angle) * radius + drift;

    // Simulate speed: moving during day, stopped at night
    const hour = new Date(t).getHours();
    const isNight = hour < 6 || hour > 22;
    const speed = isNight ? 0 : Math.round(20 + Math.random() * 50);

    points.push({
      id: `hist-${i}`,
      imei,
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
      speed,
      ignition: !isNight,
      timestamp: new Date(t).toISOString(),
      motionStatus: speed > 2 ? 'moving' : speed === 0 ? 'stopped' : 'idle',
    });
  }

  return { data: points };
}

// ─── FUEL RATE ───────────────────────────────────────────────
export async function demoCheckFuelRate() {
  await delay(100);
  return {
    data: {
      city: 'Delhi',
      petrol: 94.72,
      diesel: 87.62,
      cng: 76.59,
      updatedAt: new Date().toISOString(),
    },
  };
}

// ─── VEHICLE LOCATION UPDATE ─────────────────────────────────
export async function demoUpdateVehicleLocation(id, data) {
  await delay(100);
  const idx = store.vehicles.findIndex((v) => v.id === id);
  if (idx !== -1) {
    store.vehicles[idx].lat = data.lat;
    store.vehicles[idx].lng = data.lng;
    if (data.speed !== undefined) store.vehicles[idx].speed = data.speed;
    save(store);
  }
  return { data: { success: true } };
}
