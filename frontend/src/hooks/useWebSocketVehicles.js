import { useState, useEffect, useCallback, useRef } from 'react';
import * as ws from '../services/websocket';


/**
 * useWebSocketVehicles — Manages live vehicle positions from WebSocket
 * Handles batching, viewport-based eviction, and unknown device tracking
 *
 * Usage:
 *   const { livePositions, unknownDevices, notifications, viewportRef } = useWebSocketVehicles(isAuthenticated);
 */
export function useWebSocketVehicles(isAuthenticated, isAdmin) {
  const [livePositions, setLivePositions] = useState({});
  const [unknownDevices, setUnknownDevices] = useState({});
  const [notifications, setNotifications] = useState([]);

  const viewportRef = useRef(null);
  const evictCounter = useRef(0);
  const MAX_LIVE_ENTRIES = 2000;

  const handleViewportChange = useCallback((bounds) => {
    viewportRef.current = bounds;
    if (isAdmin) {
      ws.sendViewport(bounds);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let liveBuffer = {};
    let unknownBuffer = {};
    let bufferTimer;

    const flushBuffers = () => {
      if (Object.keys(liveBuffer).length > 0) {
        setLivePositions(prev => {
          const merged = { ...prev, ...liveBuffer };

          // Every ~10 flushes (2.5s), evict vehicles outside viewport
          evictCounter.current++;
          if (evictCounter.current >= 10 && viewportRef.current) {
            evictCounter.current = 0;
            const vp = viewportRef.current;
            const bLat = (vp.neLat - vp.swLat) * 0.5;
            const bLng = (vp.neLng - vp.swLng) * 0.5;
            const keys = Object.keys(merged);
            if (keys.length > MAX_LIVE_ENTRIES) {
              for (const key of keys) {
                const pos = merged[key];
                if (!pos.lat || !pos.lng) continue;
                if (pos.lat < (vp.swLat - bLat) || pos.lat > (vp.neLat + bLat) ||
                    pos.lng < (vp.swLng - bLng) || pos.lng > (vp.neLng + bLng)) {
                  delete merged[key];
                }
              }
            }
          }
          return merged;
        });
        liveBuffer = {};
      }
      if (Object.keys(unknownBuffer).length > 0) {
        setUnknownDevices(prev => {
          const merged = { ...prev, ...unknownBuffer };
          // Apply the same viewport eviction to unknowns
          if (evictCounter.current >= 10 && viewportRef.current) {
            const vp = viewportRef.current;
            const bLat = (vp.neLat - vp.swLat) * 0.5;
            const bLng = (vp.neLng - vp.swLng) * 0.5;
            const keys = Object.keys(merged);
            if (keys.length > 2000) { // Bumped cap to 2000 before culling
              for (const key of keys) {
                const pos = merged[key];
                if (!pos.lat || !pos.lng) continue;
                if (pos.lat < (vp.swLat - bLat) || pos.lat > (vp.neLat + bLat) ||
                    pos.lng < (vp.swLng - bLng) || pos.lng > (vp.neLng + bLng)) {
                  delete merged[key];
                }
              }
            }
          }
          const finalKeys = Object.keys(merged);
          if (finalKeys.length > 3000) {
            finalKeys.slice(0, finalKeys.length - 3000).forEach(k => delete merged[k]);
          }
          return merged;
        });
        unknownBuffer = {};
      }
    };

    function handleEventBatch(payload) {
      const items = Array.isArray(payload) ? payload : [payload];
      items.forEach(item => {
        const loc = item.location;
        if (!loc) return;
        const isUnknown = item.status === 'UNKNOWN_DEVICE' || item.batchEvent === 'tracker:unknown';
        const update = {
          lat: loc.lat,
          lng: loc.lng,
          speed: loc.speed || 0,
          ignition: loc.ignition,
          timestamp: loc.timestamp,
          status: item.status,
          motionStatus: item.motionStatus
        };
        if (isUnknown) {
          unknownBuffer[loc.imei] = update;
        } else {
          liveBuffer[loc.imei] = update;
        }
      });
    }

    bufferTimer = setInterval(flushBuffers, 1000);

    function handleBreach(data) {
      setNotifications(prev => [
        {
          id: Date.now().toString() + Math.random(),
          title: 'Geofence Breach',
          message: `Vehicle ${data.imei} ${data.action} ${data.geofence?.name || 'zone'}`,
          timestamp: new Date().toISOString(),
          ...data,
        },
        ...prev,
      ]);
    }

    ws.on('tracker:live', handleEventBatch);
    ws.on('tracker:live:batch', handleEventBatch);
    ws.on('tracker:unknown', handleEventBatch);
    ws.on('geofence:breach', handleBreach);

    return () => {
      clearInterval(bufferTimer);
      ws.off('tracker:live', handleEventBatch);
      ws.off('tracker:live:batch', handleEventBatch);
      ws.off('tracker:unknown', handleEventBatch);
      ws.off('geofence:breach', handleBreach);
    };
  }, [isAuthenticated]);

  return { livePositions, unknownDevices, notifications, viewportRef, handleViewportChange };
}
