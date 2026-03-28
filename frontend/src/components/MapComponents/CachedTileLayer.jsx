import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCachedTile, cacheTile } from '../../services/tileCache';

/**
 * Single-active-layer tile component with smooth handoff.
 * Only ONE layer loads tiles at a time (avoids Google rate-limiting).
 * On switch: new layer is added on top → old layer removed after load.
 */
export default function CachedTileLayer({ 
    layers,       // { osm: { url, attribution }, google: {...}, googleSat: {...} }
    activeLayer,  // 'osm' | 'google' | 'googleSat'
    maxZoom = 19
}) {
    const map = useMap();
    const currentLayerRef = useRef(null);
    const currentIdRef = useRef(null);

    useEffect(() => {
        const config = layers[activeLayer];
        if (!config) return;

        const cacheId = btoa(config.url).slice(0, 10);

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
                                // Direct load fallback (skip cache)
                                tile.src = urlVal;
                                tile.onload = () => done(null, tile);
                                tile.onerror = () => done(null, tile);
                            });
                    }
                });

                return tile;
            }
        });

        const newLayer = new CachingTileLayer(config.url, {
            attribution: config.attribution,
            maxZoom,
        });

        // Keep ref to old layer so we can remove it after new one loads
        const oldLayer = currentLayerRef.current;

        // Add new layer on top
        newLayer.addTo(map);
        currentLayerRef.current = newLayer;
        currentIdRef.current = activeLayer;

        // Remove old layer after a short delay (lets new tiles appear first)
        if (oldLayer) {
            const removeTimer = setTimeout(() => {
                try { map.removeLayer(oldLayer); } catch(e) {}
            }, 600);

            return () => clearTimeout(removeTimer);
        }
    }, [map, activeLayer, layers, maxZoom]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (currentLayerRef.current) {
                try { map.removeLayer(currentLayerRef.current); } catch(e) {}
            }
        };
    }, [map]);

    return null;
}
