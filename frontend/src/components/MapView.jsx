import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { MdLayers, MdAssessment, MdClose, MdHistory } from 'react-icons/md';
import { useHistory } from '../context/HistoryContext';
import { getLocationHistory } from '../services/api';
import { useGeofencesQuery, useCreateVehicleMutation } from '../hooks/useQueries';
import { getCachedTile, cacheTile } from '../services/tileCache';
import { sendViewport } from '../services/websocket';
import { getDistanceFromLatLonInKm, turf_destination } from '../utils/geoUtils';
import AddressCell from './AddressCell';


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
    const lastBounds = useRef(null);
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (!map) return;
        
        const syncBounds = () => {
            if (!map) return;
            const b = map.getBounds();
            const sw = b.getSouthWest();
            const ne = b.getNorthEast();
            
            const newBounds = { 
                swLat: sw.lat, swLng: sw.lng, 
                neLat: ne.lat, neLng: ne.lng 
            };

            if (lastBounds.current) {
                const d = Math.abs(lastBounds.current.swLat - newBounds.swLat) + 
                          Math.abs(lastBounds.current.swLng - newBounds.swLng);
                if (d < 0.0001) return; // Threshold to ignore micro-jitters
            }

            lastBounds.current = newBounds;
            
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                onBoundsChange(newBounds);
                // Viewport sync removed to prevent recursive re-render loop across WS
            }, 100); 
        };

        // Removed the immediate call to syncBounds here to prevent synchronous state update cycles
        // Instead, we'll let the moveend/zoomend fire naturally or run it once in a trailing sync
        map.on('moveend zoomend', syncBounds);
        return () => { 
            map.off('moveend zoomend', syncBounds); 
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [map, onBoundsChange]);



// Removed redundant useMapEvents handler


    return null;
}

