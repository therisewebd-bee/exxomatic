import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { MdLayers } from 'react-icons/md';
import { getGeofences, createVehicle, getLocationHistory } from '../services/api';
import { getCachedTile, cacheTile } from '../services/tileCache';
import { sendViewport } from '../services/websocket';

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
function createVehicleIcon(status) {
    const colors = {
        moving: '#22C55E',
        stopped: '#EF4444',
        idle: '#F59E0B',
    };
    const color = colors[status] || '#7C3AED';

    return L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
      <div style="
        width: 32px; height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
    });
}

// Highlighted marker (when selected)
function createSelectedIcon(status) {
    const colors = {
        moving: '#22C55E',
        stopped: '#EF4444',
        idle: '#F59E0B',
    };
    const color = colors[status] || '#7C3AED';

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
        animation: pulse 1.5s ease-in-out infinite;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -24],
    });
}

// Red marker for unknown devices
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
    stopped: '#EF4444',
    idle: '#F59E0B',
};

// Component to fly to selected vehicle
function FlyToVehicle({ selectedVehicle }) {
    const map = useMap();

    useEffect(() => {
        if (selectedVehicle && selectedVehicle.lat && selectedVehicle.lng) {
            map.flyTo([selectedVehicle.lat, selectedVehicle.lng], 16, {
                duration: 1.2,
            });
        }
    }, [selectedVehicle, map]);

    return null;
}

