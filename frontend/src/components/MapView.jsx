import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
// Pre-declare `type` to prevent "assignment to undeclared variable" in leaflet-draw strict mode
if (typeof window !== 'undefined' && !('type' in window)) {
    window.type = '';
}
import 'leaflet-draw';
import { MdLayers, MdAssessment, MdClose, MdHistory } from 'react-icons/md';
import { useHistory } from '../context/HistoryContext';
import { getLocationHistory } from '../services/api';
import { useGeofencesQuery, useCreateVehicleMutation } from '../hooks/useQueries';
import { getCachedTile, cacheTile } from '../services/tileCache';
import { sendViewport } from '../services/websocket';
import { getDistanceFromLatLonInKm, turf_destination } from '../utils/geoUtils';
import { useGeolocation } from '../hooks/useGeolocation';
import AddressCell from './AddressCell';
import PlaybackControls from './PlaybackControls';
import HistoryDataOverlay from './HistoryDataOverlay';


// Custom TileLayer that caches tiles in IndexedDB
function CachedTileLayer() {
    const map = useMap();

    useEffect(() => {
        const CachingTileLayer = L.TileLayer.extend({
            createTile(coords, done) {
                const tile = document.createElement('img');
                tile.alt = '';
                tile.setAttribute('role', 'presentation');

                const url = this.getTileUrl(coords);
                const key = `${coords.z}_${coords.x}_${coords.y}`;

                getCachedTile(key).then((blob) => {
                    if (blob) {
                        tile.src = URL.createObjectURL(blob);
                        done(null, tile);
                    } else {
                        fetch(url)
                            .then(res => res.blob())
                            .then(fetchedBlob => {
                                cacheTile(key, fetchedBlob);
                                tile.src = URL.createObjectURL(fetchedBlob);
                                done(null, tile);
                            })
                            .catch(() => {
                                tile.src = url;
                                done(null, tile);
                            });
                    }
                });

                return tile;
            }
        });

        const layer = new CachingTileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        });
        layer.addTo(map);

        return () => { map.removeLayer(layer); };
    }, [map]);

    return null;
}

// Fix default marker icon issue in Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored vehicle marker icons
function createVehicleIcon(status, isAlert = false) {
    const colors = {
        moving: '#22C55E', // Green
        stopped: '#64748B', // Slate Gray (Was Red, caused confusion with alerts)
        idle: '#F59E0B',    // Amber
    };
    const color = isAlert ? '#EF4444' : (colors[status] || '#7C3AED');

    return L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
      <div style="
        width: 32px; height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: ${isAlert ? '0 0 20px 5px #EF4444' : '0 2px 8px rgba(0,0,0,0.3)'};
        display: flex; align-items: center; justify-content: center;
        ${isAlert ? 'animation: alertPulse 0.8s infinite;' : ''}
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
      <style>
        @keyframes alertPulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.9); transform: scale(1); }
            50% { box-shadow: 0 0 25px 15px rgba(239, 68, 68, 0); transform: scale(1.15); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); transform: scale(1); }
        }
      </style>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
    });
}

// Highlighted marker (when selected)
function createSelectedIcon(status, isAlert = false) {
    const colors = {
        moving: '#22C55E',
        stopped: '#EF4444',
        idle: '#F59E0B',
    };
    const color = isAlert ? '#EF4444' : (colors[status] || '#7C3AED');

    return L.divIcon({
        className: 'custom-vehicle-marker-selected',
        html: `
      <div style="
        width: 42px; height: 42px;
        background: ${color};
        border: 4px solid #7C3AED;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(124,58,237,0.3), 0 4px 12px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
        animation: pulse 1.5s ease-in-out infinite ${isAlert ? ', alertPulse 1s infinite' : ''};
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -24],
    });
}

// Highlighted marker (playback or focused)
function createFocusIcon(status, isAlert = false, colorOverride = null) {
    const colors = {
        moving: '#22C55E',
        stopped: '#64748B',
        idle: '#F59E0B',
    };
    const color = colorOverride || (isAlert ? '#EF4444' : (colors[status] || '#7C3AED'));

    return L.divIcon({
        className: 'custom-vehicle-marker-focus',
        html: `
      <div style="
        width: 38px; height: 38px;
        background: ${color};
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
        ${isAlert ? 'animation: alertPulse 0.8s infinite;' : ''}
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
    });
}

