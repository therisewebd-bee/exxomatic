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
