// Force relative path on HTTPS to leverage Netlify proxy and avoid Mixed Content blocks
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const envApiUrl = import.meta.env.VITE_API_URL || '';
const isEnvHttp = envApiUrl.startsWith('http:');

const BASE = (isHttps && isEnvHttp) ? '/api' : (envApiUrl || '/api');

async function request(endpoint, method = 'GET', body = null) {
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
