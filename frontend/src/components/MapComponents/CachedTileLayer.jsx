import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCachedTile, cacheTile } from '../../services/tileCache';

// Define the custom Cached TileLayer class extending Leaflet's L.TileLayer
L.TileLayer.Cached = L.TileLayer.extend({
    createTile: function (coords, done) {
        const tile = document.createElement('img');
        
        L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
        L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));

        if (this.options.crossOrigin || this.options.crossOrigin === '') {
            tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
        }

        tile.alt = '';
        tile.setAttribute('role', 'presentation');

        const url = this.getTileUrl(coords);

        getCachedTile(url).then(cachedBlob => {
            if (cachedBlob) {
                // If found in IndexedDB, use standard Object URL
                tile.src = URL.createObjectURL(cachedBlob);
            } else {
                // Not cached, fetch from network
                fetch(url, { mode: 'cors' })
                    .then(response => {
                        if (!response.ok) throw new Error('Network response not ok');
                        return response.blob();
                    })
                    .then(blob => {
                        cacheTile(url, blob);
                        tile.src = URL.createObjectURL(blob);
                    })
                    .catch(() => {
                        // Fallback to standard network load if fetch fails (e.g. CORS issues)
                        tile.removeAttribute('crossOrigin');
                        tile.src = url;
                    });
            }
        });

        return tile;
    }
});

L.tileLayer.cached = function (url, options) {
    return new L.TileLayer.Cached(url, options);
};

/**
 * Multi-layer tile switcher utilizing IndexedDB caching.
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

        // Use our custom cached TileLayer implementation
        const newLayer = L.tileLayer.cached(config.url, {
            attribution: config.attribution,
            maxZoom,
            updateWhenZooming: true,
            updateWhenIdle: false,
            keepBuffer: 4,
            crossOrigin: true
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