export default function MapView({ vehicles, selectedVehicle, onSelectVehicle, livePositions = {}, unknownDevices = {}, onDrawComplete }) {
    const center = [18.5204, 73.8567]; // Pune
    const mapRef = useRef(null);
    const [geofencePolygons, setGeofencePolygons] = useState([]);
    const { fetchVehicleHistory, getHistory } = useHistory();
    const [showHistoryData, setShowHistoryData] = useState(false);
    
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

    const visibleUnknown = useMemo(() => {
        const unknownEntries = Object.entries(unknownDevices);
        return unknownEntries.filter(([, pos]) => {
            if (selectedVehicle) return false; 
            if (!bounds) return true;
            return pos.lat >= bounds.swLat && pos.lat <= bounds.neLat &&
                   pos.lng >= bounds.swLng && pos.lng <= bounds.neLng;
        });
    }, [unknownDevices, selectedVehicle, bounds]);

    const visibleVehicles = useMemo(() => {
        return displayedVehicles.filter(vehicle => {
            const pos = livePositions[vehicle.imei];
            const lat = pos ? pos.lat : vehicle.lat;
            const lng = pos ? pos.lng : vehicle.lng;
            if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return false;
            if (!bounds) return true;
            return lat >= bounds.swLat && lat <= bounds.neLat &&
                   lng >= bounds.swLng && lng <= bounds.neLng;
        });
    }, [displayedVehicles, livePositions, bounds]);


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

                <BoundsTracker onBoundsChange={setBounds} />

                <FlyToVehicle selectedVehicle={selectedVehicle} />
                <DrawControl active={true} onDrawComplete={onDrawComplete} />

                {/* Vehicle History Path & Playback Cursor */}
                {validHistoryPath && validHistoryPath.length > 1 && (
                    <>
                        <Polyline
                            positions={validHistoryPath.map(loc => [Number(loc.lat), Number(loc.lng)])}
                            pathOptions={{ color: '#3B82F6', weight: 4, opacity: 0.5, dashArray: '10, 10' }}
                        />
                        {/* Playback Ghost Vehicle - Interpolated */}
                        {playbackPos && (
                            <Marker
                                position={playbackPos}
                                icon={createFocusIcon('moving', false, '#3B82F6')}
                                zIndexOffset={1000}
                            >
                                <Popup>
                                    <div className="text-xs font-bold">Playback Position</div>
                                    <div className="text-[10px] text-gray-500">
                                        {validHistoryPath[Math.floor(playbackIndex)]?.timestamp 
                                            ? new Date(validHistoryPath[Math.floor(playbackIndex)].timestamp).toLocaleString()
                                            : 'No data'}
                                    </div>
                                </Popup>
                            </Marker>
                        )}
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
                {visibleUnknown.map(([imei, pos]) => (
                    <Marker key={`unknown-${imei}`} position={[pos.lat, pos.lng]} icon={unknownIcon}>
                        <Popup>
                            <div className="text-sm text-center">
                                <b style={{ color: '#EF4444' }}>⚠️ Unregistered Device</b><br />
                                <b>IMEI: {imei}</b><br />
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
                                    style={{
                                        marginTop: '6px', padding: '4px 10px', fontSize: '11px',
                                        background: '#EF4444', border: 'none', borderRadius: '4px',
                                        color: 'white', cursor: 'pointer'
                                    }}
                                >
                                    Quick Register
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* History Data Table Overlay */}
            {showHistoryData && selectedVehicle && (
                <div className="absolute right-4 bottom-20 z-[1001] w-80 max-h-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <h3 className="font-bold text-gray-800 text-sm">{selectedVehicle.vechicleNumb || selectedVehicle.imei} Analysis</h3>
                        </div>
                        <button 
                            onClick={() => setShowHistoryData(false)} 
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        <table className="w-full text-left text-[11px]">
                                    <thead className="sticky top-0 bg-gray-50 text-gray-500 font-semibold">
                                        <tr>
                                            <th className="px-2 py-1.5 border-b border-gray-100">Time</th>
                                            <th className="px-2 py-1.5 border-b border-gray-100 text-center">Speed</th>
                                            <th className="px-2 py-1.5 border-b border-gray-100 text-right">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyPath.length === 0 ? (
                                            <tr><td colSpan={3} className="text-center py-4 text-gray-400 italic">No history available for last 24h</td></tr>
                                        ) : (
                                            [...historyPath].reverse().map((loc, idx) => (
                                                <tr key={idx} className="hover:bg-purple-50 transition-colors border-b border-gray-50">
                                                    <td className="px-2 py-1.5 text-gray-600">
                                                        {new Date(loc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="px-2 py-1.5 font-bold text-brand-purple text-center">
                                                        {loc.speed || 0}
                                                    </td>
                                                    <td className="px-2 py-1.5 text-right">
                                                        <AddressCell lat={loc.lat} lng={loc.lng} className="max-w-[120px]" />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-2 bg-purple-50 text-[10px] text-brand-purple italic border-t border-purple-100">
                        Showing last 24 hours of data (max 500 points)
                    </div>
                </div>
            )}
            


            {/* Playback Controls Overlay */}
            {selectedVehicle && historyPath.length > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    {isPlaying ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                    )}
                                </button>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Movement Playback</span>
                                    <span className="text-[10px] text-gray-500">
                                        {historyPath[Math.floor(playbackIndex)]?.timestamp 
                                            ? new Date(historyPath[Math.floor(playbackIndex)].timestamp).toLocaleTimeString()
                                            : 'Invalid Date'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                    {[1, 2, 5, 10].map(speed => (
                                        <button
                                            key={speed}
                                            onClick={() => setPlaybackSpeed(speed)}
                                            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${playbackSpeed === speed ? 'bg-white shadow-sm text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min="0" 
                                max={validHistoryPath.length - 1} 
                                step="0.01"
                                value={playbackIndex}
                                onChange={(e) => {
                                    setPlaybackIndex(parseFloat(e.target.value));
                                    setIsPlaying(false);
                                }}
                                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                            />
                            <span className="text-[10px] font-mono text-gray-400 min-w-[60px] text-right">
                                {Math.floor(playbackIndex) + 1} / {validHistoryPath.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Layers button */}
            <button className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-xl border border-gray-200">
                <MdLayers size={18} />
                Layers
            </button>
        </div>
    );
}
