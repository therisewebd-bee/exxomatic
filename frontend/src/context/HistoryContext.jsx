import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { getLocationHistory } from '../services/api';
import { getDistanceFromLatLonInKm, enrichLocationHistory } from '../utils/geoUtils';

const HistoryContext = createContext();
const EMPTY_ARRAY = [];


export function HistoryProvider({ children }) {
  const [historyCache, setHistoryCache] = useState({}); // { imei: { data: [], expires: timestamp } }
  const activeRequests = useRef(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheRef = useRef({});
  cacheRef.current = historyCache;

  // Support flexible date ranges and caching
  const fetchVehicleHistory = useCallback(async (imei, startDate, endDate, force = false) => {
    if (!imei) return [];
    
    // Normalize range to hour-level to improve cache hits for "today" views
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    
    const startTs = Math.floor(new Date(start).getTime() / 1800000); // 30-min buckets
    const endTs = Math.floor(new Date(end).getTime() / 1800000);
    const rangeKey = `${imei}_${startTs}_${endTs}`;

    // 1. Check in-memory cache first
    const cached = cacheRef.current[rangeKey];
    if (cached && !force && (Date.now() - cached.timestamp < 300000)) { // 5 min cache
        return cached.data;
    }

    // 2. Concurrency Guard
    if (activeRequests.current.has(rangeKey) && !force) return [];

    activeRequests.current.add(rangeKey);
    setLoading(true);
    setError(null);

    try {
      const res = await getLocationHistory({
        imei,
        startDate: start,
        endDate: end,
        limit: 5000
      });

      const logs = (res.data || [])
        .filter(loc => loc.lat && loc.lng)
        .reverse();

      // Use shared utility to enrich points with derived speed and motion status
      const enriched = enrichLocationHistory(logs);

      // Process logs to create speedChartData
      const speedChartData = enriched.map(loc => ({
        time: new Date(loc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speed: parseFloat(Number(loc.speed).toFixed(1)),
        status: loc.motionStatus
      }));

      setHistoryCache(prev => ({
        ...prev,
        [rangeKey]: { data: enriched, speedChartData, timestamp: Date.now() }
      }));

      return enriched;
    } catch (err) {
      setError('Failed to load history');
      return [];
    } finally {
      activeRequests.current.delete(rangeKey);
      setLoading(false);
    }
  }, []); // No longer depends on historyCache

  // Helper to get cached data for a specific range without re-fetching
  const getHistory = useCallback((imei, startDate, endDate) => {
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    const startTs = Math.floor(new Date(start).getTime() / 1800000);
    const endTs = Math.floor(new Date(end).getTime() / 1800000);
    const rangeKey = `${imei}_${startTs}_${endTs}`;
    
    return historyCache[rangeKey]?.data || EMPTY_ARRAY;
  }, [historyCache]); 

  // Get cached speed chart data (shared between Playback and Analytics)
  const getSpeedChartData = useCallback((imei, startDate, endDate) => {
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    const startTs = Math.floor(new Date(start).getTime() / 1800000);
    const endTs = Math.floor(new Date(end).getTime() / 1800000);
    const rangeKey = `${imei}_${startTs}_${endTs}`;
    return historyCache[rangeKey]?.speedChartData || EMPTY_ARRAY;
  }, [historyCache]);

  const clearHistory = useCallback((imei) => {
    // clear specific imei from cache
  }, []);

  const value = useMemo(() => ({
    historyCache,
    fetchVehicleHistory,
    getHistory,
    getSpeedChartData,
    clearHistory,
    loading,
    error
  }), [historyCache, fetchVehicleHistory, getHistory, getSpeedChartData, clearHistory, loading, error]);

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );

}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
