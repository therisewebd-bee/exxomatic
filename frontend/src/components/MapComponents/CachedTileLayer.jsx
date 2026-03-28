import { useEffect, useRef, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCachedTile, cacheTile } from '../../services/tileCache';

/**
 * Multi-layer cached tile component with smooth crossfade.
 * 
 * All layers are mounted with full opacity but stacked via z-index.
 * The active layer sits on top (z-index: 2), inactive layers sit below (z-index: 1).
 * This ensures Leaflet loads tiles for ALL layers at EVERY zoom level,
 * so switching is always instant with no re-loading.
 */
export default function CachedTileLayer({ 
    layers,       // { osm: { url, attribution }, google: {...}, googleSat: {...} }
    activeLayer,  // 'osm' | 'google' | 'googleSat'
    maxZoom = 19
}) {
    const map = useMap();
    const layerRefs = useRef({});
    const mountedRef = useRef(false);

    // Build a caching tile layer class once
    const createCachingLayer = useCallback((url, attribution, cacheId) => {
        const CachingTileLayer = L.TileLayer.extend({
            createTile(coords, done) {
                const tile = document.createElement('img');
                tile.alt = '';
                tile.setAttribute('role', 'presentation');

                const urlVal = this.getTileUrl(coords);
                const key = `${coords.z}_${coords.x}_${coords.y}_${cacheId}`;

                getCachedTile(key).then((blob) => {
                    if (blob) {
                        tile.src = URL.createObjectURL(blob);
                        done(null, tile);
                    } else {
                        fetch(urlVal)
                            .then(res => res.blob())
                            .then(fetchedBlob => {
                                cacheTile(key, fetchedBlob);
                                tile.src = URL.createObjectURL(fetchedBlob);
                                done(null, tile);
                            })
                            .catch(() => {
                                tile.src = urlVal;
                                done(null, tile);
                            });
                    }
                });

                return tile;
            }
        });

        return new CachingTileLayer(url, { attribution, maxZoom });
    }, [maxZoom]);

    // Mount all layers once
    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        Object.entries(layers).forEach(([id, config]) => {
            const cacheId = btoa(config.url).slice(0, 10);
            const layer = createCachingLayer(config.url, config.attribution, cacheId);
            layer.addTo(map);
            layerRefs.current[id] = layer;
        });

        return () => {
            Object.values(layerRefs.current).forEach(l => map.removeLayer(l));
            layerRefs.current = {};
            mountedRef.current = false;
        };
    }, [map, layers, createCachingLayer]);

    // Toggle active layer using z-index stacking (all layers keep opacity 1)
    useEffect(() => {
        // Small delay to ensure containers exist after first mount
        const timer = setTimeout(() => {
            Object.entries(layerRefs.current).forEach(([id, layer]) => {
                const container = layer.getContainer?.();
                if (container) {
                    if (id === activeLayer) {
                        container.style.zIndex = '2';
                        container.style.opacity = '1';
                        container.style.pointerEvents = 'auto';
                    } else {
                        container.style.zIndex = '1';
                        container.style.opacity = '0';
                        container.style.pointerEvents = 'none';
                    }
                    container.style.transition = 'opacity 0.3s ease';
                }
            });
        }, 50);

        return () => clearTimeout(timer);
    }, [activeLayer]);

    return null;
}
