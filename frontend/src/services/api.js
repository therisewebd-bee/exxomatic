// ─── Demo Mode ──────────────────────────────────────────────
// When VITE_API_URL is not set, all API calls route to the local demoStore.
// When the real API is unreachable, we automatically fall back to demo mode.
import * as demo from './demoStore';

let DEMO_MODE = !import.meta.env.VITE_API_URL;

// Track if the real API has ever failed — once it does, stay in demo mode
let _apiFailed = false;

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

/**
 * Serves a demo response with styled console logging.
 */
async function serveDemoResponse(endpoint, method, body) {
  const t0 = performance.now();
  const data = await demoRouter(endpoint, method, body);
  const elapsed = (performance.now() - t0).toFixed(1);
  const json = JSON.stringify(data);

  console.log(
    `%c[Demo API]%c ${method} /api${endpoint} %c${elapsed}ms%c → ${(json.length / 1024).toFixed(1)} KB`,
    'background:#7c3aed;color:white;padding:1px 6px;border-radius:3px;font-weight:bold',
    'color:#7c3aed;font-weight:bold',
    'color:#059669',
    'color:#6b7280'
  );

  return data;
}

// Force relative path on HTTPS to leverage Netlify proxy and avoid Mixed Content blocks
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const envApiUrl = import.meta.env.VITE_API_URL || '';
const isEnvHttp = envApiUrl.startsWith('http:');

const BASE = (isHttps && isEnvHttp) ? '/api' : (envApiUrl || '/api');

async function request(endpoint, method = 'GET', body = null) {
  // ── If already in demo mode (explicit or auto-detected), use demo directly ──
  if (DEMO_MODE || _apiFailed) {
    return serveDemoResponse(endpoint, method, body);
  }

  // ── Try the real API first ──
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

  const url = `${BASE.replace(/\/$/, '')}${endpoint}`;

  try {
    const res = await fetch(url, opts);

    // Detect if we got HTML back instead of JSON (Netlify serving SPA fallback for /api routes)
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      console.warn(`[API] Got HTML instead of JSON for ${method} ${url} — switching to demo mode`);
      _apiFailed = true;
      return serveDemoResponse(endpoint, method, body);
    }

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
  } catch (err) {
    // Network error, CORS error, or JSON parse failure → backend is unreachable
    if (err.status) throw err; // Re-throw real API errors (4xx from the actual backend)

    console.warn(`[API] Backend unreachable for ${method} ${url} — falling back to demo mode`);
    _apiFailed = true;
    return serveDemoResponse(endpoint, method, body);
  }
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
