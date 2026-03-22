import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';

// Feature-complete drawing control for Geofences
export default function DrawControl({ active, onDrawComplete }) {
    const map = useMap();
    const drawnRef = useRef(null);
    const controlRef = useRef(null);

    useEffect(() => {
        if (!active) {
            if (controlRef.current) {
                try { map.removeControl(controlRef.current); } catch (e) {}
                controlRef.current = null;
            }
            if (drawnRef.current) {
                map.removeLayer(drawnRef.current);
                drawnRef.current = null;
            }
            return;
        }

        const drawnItems = new L.FeatureGroup();
        drawnRef.current = drawnItems;
        map.addLayer(drawnItems);

        const purpleStyle = { color: '#7C3AED', weight: 2, fillOpacity: 0.15, fillColor: '#7C3AED' };
        const drawControl = new L.Control.Draw({
            position: 'topleft',
            draw: {
                polygon: { allowIntersection: false, shapeOptions: purpleStyle },
                rectangle: { shapeOptions: purpleStyle },
                circle: { shapeOptions: purpleStyle },
                polyline: false, circlemarker: false, marker: false,
            },
            edit: { featureGroup: drawnItems, remove: {} }
        });
        controlRef.current = drawControl;
        map.addControl(drawControl);

        const onCreated = (e) => {
            drawnItems.clearLayers();
            drawnItems.addLayer(e.layer);

            let geometry;
            if (e.layerType === 'circle') {
                const center = e.layer.getLatLng();
                const radius = e.layer.getRadius();
                const steps = 64;
                const coords = [];
                for (let i = 0; i < steps; i++) {
                    const angle = (i / steps) * 2 * Math.PI;
                    const lat = center.lat + (radius / 111320) * Math.cos(angle);
                    const lng = center.lng + (radius / (111320 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);
                    coords.push([lng, lat]);
                }
                coords.push(coords[0]);
                geometry = { type: 'Polygon', coordinates: [coords] };
            } else {
                geometry = e.layer.toGeoJSON().geometry;
            }
            onDrawComplete?.(geometry);
        };

        map.on(L.Draw.Event.CREATED, onCreated);

        return () => {
            map.off(L.Draw.Event.CREATED, onCreated);
            if (controlRef.current) {
                try { map.removeControl(controlRef.current); } catch (e) {}
                controlRef.current = null;
            }
            if (drawnRef.current) {
                map.removeLayer(drawnRef.current);
                drawnRef.current = null;
            }
        };
    }, [active, map, onDrawComplete]);

    return null;
}
