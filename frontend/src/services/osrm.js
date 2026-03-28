/**
 * OSRM (Open Source Routing Machine) Service
 * Provides Map Matching to snap raw GPS coordinates to actual road networks.
 */

// OSRM Match API allows max 100 coordinates per request
const MAX_COORDS_PER_REQUEST = 90; 

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

  const snappedLogs = [];
  
  // Process in chunks of MAX_COORDS_PER_REQUEST to avoid URI limits and OSRM limits
  for (let i = 0; i < rawLogs.length; i += MAX_COORDS_PER_REQUEST - 1) {
    const chunk = rawLogs.slice(i, i + MAX_COORDS_PER_REQUEST);
    if (chunk.length < 2) break;

    // OSRM expects: lng,lat;lng,lat...
    const coordsString = chunk.map(p => `${p.lng},${p.lat}`).join(';');
    
    // geometries=geojson gives an array of [lng, lat]
    // annotations=nodes,distance,duration,datasources,weight,speed
    // However, match API returns tracepoints that map to geometries
    const url = `https://router.project-osrm.org/match/v1/driving/${coordsString}?overview=full&geometries=geojson&gaps=ignore`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('OSRM Match API failed');
      
      const data = await res.json();
      if (data.code !== 'Ok' || !data.matchings || !data.tracepoints) {
        // Fallback to raw: push raw chunk
        if (i === 0) snappedLogs.push(chunk[0]);
        for (let j = 1; j < chunk.length; j++) {
            snappedLogs.push(chunk[j]);
        }
        continue;
      }

      // We have successful matchings.
      let currentInputIndex = 0;
      let lastTime = new Date(chunk[0].timestamp).getTime();
      let lastRawPoint = chunk[0];
      
      if (i === 0) {
        snappedLogs.push({ ...chunk[0] }); // Push first point
      }

      // Iterate over matchings
      data.matchings.forEach((match) => {
        const geom = match.geometry.coordinates; // Array of [lng, lat]
        
        // Find which tracepoints belong to this matching
        // matchings have legs. The geometry covers the entire matching.
        // tracepoints arrays map 1:1 with input chunk
        
        // Simple linear interpolation of timestamps across the geometry
        // Since matching geometry is high-res, we just evenly distribute time
        // between the starting tracepoint and ending tracepoint of the leg
        
        // This is a simplified interpolation: we spread the time interval of the chunk 
        // across all geometry coordinates.
        const startTime = new Date(chunk[0].timestamp).getTime();
        const endTime = new Date(chunk[chunk.length - 1].timestamp).getTime();
        const timeDiff = endTime - startTime;
        
        const numPoints = geom.length;
        
        geom.forEach((coord, gIdx) => {
            // Skip the very first point of the very first chunk as it's already pushed
            if (i === 0 && gIdx === 0) return;
            // Skip the first point of subsequent chunks (to avoid duplicates from overlap)
            if (i > 0 && gIdx === 0) return;

            const fraction = gIdx / (numPoints - 1 || 1);
            const interpolatedTime = Math.round(startTime + (timeDiff * fraction));
            
            snappedLogs.push({
                lat: coord[1],
                lng: coord[0],
                timestamp: new Date(interpolatedTime).toISOString(),
                speed: chunk[0].speed, // Approximate propagation
                ignition: chunk[0].ignition
            });
        });
      });

    } catch (err) {
      console.warn('OSRM Map Matching failed, falling back to raw path', err);
      // Push raw chunk as fallback (skipping overlap duplicate)
      for (let j = (i === 0 ? 0 : 1); j < chunk.length; j++) {
        snappedLogs.push(chunk[j]);
      }
    }
  }

  return snappedLogs;
}