// Leaflet.draw integration component — full-featured
function DrawControl({ active, onDrawComplete }) {
    const map = useMap();
    const drawnRef = useRef(null);
    const controlRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Setup: create the feature group and draw control once
    useEffect(() => {
        if (!L.Control.Draw) {
            console.error('[DrawControl] leaflet-draw not loaded!');
            return;
        }

        const drawnItems = new L.FeatureGroup();
        drawnRef.current = drawnItems;
        map.addLayer(drawnItems);

        const purpleStyle = { color: '#7C3AED', weight: 2, fillOpacity: 0.15, fillColor: '#7C3AED' };

        const drawControl = new L.Control.Draw({
            position: 'topleft',
            draw: {
                polygon: {
                    allowIntersection: false,
                    drawError: { color: '#ef4444', message: 'Edges cannot cross!' },
                    shapeOptions: purpleStyle
                },
                rectangle: { shapeOptions: purpleStyle },
                circle: { shapeOptions: purpleStyle },
                polyline: { shapeOptions: { ...purpleStyle, fill: false } },
                circlemarker: false,
                marker: false,
            },
            edit: {
                featureGroup: drawnItems,
                remove: {},
                edit: {
                    selectedPathOptions: {
                        maintainColor: true,
                        opacity: 0.3
                    }
                }
            }
        });
        controlRef.current = drawControl;

        // Shape created
        map.on(L.Draw.Event.CREATED, (e) => {
            drawnItems.clearLayers();
            drawnItems.addLayer(e.layer);
            setIsDrawing(false);

            // Convert circle to a polygon approximation for GeoJSON
            let geometry;
            if (e.layerType === 'circle') {
                const center = e.layer.getLatLng();
                const radius = e.layer.getRadius();
                const steps = 64;
                const coords = [];
                for (let i = 0; i < steps; i++) {
                    const angle = (i / steps) * 360;
                    const point = L.GeometryUtil
                        ? L.GeometryUtil.destination(center, angle, radius)
                        : turf_destination(center, radius, angle);
                    coords.push([point.lng, point.lat]);
                }
                coords.push(coords[0]); // close ring
                geometry = { type: 'Polygon', coordinates: [coords] };
            } else {
                geometry = e.layer.toGeoJSON().geometry;
            }

            onDrawComplete?.(geometry);
        });

        // Track drawing state for cancel button
        map.on(L.Draw.Event.DRAWSTART, () => setIsDrawing(true));
        map.on(L.Draw.Event.DRAWSTOP, () => setIsDrawing(false));

        return () => {
            map.off(L.Draw.Event.CREATED);
            map.off(L.Draw.Event.DRAWSTART);
            map.off(L.Draw.Event.DRAWSTOP);
            try { map.removeControl(drawControl); } catch { }
            map.removeLayer(drawnItems);
        };
    }, [map]);

    // Toggle: show/hide the draw toolbar
    useEffect(() => {
        if (!controlRef.current) return;
        if (active) {
            controlRef.current.addTo(map);
        } else {
            try { map.removeControl(controlRef.current); } catch { }
            if (drawnRef.current) drawnRef.current.clearLayers();
        }
    }, [active, map]);

    // Update onDrawComplete without re-mounting
    useEffect(() => {
        const currentHandler = (e) => {
            drawnRef.current?.clearLayers();
            drawnRef.current?.addLayer(e.layer);

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

        map.off(L.Draw.Event.CREATED);
        map.on(L.Draw.Event.CREATED, currentHandler);

        return () => map.off(L.Draw.Event.CREATED, currentHandler);
    }, [onDrawComplete, map]);

    // Cancel / Clear button
    function handleCancel() {
        if (drawnRef.current) drawnRef.current.clearLayers();
        setIsDrawing(false);
        // Programmatically disable any active draw handler
        map.fire('draw:drawstop');
    }

    if (!active) return null;

    return null;
}

// Simple circle→polygon helper (radius in meters, angle in radians)
function turf_destination(center, radius, angleDeg) {
    const angle = angleDeg * Math.PI / 180;
    const lat = center.lat + (radius / 111320) * Math.cos(angle);
    const lng = center.lng + (radius / (111320 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);
    return { lat, lng };
}

export default function MapView({ vehicles, selectedVehicle, onSelectVehicle, unknownDevices = {}, drawingActive, onDrawComplete }) {
    const center = [18.5204, 73.8567]; // Pune
    const mapRef = useRef(null);
    const [geofencePolygons, setGeofencePolygons] = useState([]);
    const [historyPath, setHistoryPath] = useState([]);
    const [showHistoryData, setShowHistoryData] = useState(false);

    // Load history when vehicle selected
    useEffect(() => {
        if (!selectedVehicle?.id) {
            setHistoryPath([]);
            return;
        }

        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // last 24h

        getLocationHistory({
            imei: selectedVehicle.imei,
            startDate: startTime,
            endDate: endTime,
            limit: 500
        })
            .then(res => {
                const logs = (res.data || [])
                    .filter(loc => loc.lat && loc.lng);
                setHistoryPath(logs);
            })
            .catch(err => {
                console.error('Failed to load history', err);
                setHistoryPath([]);
            });
    }, [selectedVehicle]);

    // Load geofence polygons (they come without actual geometry from Prisma, but we try)
    useEffect(() => {
        getGeofences()
            .then((res) => {
                const polygons = (res.data || [])
                    .filter((g) => g.zone)
                    .map((g) => ({
                        id: g.id,
                        name: g.name,
                        positions: g.zone.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) || [],
                    }));
                setGeofencePolygons(polygons);
            })
            .catch(() => { });
    }, []);

    const unknownIcon = createUnknownIcon();

    // --- Viewport Culling Logic ---
    const [bounds, setBounds] = useState(null);

// Helper to track map bounds and sync with backend
function BoundsTracker({ onBoundsChange }) {
    const map = useMap();

    // Initialize bounds on mount
    useEffect(() => {
        const b = map.getBounds();
        onBoundsChange(b);
        sendViewport({
            minLat: b.getSouthWest().lat,
            maxLat: b.getNorthEast().lat,
            minLng: b.getSouthWest().lng,
            maxLng: b.getNorthEast().lng
        });
    }, [map, onBoundsChange]);

    // Trigger on move/zoom completion
    const onInteractionEnd = () => {
        const b = map.getBounds();
        onBoundsChange(b);
        sendViewport({
            minLat: b.getSouthWest().lat,
            maxLat: b.getNorthEast().lat,
            minLng: b.getSouthWest().lng,
            maxLng: b.getNorthEast().lng
        });
    };

    useMapEvents({
        moveend: onInteractionEnd,
        zoomend: onInteractionEnd,
    });

    return null;
}

    // Filter vehicles to only those inside current viewport
    const visibleVehicles = vehicles.filter(v => {
        if (!v.lat || !v.lng) return false;
        if (!bounds) return true; // Show all if bounds not yet loaded
        return bounds.contains([v.lat, v.lng]);
    });

    const visibleUnknown = Object.entries(unknownDevices).filter(([imei, pos]) => {
        if (!bounds) return true;
        return bounds.contains([pos.lat, pos.lng]);
    });

    // Decide center: use first vehicle with valid coords, fallback to Pune
    const firstLive = vehicles.find(v => v.lat && v.lng);
    const mapCenter = firstLive ? [firstLive.lat, firstLive.lng] : center;

    return (
        <div className="flex-1 h-screen relative">
            <MapContainer
                center={mapCenter}
                zoom={14}
                className="w-full h-full"
                zoomControl={true}
                ref={mapRef}
            >
                <CachedTileLayer />
                <BoundsTracker onBoundsChange={setBounds} />

                <FlyToVehicle selectedVehicle={selectedVehicle} />
                <DrawControl active={drawingActive} onDrawComplete={onDrawComplete} />

                {/* Vehicle History Path */}
                {historyPath.length > 1 && (
                    <Polyline
                        positions={historyPath.map(loc => [loc.lat, loc.lng])}
                        pathOptions={{ color: '#3B82F6', weight: 4, opacity: 0.8 }}
                    />
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
                    if (!vehicle.lat || !vehicle.lng) return null;
                    const isSelected = selectedVehicle?.id === vehicle.id;
                    const icon = isSelected
                        ? createSelectedIcon(vehicle.status)
                        : createVehicleIcon(vehicle.status);

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
                                    <div className="font-bold text-gray-800 mb-1">{vehicle.plate}</div>
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
                                            await createVehicle({ imei, vechicleNumb: num });
                                            alert('Vehicle registered! Refresh to see it.');
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
                            <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse"></div>
                            <h3 className="font-bold text-gray-800 text-sm">{selectedVehicle.plate} History</h3>
                        </div>
                        <button onClick={() => setShowHistoryData(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MdClose size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2">
                        <table className="w-full text-left text-[11px]">
                            <thead className="sticky top-0 bg-gray-50 text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-2 py-1.5 border-b border-gray-100">Time</th>
                                    <th className="px-2 py-1.5 border-b border-gray-100">Speed</th>
                                    <th className="px-2 py-1.5 border-b border-gray-100 text-right">Coords</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyPath.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-4 text-gray-400 italic">No history available for last 24h</td></tr>
                                ) : (
                                    historyPath.map((loc, idx) => (
                                        <tr key={idx} className="hover:bg-purple-50 transition-colors border-b border-gray-50">
                                            <td className="px-2 py-1.5 text-gray-600">
                                                {new Date(loc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-2 py-1.5 font-bold text-brand-purple">
                                                {loc.speed || 0} km/h
                                            </td>
                                            <td className="px-2 py-1.5 text-right text-gray-400">
                                                {Number(loc.lat).toFixed(4)}, {Number(loc.lng).toFixed(4)}
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

            {/* Layers button */}
            <button className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-xl border border-gray-200">
                <MdLayers size={18} />
                Layers
            </button>
        </div>
    );
}
