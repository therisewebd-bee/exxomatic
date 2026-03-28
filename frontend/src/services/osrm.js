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
 * Takes an array of raw GPS logs { lat, lng, timestamp, speed, ... }
 * Returns a high-resolution array of road-snapped points with interpolated timestamps.
 */
export async function snapToRoads(rawLogs) {
  if (!rawLogs || rawLogs.length < 2) return rawLogs;

  const chunks = [];
  for (let i = 0; i < rawLogs.length; i += MAX_COORDS_PER_REQUEST - 1) {
    const chunk = rawLogs.slice(i, i + MAX_COORDS_PER_REQUEST);
    if (chunk.length >= 2) chunks.push({ chunk, index: i });
  }

  // Fetch all chunks in parallel for maximum speed
  const promises = chunks.map(async ({ chunk, index }) => {
    const coordsString = chunk.map(p => `${p.lng},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/match/v1/driving/${coordsString}?overview=full&geometries=geojson&gaps=ignore`;

    const fallbackResult = () => {
      const res = [];
      for (let j = (index === 0 ? 0 : 1); j < chunk.length; j++) {
        res.push(chunk[j]);
      }
      return res;
    };

    try {
      const res = await fetch(url);
      if (!res.ok) return fallbackResult();
      
      const data = await res.json();
      if (data.code !== 'Ok' || !data.matchings || !data.tracepoints) {
        return fallbackResult();
      }

      const segmentLogs = [];
      if (index === 0) {
        segmentLogs.push({ ...chunk[0] });
      }

      const startTime = new Date(chunk[0].timestamp).getTime();
      const endTime = new Date(chunk[chunk.length - 1].timestamp).getTime();
      const timeDiff = endTime - startTime;

      data.matchings.forEach((match) => {
        const geom = match.geometry.coordinates;
        const numPoints = geom.length;
        
        geom.forEach((coord, gIdx) => {
            if (index === 0 && gIdx === 0) return;
            if (index > 0 && gIdx === 0) return;

            const fraction = gIdx / (numPoints - 1 || 1);
            const interpolatedTime = Math.round(startTime + (timeDiff * fraction));
            
            segmentLogs.push({
                lat: coord[1],
                lng: coord[0],
                timestamp: new Date(interpolatedTime).toISOString(),
                speed: chunk[0].speed,
                ignition: chunk[0].ignition
            });
        });
      });

      return segmentLogs;
    } catch (err) {
      console.warn('OSRM Map Matching failed for a chunk, falling back to raw path', err);
      return fallbackResult();
    }
  });

  // Await all parallel requests and combine in order
  const results = await Promise.all(promises);
  return results.flat();
}
