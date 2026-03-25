import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { sendViewport } from '../../services/websocket';

// Helper to track map bounds and sync with backend
export default function BoundsTracker({ onBoundsChange }) {
    const map = useMap();
    const debounceTimer = useRef(null);
    const lastSent = useRef(null);
    const mountedRef = useRef(false);

    useEffect(() => {
        if (!map) return;

        const computeBounds = () => {
            const b = map.getBounds();
            const sw = b.getSouthWest();
            const ne = b.getNorthEast();
            const zoom = map.getZoom();
            return { swLat: sw.lat, swLng: sw.lng, neLat: ne.lat, neLng: ne.lng, zoom };
        };

        const commitBounds = (newBounds) => {
            const prev = lastSent.current;
            if (prev) {
                const dLat = Math.abs(prev.swLat - newBounds.swLat) + Math.abs(prev.neLat - newBounds.neLat);
                const dLng = Math.abs(prev.swLng - newBounds.swLng) + Math.abs(prev.neLng - newBounds.neLng);
                if (prev.zoom === newBounds.zoom && dLat + dLng < 0.01) return;
            }
            lastSent.current = newBounds;
            onBoundsChange(newBounds);
        };

        const onMapMove = () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                commitBounds(computeBounds());
            }, 300);
        };

        map.on('moveend', onMapMove);

        if (!mountedRef.current) {
            mountedRef.current = true;
            const initTimer = setTimeout(() => {
                commitBounds(computeBounds());
            }, 100);
            return () => {
                clearTimeout(initTimer);
                map.off('moveend', onMapMove);
                if (debounceTimer.current) clearTimeout(debounceTimer.current);
            };
        }

        return () => {
            map.off('moveend', onMapMove);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [map, onBoundsChange]);

    return null;
}
