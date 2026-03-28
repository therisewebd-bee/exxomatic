import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCachedTile, cacheTile } from '../../services/tileCache';

/**
 * Multi-layer cached tile component.
 * All layers are mounted simultaneously; only the active one is visible (opacity 1).
 * Inactive layers stay at opacity 0 but remain in memory so switching is instant.
 * Tiles are cached in IndexedDB for offline/repeat use.
 */
export default function CachedTileLayer({ 
    layers,       // { osm: { url, attribution }, google: {...}, googleSat: {...} }
    activeLayer,  // 'osm' | 'google' | 'googleSat'
    maxZoom = 19
}) {
    const map = useMap();
    const layerRefs = useRef({});

    // Mount all layers once on first render
    useEffect(() => {
        const CachingTileLayer = L.TileLayer.extend({
            createTile(coords, done) {
                const tile = document.createElement('img');
                tile.alt = '';
                tile.setAttribute('role', 'presentation');

                const urlVal = this.getTileUrl(coords);
                const baseUrl = this.options._cacheId || '';
                const key = `${coords.z}_${coords.x}_${coords.y}_${baseUrl}`;

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

        // Create a layer for each map source
        Object.entries(layers).forEach(([id, config]) => {
            const layer = new CachingTileLayer(config.url, {
                attribution: config.attribution,
                maxZoom,
                _cacheId: btoa(config.url).slice(0, 10),
            });
            layer.setOpacity(0);
            layer.addTo(map);
            layerRefs.current[id] = layer;
        });

        return () => {
            Object.values(layerRefs.current).forEach(l => {
                map.removeLayer(l);
            });
            layerRefs.current = {};
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    // Toggle opacity when activeLayer changes — smooth CSS crossfade
    useEffect(() => {
        Object.entries(layerRefs.current).forEach(([id, layer]) => {
            const container = layer.getContainer?.();
            if (container) {
                container.style.transition = 'opacity 0.35s ease-in-out';
            }
            layer.setOpacity(id === activeLayer ? 1 : 0);
        });
    }, [activeLayer]);

    return null;
}
