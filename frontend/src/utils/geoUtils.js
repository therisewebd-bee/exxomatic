/**
 * Mathematical Geography Utilities
 */

/**
 * Calculates distance between two points in KM using the Haversine formula.
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Helper to calculate a destination coordinate based on distance and bearing.
 * Used for drawing circles as polygons.
 */
export function turf_destination(center, radius, angleDeg) {
    const angle = angleDeg * Math.PI / 180;
    const lat = center.lat + (radius / 111320) * Math.cos(angle);
    const lng = center.lng + (radius / (111320 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);
    return { lat, lng };
}
/**
 * Calculates speed in km/h between two points.
 */
export function calculateSpeed(p1, p2) {
    if (!p1 || !p2) return 0;
    const dist = getDistanceFromLatLonInKm(p1.lat, p1.lng, p2.lat, p2.lng);
    const ms = new Date(p2.timestamp).getTime() - new Date(p1.timestamp).getTime();
    if (ms <= 0) return 0;
    const hours = ms / 3600000;
    return dist / hours;
}

/**
 * Enriches an array of location logs with derived speed and motion status.
 * Logs MUST be sorted chronologically (oldest first) for accurate speed derivation.
 */
export function enrichLocationHistory(logs) {
    return logs.map((loc, i) => {
        let speed = Number(loc.speed || 0);
        
        // Derive speed if 0 but moving
        if (speed <= 1 && i < logs.length - 1) {
            const next = logs[i + 1];
            const dist = getDistanceFromLatLonInKm(loc.lat, loc.lng, next.lat, next.lng);
            if (dist > 0.01) {
                const ms = new Date(next.timestamp).getTime() - new Date(loc.timestamp).getTime();
                const hours = ms / 3600000;
                if (hours > 0) speed = dist / hours;
            }
        }
        
        const motionStatus = speed > 3 ? 'moving' : (loc.ignition === true ? 'idle' : 'stopped');
        return { ...loc, motionStatus, speed };
    });
}
