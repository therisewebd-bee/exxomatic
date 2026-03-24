import { useState, useEffect, useCallback, useRef } from 'react';
import * as ws from '../services/websocket';


/**
 * useWebSocketVehicles — Manages live vehicle positions from WebSocket
 * Optimized for high-throughput: minimal allocations, no spread operators in hot paths
 */
export function useWebSocketVehicles(isAuthenticated, isAdmin) {
  const [livePositions, setLivePositions] = useState({});
  const [unknownDevices, setUnknownDevices] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [totalLiveCount, setTotalLiveCount] = useState(0);

  const activeImeisRef = useRef(new Map());
  const viewportRef = useRef(null);
  const evictCounter = useRef(0);

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
    let hasLiveData = false;
    let hasUnknownData = false;
    let bufferTimer;

    const flushBuffers = () => {
      // ── Active IMEI count (temporal GC) ──────────────────
      const nowTime = Date.now();
      let count = 0;
      for (const [imei, timestamp] of activeImeisRef.current.entries()) {
        if (nowTime - timestamp > 120000) {
          activeImeisRef.current.delete(imei);
        } else {
          count++;
        }
      }
      setTotalLiveCount(count);

      // ── Live Positions ───────────────────────────────────
      if (hasLiveData) {
        const pending = liveBuffer;
        liveBuffer = {};
        hasLiveData = false;

        // Auto-evict newly registered trackers from the Unknown Devices panel
        setUnknownDevices(prevUnknown => {
          let modified = false;
          const nextUnknown = { ...prevUnknown };
          for (const imei of Object.keys(pending)) {
            if (nextUnknown[imei]) {
              delete nextUnknown[imei];
              modified = true;
            }
          }
          return modified ? nextUnknown : prevUnknown;
        });

        setLivePositions(prev => {
          // Mutate-and-return: O(keys in pending) instead of O(keys in prev + pending)
          const next = Object.assign({}, prev, pending);

          // Every ~10 flushes (~5s), evict out-of-viewport entries
          evictCounter.current++;
          if (evictCounter.current >= 10 && viewportRef.current) {
            evictCounter.current = 0;
            const vp = viewportRef.current;
            const bLat = (vp.neLat - vp.swLat) * 0.5;
            const bLng = (vp.neLng - vp.swLng) * 0.5;
            const keys = Object.keys(next);
            if (keys.length > 2000) {
              for (const key of keys) {
                const pos = next[key];
                if (!pos.lat || !pos.lng) continue;
                if (pos.lat < (vp.swLat - bLat) || pos.lat > (vp.neLat + bLat) ||
                  pos.lng < (vp.swLng - bLng) || pos.lng > (vp.neLng + bLng)) {
                  delete next[key];
                }
              }
            }
          }
          return next;
        });
      }

      // ── Unknown Devices ──────────────────────────────────
      if (hasUnknownData) {
        const pending = unknownBuffer;
        unknownBuffer = {};
        hasUnknownData = false;

        setUnknownDevices(prev => {
          const next = Object.assign({}, prev, pending);
          // Hard cap at 2000 — simple FIFO eviction
          const keys = Object.keys(next);
          if (keys.length > 2000) {
            const excess = keys.length - 2000;
            for (let i = 0; i < excess; i++) {
              delete next[keys[i]];
            }
          }
          return next;
        });
      }
    };

    function handleEventBatch(payload) {
      const items = Array.isArray(payload) ? payload : [payload];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const loc = item.location;
        if (!loc) continue;

        activeImeisRef.current.set(loc.imei, Date.now());

        const isUnknown = item.status === 'UNKNOWN_DEVICE' || item.batchEvent === 'tracker:unknown';
        const update = {
          lat: loc.lat,
          lng: loc.lng,
          speed: loc.speed || 0,
          ignition: loc.ignition,
          timestamp: loc.timestamp,
          status: item.status,
          motionStatus: item.motionStatus,
          diagnostics: item.diagnostics || {}
        };
        if (isUnknown) {
          unknownBuffer[loc.imei] = update;
          hasUnknownData = true;
        } else {
          liveBuffer[loc.imei] = update;
          hasLiveData = true;
        }
      }
    }

    // 500ms flush — smooth enough for UI, halves state churn vs 250ms
    bufferTimer = setInterval(flushBuffers, 500);

    function handleBreach(data) {
      setNotifications(prev => [
        {
          id: Date.now().toString() + Math.random(),
          title: 'Geofence Breach',
          message: `Vehicle ${data.imei} ${data.action} ${data.geofence?.name || 'zone'}`,
          timestamp: new Date().toISOString(),
          ...data,
        },
        ...prev.slice(0, 99), // Cap notifications at 100
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

  return { livePositions, unknownDevices, notifications, viewportRef, handleViewportChange, totalLiveCount };
}

