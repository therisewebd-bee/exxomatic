import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Simple multi-layer tile switcher.
 * Uses standard Leaflet TileLayer for reliable rendering at all zoom levels.
 * Old layer removed → new layer added instantly.
 */
export default function CachedTileLayer({ 
    layers,
    activeLayer,
    maxZoom = 19
}) {
    const map = useMap();
    const currentLayerRef = useRef(null);

    useEffect(() => {
        const config = layers[activeLayer];
        if (!config) return;

        // Remove old layer immediately
        if (currentLayerRef.current) {
            map.removeLayer(currentLayerRef.current);
            currentLayerRef.current = null;
        }

        // Use standard Leaflet TileLayer for proper rendering at all zoom levels
        const newLayer = L.tileLayer(config.url, {
            attribution: config.attribution,
            maxZoom,
            updateWhenZooming: true,
            updateWhenIdle: false,
            keepBuffer: 4,
        });

        newLayer.addTo(map);
        currentLayerRef.current = newLayer;

        return () => {
            if (currentLayerRef.current === newLayer) {
                map.removeLayer(newLayer);
                currentLayerRef.current = null;
            }
        };
    }, [map, activeLayer, layers, maxZoom]);

    return null;
}
