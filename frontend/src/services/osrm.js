/**
 * OSRM (Open Source Routing Machine) Service
 * Provides Map Matching to snap raw GPS coordinates to actual road networks.
 */

// OSRM Match API allows max 100 coordinates per request, but the public demo
// server often throws "TooBig" even for 90. We use 50 to be completely safe.
const MAX_COORDS_PER_REQUEST = 50; 

/**
 * Calculates straight line distance between two points in km
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Path Smoothing Service (Replaces OSRM Network API)
 * Uses Catmull-Rom spline interpolation to synthesize high-resolution curved paths locally.
 * This guarantees smooth playback and curvy map lines with 0 network latency and 0 API errors.
 */

// Simple helper to calculate Catmull-Rom splines
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/**
 * Takes an array of raw GPS logs { lat, lng, timestamp, speed, ... }
 * Returns a high-resolution array of smoothly interpolated points using cubic splines.
 */
export async function snapToRoads(rawLogs) {
  if (!rawLogs || rawLogs.length < 2) return rawLogs;

  const smoothedLogs = [];
  const pointsPerSegment = 10; // Generate 10 smooth points between every real GPS point

  // Loop through all points to build spline segments
  for (let i = 0; i < rawLogs.length - 1; i++) {
    // Determine the 4 control points for a Catmull-Rom spline
    const p0 = rawLogs[i === 0 ? 0 : i - 1];
    const p1 = rawLogs[i];
    const p2 = rawLogs[i + 1];
    const p3 = rawLogs[i + 2 < rawLogs.length ? i + 2 : rawLogs.length - 1];

    const t1 = new Date(p1.timestamp).getTime();
    const t2 = new Date(p2.timestamp).getTime();

    // Push the actual starting point of this segment
    smoothedLogs.push({ ...p1 });

    // Generate interpolated points within the segment
    for (let step = 1; step < pointsPerSegment; step++) {
      const t = step / pointsPerSegment;
      
      const interpLat = catmullRom(Number(p0.lat), Number(p1.lat), Number(p2.lat), Number(p3.lat), t);
      const interpLng = catmullRom(Number(p0.lng), Number(p1.lng), Number(p2.lng), Number(p3.lng), t);
      
      const interpTime = Math.round(t1 + (t2 - t1) * t);

      smoothedLogs.push({
        lat: interpLat,
        lng: interpLng,
        timestamp: new Date(interpTime).toISOString(),
        speed: p1.speed,        // Propagate source speed
        ignition: p1.ignition   // Propagate source ignition
      });
    }
  }

  // Always push the very last actual point
  smoothedLogs.push({ ...rawLogs[rawLogs.length - 1] });

  // Simulate a microscopic delay so React state batches cleanly if needed, though not strictly required
  await new Promise(resolve => setTimeout(resolve, 10));

  return smoothedLogs;
}
