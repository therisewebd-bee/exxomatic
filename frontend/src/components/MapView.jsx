import { useState, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
// Pre-declare `type` to prevent "assignment to undeclared variable" in leaflet-draw strict mode
if (typeof window !== 'undefined' && !('type' in window)) {
    window.type = '';
}
import 'leaflet-draw';
import { MdLayers, MdAssessment, MdClose, MdHistory } from 'react-icons/md';
import { useCreateVehicleMutation } from '../hooks/useQueries';
import { useUpdateVehicleLocationMutation } from '../hooks/useVehicleQueries';
import { getCachedTile, cacheTile } from '../services/tileCache';
import { sendViewport } from '../services/websocket';
import { getDistanceFromLatLonInKm, turf_destination } from '../utils/geoUtils';
import { useGeolocation } from '../hooks/useGeolocation';
import AddressCell from './AddressCell';
import PlaybackControls from './PlaybackControls';
import HistoryDataOverlay from './HistoryDataOverlay';

import CachedTileLayer from './MapComponents/CachedTileLayer';
import BoundsTracker from './MapComponents/BoundsTracker';
import FlyToVehicle from './MapComponents/FlyToVehicle';
import DrawControl from './MapComponents/DrawControl';
import { initLeafletIcons, createVehicleIcon, createSelectedIcon, createUnknownIcon } from '../utils/mapIcons';
import { useVehicleHistory, useGeofencePolygons, useMapBounds, useVehicleClusters } from '../hooks/useMapLogic';

const statusColors = {
    moving: '#22C55E',
    stopped: '#64748B',
    idle: '#F59E0B',
};

const statusLabels = {
    moving: 'Moving',
    stopped: 'Stopped',
    idle: 'Idle',
};

initLeafletIcons();

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

const EMPTY_ARRAY = [];

const MAP_LAYERS = {
    osm: {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    google: {
        name: 'Google Roads',
        url: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
        attribution: '&copy; Google'
    },
    googleSat: {
        name: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    }
};

export default function MapView({ vehicles, selectedVehicle, selectionTime, onSelectVehicle, livePositions = {}, unknownDevices = {}, onDrawComplete, isAdmin, onViewportChange, onRegisterRequest, onEditRequest, onAnalyzeRequest }) {
    const mapRef = useRef(null);
    const [overlayTarget, setOverlayTarget] = useState(null);
    const [activeLayer, setActiveLayer] = useState('osm');
    const [showLayerMenu, setShowLayerMenu] = useState(false);
    
    // Extracted custom hooks module to handle heavy logic separately
    const { validHistoryPath, showHistoryData, setShowHistoryData, historyPath } = useVehicleHistory(selectedVehicle);
    const geofencePolygons = useGeofencePolygons();
    const { bounds, handleBoundsChange } = useMapBounds(onViewportChange);
    const { visibleUnknown, visibleVehicles } = useVehicleClusters(vehicles, livePositions, unknownDevices, selectedVehicle, bounds, isAdmin);

    // Auto-detect user location via browser GPS or IP fallback
    const { center } = useGeolocation(mapRef);

    // Memoized icon cache: avoid creating new divIcon objects on every render
    const iconCache = useMemo(() => {
      const cache = {};
      for (const status of ['moving', 'stopped', 'idle']) {
        cache[`${status}:false`] = createVehicleIcon(status, false);
        cache[`${status}:true`] = createVehicleIcon(status, true);
        cache[`selected:${status}:false`] = createSelectedIcon(status, false);
        cache[`selected:${status}:true`] = createSelectedIcon(status, true);
      }
      return cache;
    }, []);

    const createMutation = useCreateVehicleMutation();
    const updateLocationMutation = useUpdateVehicleLocationMutation();
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
                <CachedTileLayer 
                    key={activeLayer}
                    url={MAP_LAYERS[activeLayer].url}
                    attribution={MAP_LAYERS[activeLayer].attribution}
                />
                
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

                <FlyToVehicle selectedVehicle={selectedVehicle} selectionTime={selectionTime} />
                <DrawControl active={true} onDrawComplete={onDrawComplete} />

                {/* Vehicle History Path */}
                {validHistoryPath && validHistoryPath.length > 1 && (
                    <Polyline
                        positions={validHistoryPath.map(loc => [Number(loc.lat), Number(loc.lng)])}
                        pathOptions={{ color: '#3B82F6', weight: 4, opacity: 0.5, dashArray: '10, 10' }}
                    />
                )}
                
                {/* Independent Playback Subsystem - Runs at 60FPS outside MapView render loop */}
                <PlaybackControls validHistoryPath={validHistoryPath} selectedVehicle={selectedVehicle} overlayTarget={overlayTarget} selectionTime={selectionTime} />

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

                    const status = vehicle.status;
                    const isAlert = vehicle.isAlert;

                    if (!vehicle.lat || !vehicle.lng) return null;

                    const isSelected = selectedVehicle?.id === vehicle.id;
                    const cacheKey = isSelected
                        ? `selected:${status}:${!!isAlert}`
                        : `${status}:${!!isAlert}`;
                    const icon = iconCache[cacheKey] || iconCache['stopped:false'];

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
                                        <span className="text-gray-600 mr-1">{statusLabels[vehicle.status] || 'Unknown'}</span>
                                        {vehicle.isLive && (
                                            <span className="flex items-center gap-1 px-1.5 py-0.25 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded border border-green-100 italic">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                Live
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-gray-500 mb-2">Speed: {vehicle.speed || 0} km/h</div>
                                    
                                    {vehicle.diagnostics && Object.keys(vehicle.diagnostics).length > 0 && (
                                        <div className="bg-gray-50 rounded p-2 mb-2 border border-gray-100">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Live Diagnostics</div>
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-brand-purple">
                                                {vehicle.diagnostics.odometer !== undefined && <div><span className="text-gray-500">Odo:</span> {(vehicle.diagnostics.odometer).toFixed(1)} km</div>}
                                                {vehicle.diagnostics.batteryVoltage !== undefined && <div><span className="text-gray-500">Bat:</span> {vehicle.diagnostics.batteryVoltage}V</div>}
                                                {vehicle.diagnostics.temperature !== undefined && <div><span className="text-gray-500">Temp:</span> {vehicle.diagnostics.temperature}°C</div>}
                                                {vehicle.diagnostics.engine !== undefined && <div><span className="text-gray-500">Eng:</span> {vehicle.diagnostics.engine ? 'ON' : 'OFF'}</div>}
                                                {vehicle.diagnostics.rpm !== undefined && <div><span className="text-gray-500">RPM:</span> {vehicle.diagnostics.rpm}</div>}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1.5 mt-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onAnalyzeRequest) onAnalyzeRequest(vehicle);
                                                else setShowHistoryData(true);
                                            }}
                                            className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <MdAssessment size={14} /> View Analytics
                                        </button>

                                        {isAdmin && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onEditRequest) onEditRequest(vehicle);
                                                }}
                                                className="w-full py-1.5 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple border border-brand-purple/20 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                                            >
                                                Assign Customer / Edit
                                            </button>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const coords = prompt(`Enter new manual coordinates for ${vehicle.vechicleNumb || vehicle.imei}\nFormat: "lat, lng" (e.g. 18.5204, 73.8567):`);
                                                if (coords) {
                                                    const parts = coords.split(',');
                                                    if (parts.length === 2) {
                                                        const lat = parseFloat(parts[0].trim());
                                                        const lng = parseFloat(parts[1].trim());
                                                        if (!isNaN(lat) && !isNaN(lng)) {
                                                            updateLocationMutation.mutate({ id: vehicle.id, data: { lat, lng } }, {
                                                                onError: (err) => alert(err.message)
                                                            });
                                                        } else {
                                                            alert("Invalid coordinates. Please enter valid numbers.");
                                                        }
                                                    } else {
                                                        alert('Invalid format. Please enter exactly as: "lat, lng"');
                                                    }
                                                }
                                            }}
                                            className="w-full py-1.5 mt-1 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-xs font-bold rounded flex items-center justify-center transition-colors"
                                        >
                                            Update Location Manually
                                        </button>
                                    </div>
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

                                    {pos.diagnostics && Object.keys(pos.diagnostics).length > 0 && (
                                        <div className="bg-amber-50/50 rounded p-2 mb-2 border border-amber-100">
                                            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Diagnostics</div>
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-amber-900">
                                                {pos.diagnostics.odometer !== undefined && <div><span className="text-amber-600">Odo:</span> {(pos.diagnostics.odometer).toFixed(1)} km</div>}
                                                {pos.diagnostics.batteryVoltage !== undefined && <div><span className="text-amber-600">Bat:</span> {pos.diagnostics.batteryVoltage}V</div>}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onRegisterRequest) onRegisterRequest(imei);
                                        }}
                                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                                    >
                                        Register Vehicle
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
            



            {/* Layers button and dropdown */}
            <div className="absolute top-4 right-4 z-[1000]">
                <button 
                    onClick={() => setShowLayerMenu(!showLayerMenu)}
                    className="bg-white hover:bg-gray-50 shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-xl border border-gray-200"
                >
                    <MdLayers size={18} />
                    Layers
                </button>
                
                {showLayerMenu && (
                    <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-1">
                        {Object.entries(MAP_LAYERS).map(([key, layer]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setActiveLayer(key);
                                    setShowLayerMenu(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                    activeLayer === key 
                                        ? 'bg-brand-purple/10 text-brand-purple font-bold' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {layer.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Portal target for floating map controls that need to escape the Leaflet DOM tree */}
            <div ref={setOverlayTarget} className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-[1000]"></div>
        </div>
    );
}
