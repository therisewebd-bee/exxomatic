import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCachedTile, cacheTile } from '../../services/tileCache';

/**
 * Single-layer tile component with IndexedDB caching.
 * On layer switch: old layer is removed immediately, new layer is rendered fresh.
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

        newLayer.addTo(map);
        currentLayerRef.current = newLayer;

        // Force Leaflet to immediately load all visible tiles — no zoom needed
        map.invalidateSize();
        newLayer.redraw();

        return () => {
            if (currentLayerRef.current === newLayer) {
                map.removeLayer(newLayer);
                currentLayerRef.current = null;
            }
        };
    }, [map, activeLayer, layers, maxZoom]);

    return null;
}