function createUnknownIcon() {
    return L.divIcon({
        className: 'unknown-device-marker',
        html: `
      <div style="
        width: 32px; height: 32px;
        background: #EF4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 12px rgba(239,68,68,0.6);
        display: flex; align-items: center; justify-content: center;
        animation: unknownPulse 1s ease-in-out infinite;
      ">
        <span style="color:white; font-size:16px; font-weight:bold;">?</span>
      </div>
      <style>
        @keyframes unknownPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(239,68,68,0.6); }
          50% { box-shadow: 0 0 24px rgba(239,68,68,0.9); }
        }
      </style>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
    });
}

const statusLabels = {
    moving: 'Moving',
    stopped: 'Stopped',
    idle: 'Idle',
};

const statusColors = {
    moving: '#22C55E',
    stopped: '#64748B',
    idle: '#F59E0B',
};


// Component to fly to selected vehicle
function FlyToVehicle({ selectedVehicle }) {
    const map = useMap();
    const lastId = useRef(null);

    useEffect(() => {
        if (selectedVehicle) {
            const lat = Number(selectedVehicle.lat);
            const lng = Number(selectedVehicle.lng);
            
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                if (selectedVehicle.id !== lastId.current) {
                    // Use a slight timeout to ensure map is ready and avoid synchronous feedback during render
                    const timer = setTimeout(() => {
                        map.flyTo([lat, lng], 16, { duration: 1.5 });
                        lastId.current = selectedVehicle.id;
                    }, 100);
                    return () => clearTimeout(timer);
                }
            }
        } else {
            lastId.current = null;
        }
    }, [selectedVehicle?.id, selectedVehicle?.lat, selectedVehicle?.lng, map]);
    return null;
}


// Leaflet.draw integration component — full-featured
function DrawControl({ active, onDrawComplete }) {
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

        // 1. Setup Layer
        const drawnItems = new L.FeatureGroup();
        drawnRef.current = drawnItems;
        map.addLayer(drawnItems);

        // 2. Setup Control
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

        // 3. Setup Events
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

// ... previous logic
// Patch Leaflet to suppress 'touchleave' warning from third-party plugins (like leaflet-draw)
if (typeof L !== 'undefined' && L.DomEvent) {
    const originalOn = L.DomEvent.on;
    L.DomEvent.on = function(obj, types, fn, context) {
        if (typeof types === 'string' && types.includes('touchleave')) {
            const newTypes = types.split(' ').filter(t => t !== 'touchleave').join(' ');
            if (!newTypes) return L.DomEvent;
            return originalOn.call(L.DomEvent, obj, newTypes, fn, context);
        }
        return originalOn.apply(L.DomEvent, arguments);
    };
}

// Helper to track map bounds and sync with backend
function BoundsTracker({ onBoundsChange }) {
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
            // Dedup: skip if bounds haven't moved meaningfully
            const prev = lastSent.current;
            if (prev) {
                const dLat = Math.abs(prev.swLat - newBounds.swLat) + Math.abs(prev.neLat - newBounds.neLat);
                const dLng = Math.abs(prev.swLng - newBounds.swLng) + Math.abs(prev.neLng - newBounds.neLng);
                if (prev.zoom === newBounds.zoom && dLat + dLng < 0.01) return;
            }
            lastSent.current = newBounds;
            onBoundsChange(newBounds);
            sendViewport(newBounds);
        };

        const onMapMove = () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                commitBounds(computeBounds());
            }, 300);
        };

        map.on('moveend', onMapMove);

        // Delayed initial bounds — wait for map to fully render and settle
        if (!mountedRef.current) {
            mountedRef.current = true;
            const initTimer = setTimeout(() => {
                commitBounds(computeBounds());
            }, 600);
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

export default function MapView({ vehicles, selectedVehicle, onSelectVehicle, livePositions = {}, unknownDevices = {}, onDrawComplete, isAdmin, onViewportChange }) {
    const mapRef = useRef(null);
    const [geofencePolygons, setGeofencePolygons] = useState([]);
    const { fetchVehicleHistory, getHistory } = useHistory();
    const [showHistoryData, setShowHistoryData] = useState(false);

    // Auto-detect user location via browser GPS or IP fallback
    const { center } = useGeolocation(mapRef);

    
    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackIndex, setPlaybackIndex] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const playbackTimer = useRef(null);

    const historyPath = selectedVehicle ? getHistory(selectedVehicle.imei) : [];

    // History path sanitation - more resilient to string types from API
    const validHistoryPath = useMemo(() => {
        return (historyPath || []).filter(loc => {
            const lat = Number(loc?.lat);
            const lng = Number(loc?.lng);
            return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        });
    }, [historyPath]);

    // Interpolated playback position
    const playbackPos = useMemo(() => {
        if (validHistoryPath.length === 0) return null;
        const idx = Math.floor(playbackIndex);
        const nextIdx = Math.min(idx + 1, validHistoryPath.length - 1);
        const fraction = playbackIndex - idx;

        const p1 = validHistoryPath[idx];
        const p2 = validHistoryPath[nextIdx];

        if (!p1 || !p2) return p1 ? [Number(p1.lat), Number(p1.lng)] : null;
        
        // Linear interpolation between the two points
        return [
            Number(p1.lat) + (Number(p2.lat) - Number(p1.lat)) * fraction,
            Number(p1.lng) + (Number(p2.lng) - Number(p1.lng)) * fraction
        ];
    }, [validHistoryPath, playbackIndex]);
    
    // Playback logic - Smooth interpolation using requestAnimationFrame
    useEffect(() => {
        if (isPlaying && validHistoryPath.length > 1) {
            let lastTime = performance.now();
            let frameId;

            const step = (now) => {
                const dt = now - lastTime;
                lastTime = now;

                // Advance playback by 1 index unit per second at 1x speed
                // This makes the transition between points last 1s at 1x speed
                const deltaIndex = (dt / 1000) * playbackSpeed;

                setPlaybackIndex(prev => {
                    const next = prev + deltaIndex;
                    if (next >= validHistoryPath.length - 1) {
                        setIsPlaying(false);
                        return validHistoryPath.length - 1;
                    }
                    return next;
                });

                frameId = requestAnimationFrame(step);
            };

            frameId = requestAnimationFrame(step);
            return () => cancelAnimationFrame(frameId);
        }
    }, [isPlaying, validHistoryPath, playbackSpeed]);


    // Reset playback when vehicle or history changes
    useEffect(() => {
        setPlaybackIndex(0);
        setIsPlaying(false);
    }, [selectedVehicle?.imei, historyPath.length]);

    const unknownIcon = useRef(createUnknownIcon()).current;


    const { data: globalGeofences = [] } = useGeofencesQuery();
    const createMutation = useCreateVehicleMutation();

    // Load history when vehicle selected
    useEffect(() => {
        if (selectedVehicle?.imei) {
            fetchVehicleHistory(selectedVehicle.imei);
        }
    }, [selectedVehicle?.imei, fetchVehicleHistory]);

    // Format geofences for Leaflet map (converting GeoJSON [lng, lat] to Leaflet [lat, lng])
    useEffect(() => {
        const polys = globalGeofences
            .filter(g => g.zone && g.zone.coordinates && g.zone.coordinates[0])
            .map(g => ({
                id: g.id,
                name: g.name,
                positions: g.zone.coordinates[0].map(c => [Number(c[1]), Number(c[0])])
            }));
        setGeofencePolygons(polys);
    }, [globalGeofences]);


    // Map Isolation: If a vehicle is selected, hide ALL other vehicles
    const displayedVehicles = useMemo(() => {
        return selectedVehicle 
            ? vehicles.filter(v => v.id === selectedVehicle.id) 
            : vehicles;
    }, [vehicles, selectedVehicle]);

    // Viewport filtering (only render markers in view): performance improvement
    const [bounds, setBounds] = useState(null);
    // Stable callback that only updates state when bounds materially change
    const handleBoundsChange = useCallback((newBounds) => {
        setBounds(prev => {
            if (!prev) {
                onViewportChange?.(newBounds);
                return newBounds;
            }
            if (prev.zoom === newBounds.zoom) {
                const d = Math.abs(prev.swLat - newBounds.swLat) + 
                          Math.abs(prev.swLng - newBounds.swLng) +
                          Math.abs(prev.neLat - newBounds.neLat) +
                          Math.abs(prev.neLng - newBounds.neLng);
                if (d < 0.001) return prev;
            }
            onViewportChange?.(newBounds);
            return newBounds;
        });
    }, [onViewportChange]);

    // 1. Dynamic Grid Clustering Algorithm
    const { visibleUnknown, visibleVehicles } = useMemo(() => {
        if (!bounds) return { visibleUnknown: [], visibleVehicles: displayedVehicles };

        const { swLat, swLng, neLat, neLng, zoom = 14 } = bounds;
        
        // --- Unknown Devices Clustering ---
        let unknownDensity = 0;
        if (zoom < 8) unknownDensity = isAdmin ? 50 : 30;
        else if (zoom < 12) unknownDensity = isAdmin ? 150 : 100;
        else if (zoom < 14) unknownDensity = isAdmin ? 300 : 0;

        const uClusters = new Map();
        const unkFiltered = [];
        const latRange = neLat - swLat;
        const lngRange = neLng - swLng;

        if (!selectedVehicle) {
            for (const [imei, pos] of Object.entries(unknownDevices)) {
                if (pos.lat < swLat || pos.lat > neLat || pos.lng < swLng || pos.lng > neLng) continue;

                if (unknownDensity > 0) {
                    const gx = Math.floor(((pos.lng - swLng) / lngRange) * unknownDensity);
                    const gy = Math.floor(((pos.lat - swLat) / latRange) * unknownDensity);
                    const key = `${gx}_${gy}`;
                    
                    if (uClusters.has(key)) {
                        const c = uClusters.get(key);
                        c.count++;
                        c.latSum += pos.lat;
                        c.lngSum += pos.lng;
                    } else {
                        uClusters.set(key, { isCluster: true, count: 1, latSum: pos.lat, lngSum: pos.lng, vehicle: [imei, pos], isUnknown: true });
                    }
                } else {
                    unkFiltered.push([imei, pos]);
                }
            }
            
            for (const [key, c] of uClusters.entries()) {
                if (c.count === 1) {
                    unkFiltered.push(c.vehicle);
                } else {
                    unkFiltered.push({
                        isCluster: true,
                        count: c.count,
                        lat: c.latSum / c.count,
                        lng: c.lngSum / c.count,
                        id: `ucluster-${key}`,
                        isUnknown: true
                    });
                }
            }
        }

        // --- Registered Vehicles Clustering ---
        let vDensity = 0;
        if (zoom < 6) vDensity = isAdmin ? 20 : 10;
        else if (zoom < 8) vDensity = isAdmin ? 40 : 25;
        else if (zoom < 10) vDensity = isAdmin ? 70 : 45;
        else if (zoom < 12) vDensity = isAdmin ? 120 : 80;
        else if (zoom < 14) vDensity = isAdmin ? 200 : 150;
        else if (zoom < 15) vDensity = isAdmin ? 400 : 0;

        const vClusters = new Map();
        const vFiltered = [];

        for (const vehicle of displayedVehicles) {
            const pos = livePositions[vehicle.imei];
            const lat = pos ? pos.lat : vehicle.lat;
            const lng = pos ? pos.lng : vehicle.lng;

            if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) continue;
            if (lat < swLat || lat > neLat || lng < swLng || lng > neLng) continue;

            if (selectedVehicle?.id === vehicle.id || vehicle.isAlert) {
                vFiltered.push(vehicle);
                continue;
            }

            if (vDensity > 0) {
                const gx = Math.floor(((lng - swLng) / lngRange) * vDensity);
                const gy = Math.floor(((lat - swLat) / latRange) * vDensity);
                const key = `${gx}_${gy}`;
                
                if (vClusters.has(key)) {
                    const c = vClusters.get(key);
                    c.count++;
                    c.latSum += lat;
                    c.lngSum += lng;
                } else {
                    vClusters.set(key, { isCluster: true, count: 1, latSum: lat, lngSum: lng, vehicle });
                }
            } else {
                vFiltered.push(vehicle);
            }
        }

        for (const [key, c] of vClusters.entries()) {
            if (c.count === 1) {
                vFiltered.push(c.vehicle);
            } else {
                vFiltered.push({
                    isCluster: true,
                    count: c.count,
                    lat: c.latSum / c.count,
                    lng: c.lngSum / c.count,
                    id: `cluster-${key}`,
                    isUnknown: false
                });
            }
        }

        return { visibleUnknown: unkFiltered, visibleVehicles: vFiltered };
    }, [bounds, displayedVehicles, livePositions, unknownDevices, selectedVehicle, isAdmin]);




    const initialCenter = useRef(center).current;

    return (
        <div className="flex-1 h-screen relative">
            <MapContainer
                center={initialCenter}
                zoom={14}
                className="w-full h-full"
                zoomControl={false}
                ref={mapRef}
            >
                <ZoomControl position="bottomright" />
                <CachedTileLayer />
                
                {/* Floating Clear Focus Tool - Top Center */}
                {selectedVehicle && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1002] pointer-events-none">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectVehicle(null);
                            }}
                            className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 group transition-all hover:bg-white hover:scale-105 active:scale-95"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-700">Exit Focused View</span>
                            <MdClose size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                )}

                <BoundsTracker onBoundsChange={handleBoundsChange} />

                <FlyToVehicle selectedVehicle={selectedVehicle} />
                <DrawControl active={true} onDrawComplete={onDrawComplete} />

                {/* Vehicle History Path & Playback Cursor */}
                {validHistoryPath && validHistoryPath.length > 1 && (
                    <>
                        <Polyline
                            positions={validHistoryPath.map(loc => [Number(loc.lat), Number(loc.lng)])}
                            pathOptions={{ color: '#3B82F6', weight: 4, opacity: 0.5, dashArray: '10, 10' }}
                        />
                        {/* Playback Ghost Vehicle - Interpolated with status */}
                        {playbackPos && (() => {
                            const pt = validHistoryPath[Math.floor(playbackIndex)];
                            const speed = Number(pt?.speed || 0);
                            const motionStatus = speed > 3 ? 'moving' : (pt?.ignition ? 'idle' : 'stopped');
                            const statusLabel = { moving: 'Moving', idle: 'Idle', stopped: 'Stopped' };
                            const statusDot = { moving: '#22c55e', idle: '#f59e0b', stopped: '#ef4444' };
                            return (
                                <Marker
                                    position={playbackPos}
                                    icon={createFocusIcon(motionStatus, false, '#3B82F6')}
                                    zIndexOffset={1000}
                                >
                                    <Popup>
                                        <div className="text-xs min-w-[140px]">
                                            <div className="font-bold mb-1">Playback Position</div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusDot[motionStatus] }}></span>
                                                <span className="font-medium">{statusLabel[motionStatus]}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="font-bold">{speed} km/h</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                                {pt?.timestamp
                                                    ? new Date(pt.timestamp).toLocaleString()
                                                    : 'No data'}
                                            </div>
                                            {pt && <AddressCell lat={pt.lat} lng={pt.lng} className="text-[10px] text-gray-400 mt-1" />}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })()}
                    </>
                )}

                {/* Geofence polygons */}
                {geofencePolygons.map((gf) => (
                    gf.positions.length > 0 && (
                        <Polygon
                            key={gf.id}
                            positions={gf.positions}
                            pathOptions={{ color: '#7C3AED', fillColor: '#7C3AED', fillOpacity: 0.1, weight: 2 }}
                        >
                            <Popup><b>{gf.name}</b></Popup>
                        </Polygon>
                    )
                ))}

                {/* Vehicle markers */}
                {visibleVehicles.map((vehicle) => {
                    if (vehicle.isCluster) {
                        return (
                            <Marker
                                key={vehicle.id}
                                position={[vehicle.lat, vehicle.lng]}
                                icon={L.divIcon({
                                    className: 'custom-cluster-icon',
                                    html: `<div class="bg-brand-purple text-white shadow-xl flex items-center justify-center font-bold border-[3px] border-white transform transition-transform hover:scale-110 ${vehicle.count > 1000 ? 'w-12 h-12 text-[12px]' : vehicle.count > 100 ? 'w-10 h-10 text-[11px]' : 'w-8 h-8 text-[11px]'}" style="border-radius: 50%;">
                                             ${vehicle.count > 999 ? (vehicle.count/1000).toFixed(1)+'k' : vehicle.count}
                                           </div>`,
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 20],
                                })}
                                eventHandlers={{
                                     click: (e) => {
                                         mapRef.current?.setView(e.latlng, (bounds?.zoom || 14) + 2, { animate: true });
                                     }
                                }}
                            />
                        );
                    }

                    // Assuming livePositions is available in this scope, e.g., passed as a prop or from a context
                    const status = vehicle.status;
                    const isAlert = vehicle.isAlert;

                    if (!vehicle.lat || !vehicle.lng) return null;

                    const isSelected = selectedVehicle?.id === vehicle.id;
                    const icon = isSelected
                        ? createSelectedIcon(status, isAlert)
                        : createVehicleIcon(status, isAlert);

                    return (
                        <Marker
                            key={vehicle.id || vehicle.imei}
                            position={[vehicle.lat, vehicle.lng]}
                            icon={icon}
                            eventHandlers={{
                                click: () => onSelectVehicle(vehicle),
                            }}
                        >
                            <Popup>
                                <div className="text-sm min-w-[160px]">
                                    <div className="font-bold text-gray-800 mb-1">{vehicle.vechicleNumb || vehicle.imei}</div>
                                    {isAlert && (
                                        <div className="mb-2 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded border border-red-200 animate-pulse inline-block">
                                            Geofence Breach
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span
                                            className="w-2 h-2 rounded-full inline-block"
                                            style={{ backgroundColor: statusColors[vehicle.status] }}
                                        ></span>
                                        <span className="text-gray-600">{statusLabels[vehicle.status] || 'Unknown'}</span>
                                    </div>
                                    <div className="text-gray-500 mb-2">Speed: {vehicle.speed || 0} km/h</div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowHistoryData(true);
                                        }}
                                        className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <MdAssessment size={14} /> View Historical Data
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Unknown device markers */}
                {visibleUnknown.map((item) => {
                    if (item.isCluster) {
                        return (
                            <Marker
                                key={item.id}
                                position={[item.lat, item.lng]}
                                icon={L.divIcon({
                                    className: 'custom-cluster-icon',
                                    html: `<div class="bg-gray-600 text-white shadow-xl flex items-center justify-center font-bold border-[3px] border-white transform transition-transform hover:scale-110 ${item.count > 1000 ? 'w-12 h-12 text-[12px]' : item.count > 100 ? 'w-10 h-10 text-[11px]' : 'w-8 h-8 text-[11px]'}" style="border-radius: 50%;">
                                             ${item.count > 999 ? (item.count/1000).toFixed(1)+'k' : item.count}
                                           </div>`,
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 20],
                                })}
                                eventHandlers={{
                                     click: (e) => {
                                         mapRef.current?.setView(e.latlng, (bounds?.zoom || 14) + 2, { animate: true });
                                     }
                                }}
                            />
                        );
                    }

                    const [imei, pos] = item;
                    const speed = pos.speed || 0;
                    const status = speed > 3 ? 'moving' : (pos.ignition ? 'idle' : 'stopped');
                    return (
                        <Marker key={`unknown-${imei}`} position={[pos.lat, pos.lng]} icon={createVehicleIcon(status, false)}>
                            <Popup>
                                <div className="text-sm min-w-[180px]">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                            Unregistered
                                        </span>
                                    </div>
                                    <div className="font-bold text-gray-800 mb-1 font-mono text-xs">IMEI: {imei}</div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span
                                            className="w-2 h-2 rounded-full inline-block"
                                            style={{ backgroundColor: statusColors[status] }}
                                        ></span>
                                        <span className="text-gray-600">{statusLabels[status] || 'Unknown'}</span>
                                    </div>
                                    <div className="text-gray-500 mb-2">Speed: {speed} km/h</div>
                                    <button
                                        onClick={async () => {
                                            const num = prompt('Enter vehicle number/name:');
                                            if (!num) return;
                                            try {
                                                await createMutation.mutateAsync({ imei, vechicleNumb: num });
                                                alert('Vehicle registered!');
                                            } catch (e) {
                                                alert(e.message || 'Registration failed');
                                            }
                                        }}
                                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                                    >
                                        Quick Register
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* History Data Table Overlay */}
            {showHistoryData && selectedVehicle && (
                <HistoryDataOverlay
                    vehicle={selectedVehicle}
                    historyPath={historyPath}
                    onClose={() => setShowHistoryData(false)}
                />
            )}
            


            {/* Playback Controls Overlay */}
            {selectedVehicle && historyPath.length > 0 && (
                <PlaybackControls
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    playbackIndex={playbackIndex}
                    onSeek={(val) => { setPlaybackIndex(val); setIsPlaying(false); }}
                    playbackSpeed={playbackSpeed}
                    onSpeedChange={setPlaybackSpeed}
                    historyPath={historyPath}
                    validHistoryPath={validHistoryPath}
                />
            )}

            {/* Layers button */}
            <button className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-xl border border-gray-200">
                <MdLayers size={18} />
                Layers
            </button>
        </div>
    );
}
