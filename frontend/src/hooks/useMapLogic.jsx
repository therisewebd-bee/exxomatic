import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useHistory } from '../context/HistoryContext';
import { useGeofencesQuery } from './useQueries';
import { snapToRoads } from '../services/osrm';

const EMPTY_ARRAY = [];

export function useVehicleHistory(selectedVehicle) {
    const { fetchVehicleHistory, getHistory, historyCache } = useHistory();
    const [showHistoryData, setShowHistoryData] = useState(false);
    const [snappedPath, setSnappedPath] = useState([]);
    const [isSnapping, setIsSnapping] = useState(false);

    const historyPath = useMemo(() => {
        if (!selectedVehicle) return EMPTY_ARRAY;
        return getHistory(selectedVehicle.imei) || EMPTY_ARRAY;
    }, [selectedVehicle, getHistory, historyCache]);
    
    // Background snapping task with instant raw-path fallback & 2.5s timeout
    useEffect(() => {
        let isActive = true;
        
        if (historyPath.length > 1) {
            // Instantly show the raw path while snapping happens in the background!
            setSnappedPath(historyPath);
            setIsSnapping(true);

            // Timeout wrapper: if OSRM takes > 2.5s, just stick to raw path entirely
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('OSRM Snapping Timeout')), 2500)
            );

            Promise.race([snapToRoads(historyPath), timeoutPromise])
                .then(snapped => {
                    if (isActive) {
                        setSnappedPath(snapped);
                        setIsSnapping(false);
                    }
                })
                .catch(err => {
                    if (isActive) {
                        console.warn('Snapping aborted:', err.message);
                        setSnappedPath(historyPath); // Use old/raw way
                        setIsSnapping(false);
                    }
                });
        } else {
            setSnappedPath(historyPath);
            setIsSnapping(false);
        }
        
        return () => { isActive = false; };
    }, [historyPath]);

    const validHistoryPath = useMemo(() => {
        const path = snappedPath;
        if (path.length === 0 && selectedVehicle && selectedVehicle.lat && selectedVehicle.lng) {
            // Fallback to current live position if DB has zero data
            return [{
                lat: selectedVehicle.lat,
                lng: selectedVehicle.lng,
                speed: selectedVehicle.speed || 0,
                ignition: selectedVehicle.ignition || false,
                timestamp: new Date().toISOString(),
                motionStatus: selectedVehicle.status || 'stopped'
            }];
        }
        return path;
    }, [snappedPath, selectedVehicle]);

    // Load history when vehicle selected
    useEffect(() => {
        if (selectedVehicle?.imei) {
            fetchVehicleHistory(selectedVehicle.imei);
        }
    }, [selectedVehicle?.imei, fetchVehicleHistory]);

    return { validHistoryPath, showHistoryData, setShowHistoryData, rawHistoryPath: historyPath, isSnapping };
}

export function useGeofencePolygons() {
    const { data: globalGeofences } = useGeofencesQuery();

    // Format geofences for Leaflet map (converting GeoJSON [lng, lat] to Leaflet [lat, lng])
    const geofencePolygons = useMemo(() => {
        if (!globalGeofences) return EMPTY_ARRAY;
        return globalGeofences
            .filter(g => g.zone && g.zone.coordinates && g.zone.coordinates[0])
            .map(g => ({
                id: g.id,
                name: g.name,
                positions: g.zone.coordinates[0].map(c => [Number(c[1]), Number(c[0])])
            }));
    }, [globalGeofences]);

    return geofencePolygons;
}

export function useMapBounds(onViewportChange) {
    // Viewport filtering (only render markers in view): performance improvement
    const [bounds, setBounds] = useState(null);

    // BoundsTracker manages the diff and debouncing natively
    const handleBoundsChange = useCallback((newBounds) => {
        setBounds(newBounds);
        onViewportChange?.(newBounds);
    }, [onViewportChange]);

    return { bounds, handleBoundsChange };
}

export function useVehicleClusters(vehicles, livePositions, unknownDevices, selectedVehicle, bounds, isAdmin) {
    // Map Isolation: If a vehicle is selected, hide ALL other vehicles
    const displayedVehicles = useMemo(() => {
        return selectedVehicle
            ? vehicles.filter(v => v.id === selectedVehicle.id)
            : vehicles;
    }, [vehicles, selectedVehicle]);

    // 1. Dynamic Grid Clustering Algorithm
    const clusters = useMemo(() => {
        if (!bounds) return { visibleUnknown: EMPTY_ARRAY, visibleVehicles: displayedVehicles.slice(0, 100) };

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

    return clusters;
}
