import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCachedTile, cacheTile } from '../../services/tileCache';

// Custom TileLayer that caches tiles in IndexedDB
export default function CachedTileLayer({ 
    url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom = 19
}) {
    const map = useMap();

    useEffect(() => {
        const CachingTileLayer = L.TileLayer.extend({
            createTile(coords, done) {
                const tile = document.createElement('img');
                tile.alt = '';
                tile.setAttribute('role', 'presentation');

                const urlVal = this.getTileUrl(coords);
                const key = `${coords.z}_${coords.x}_${coords.y}_${btoa(url).slice(0,10)}`; // cache key bound to url

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

        const layer = new CachingTileLayer(url, {
            attribution: attribution,
            maxZoom: maxZoom,
        });
        layer.addTo(map);

        return () => { map.removeLayer(layer); };
    }, [map, url, attribution, maxZoom]);

    return null;
}
