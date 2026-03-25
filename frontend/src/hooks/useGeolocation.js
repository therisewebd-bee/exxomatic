import { useState, useEffect, useRef } from 'react';

/**
 * useGeolocation — Detects user's location via browser GPS or IP fallback
 * Returns [lat, lng] and a flyTo function for the map
 * 
 * Usage:
 *   const { center, flyToUser } = useGeolocation(mapRef);
 */
export function useGeolocation(mapRef) {
  const DEFAULT_CENTER = [20.5937, 78.9629]; // India center
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const detected = useRef(false);

  useEffect(() => {
    if (detected.current) return;
    detected.current = true;

    const applyLocation = (lat, lng) => {
      const loc = [lat, lng];
      setCenter(loc);
      mapRef?.current?.flyTo(loc, 12, { duration: 1.5 });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => applyLocation(pos.coords.latitude, pos.coords.longitude),
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.latitude && data.longitude) {
              applyLocation(data.latitude, data.longitude);
            }
          } catch { /* Use default */ }
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    } else {
      fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            applyLocation(data.latitude, data.longitude);
          }
        })
        .catch(() => {});
    }
  }, []);

  const flyToUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setCenter(loc);
          mapRef?.current?.flyTo(loc, 14, { duration: 1 });
        },
        () => {},
        { timeout: 5000 }
      );
    }
  };

  return { center, flyToUser };
}
