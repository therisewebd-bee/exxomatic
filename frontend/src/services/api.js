// ─── Demo Mode ──────────────────────────────────────────────
// When VITE_API_URL is not set, all API calls route to the local demoStore.
// This allows the frontend to run fully standalone without a backend.
import * as demo from './demoStore';

const DEMO_MODE = !import.meta.env.VITE_API_URL;

/**
 * Routes demo-mode API calls to the in-memory demoStore.
 * Returns the same { data: ... } shape the real backend returns.
 */
async function demoRouter(endpoint, method, body) {
  const path = endpoint.replace(/^\//, '');

  // ── Auth ────────────────────────────────
  if (path === 'users/login' && method === 'POST') return demo.demoLogin(body);
  if (path === 'users/register' && method === 'POST') return demo.demoSignup(body);

  // ── Users ───────────────────────────────
  if (path === 'users' && method === 'GET') return demo.demoGetUsers();
  if (/^users\/[^/]+$/.test(path) && method === 'PATCH') {
    const id = path.split('/')[1];
    return demo.demoUpdateUser(id, body);
  }
  if (/^users\/[^/]+$/.test(path) && method === 'DELETE') {
    const id = path.split('/')[1];
    return demo.demoDeleteUser(id);
  }

  // ── Vehicles ────────────────────────────
  if (/^vehicles(\?|$)/.test(path) && method === 'GET') return demo.demoGetVehicles();
  if (path === 'vehicles' && method === 'POST') return demo.demoCreateVehicle(body);
  if (/^vehicles\/[^/]+$/.test(path) && method === 'PATCH') {
    const id = path.split('/')[1];
    return demo.demoUpdateVehicle(id, body);
  }
  if (/^vehicles\/[^/]+\/location$/.test(path) && method === 'PUT') {
    const id = path.split('/')[1];
    return demo.demoUpdateVehicleLocation(id, body);
  }
  if (/^vehicles\/[^/]+$/.test(path) && method === 'DELETE') {
    const id = path.split('/')[1];
    return demo.demoDeleteVehicle(id);
  }

  // ── Locations / History ─────────────────
  if (path.startsWith('locations/history')) {
    const qs = path.split('?')[1] || '';
    const params = Object.fromEntries(new URLSearchParams(qs));
    return demo.demoGetLocationHistory(params);
  }

  // ── Geofences ───────────────────────────
  if (path === 'geofences' && method === 'GET') return demo.demoGetGeofences();
  if (path === 'geofences' && method === 'POST') return demo.demoCreateGeofence(body);
  if (/^geofences\/[^/]+$/.test(path) && method === 'DELETE') {
    const id = path.split('/')[1];
    return demo.demoDeleteGeofence(id);
  }

  // ── Compliance ──────────────────────────
  if (path.startsWith('compliance') && method === 'GET') return demo.demoGetCompliances();
  if (path === 'compliance' && method === 'POST') return demo.demoCreateCompliance(body);
  if (path.startsWith('compliance/fuel/live-rate')) return demo.demoCheckFuelRate();

  // Fallback — return empty data for unknown endpoints
  console.warn(`[DemoMode] Unhandled: ${method} /${path}`);
  return { data: [] };
}

// Force relative path on HTTPS to leverage Netlify proxy and avoid Mixed Content blocks
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const envApiUrl = import.meta.env.VITE_API_URL || '';
const isEnvHttp = envApiUrl.startsWith('http:');

const BASE = (isHttps && isEnvHttp) ? '/api' : (envApiUrl || '/api');

async function request(endpoint, method = 'GET', body = null) {
  // ── Demo Mode: intercept all API calls ──
  // Uses real fetch() via blob URLs so requests appear in the Network tab.
  if (DEMO_MODE) {
    const t0 = performance.now();
    const data = await demoRouter(endpoint, method, body);
    const elapsed = (performance.now() - t0).toFixed(1);

    // Make a real fetch to a blob URL so the request shows in Network tab
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    await fetch(blobUrl).then((r) => r.text()).catch(() => {});
    URL.revokeObjectURL(blobUrl);

    // Console log styled like a network request
    console.log(
      `%c[Demo API]%c ${method} /api${endpoint} %c${elapsed}ms%c → ${(json.length / 1024).toFixed(1)} KB`,
      'background:#7c3aed;color:white;padding:1px 6px;border-radius:3px;font-weight:bold',
      'color:#7c3aed;font-weight:bold',
      'color:#059669',
      'color:#6b7280'
    );

    return data;
  }

  const token = localStorage.getItem('fleet_token_val');
  const opts = {
    method,
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    credentials: 'include',
  };
  if (body) opts.body = JSON.stringify(body);

  // If BASE ends with /api, and endpoint starts with /, we might have double slash.
  // fetch handles this fine but let's be clean.
  const url = `${BASE.replace(/\/$/, '')}${endpoint}`;
  const res = await fetch(url, opts);
  const json = await res.json();

  if (!res.ok) {
    let errorMessage = json.message || 'Request failed';
    
    // Normalize validation errors from Zod into a readable string
    if (json.error?.type === 'validation error' && json.error?.details) {
       const details = Object.entries(json.error.details)
         .map(([field, msg]) => `${field.replace(/^body\./, '')}: ${msg}`)
         .join(', ');
       errorMessage = `${errorMessage} - ${details}`;
    }

    const err = new Error(errorMessage);
    err.status = res.status;
    err.details = json.error?.details;
    throw err;
  }
  return json;
}

// ─── Auth / Users ────────────────────────────────────────────
export const signup = (data) => request('/users/register', 'POST', data);
export const login  = (data) => request('/users/login', 'POST', data);
export const updateUser = (id, data) => request(`/users/${id}`, 'PATCH', data);
export const getUsers = () => request('/users');
export const createUser = (data) => request('/users/register', 'POST', data);
export const deleteUser = (id) => request(`/users/${id}`, 'DELETE');

// ─── Vehicles ────────────────────────────────────────
export const getVehicles    = (params = {})  => {
  const qs = new URLSearchParams(params).toString();
  return request(qs ? `/vehicles?${qs}` : '/vehicles');
};
export const createVehicle  = (data)      => request('/vehicles', 'POST', data);
export const updateVehicle  = (id, data)    => request(`/vehicles/${id}`, 'PATCH', data);
export const updateVehicleLocation = (id, data) => request(`/vehicles/${id}/location`, 'PUT', data);
export const deleteVehicle  = (id)        => request(`/vehicles/${id}`, 'DELETE');

// ─── Locations ───────────────────────────────────────
export const getLocationHistory = (params) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/locations/history?${qs}`);
};

// ─── Geofences ───────────────────────────────────────
export const getGeofences   = ()          => request('/geofences');
export const createGeofence = (data)      => request('/geofences', 'POST', data);
export const updateGeofence = (id, data)  => request(`/geofences/${id}`, 'PATCH', data);
export const deleteGeofence = (id)        => request(`/geofences/${id}`, 'DELETE');

// ─── Compliance ──────────────────────────────────────
export const getCompliances = (params) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/compliance?${qs}`);
};
export const createCompliance = (data) => request('/compliance', 'POST', data);
export const checkLiveFuelRate = (city = 'delhi') => request(`/compliance/fuel/live-rate?city=${encodeURIComponent(city)}`);

// ─── Export demo mode flag for other modules ─────────
export { DEMO_MODE };
