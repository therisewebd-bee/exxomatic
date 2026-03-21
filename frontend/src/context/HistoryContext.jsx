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

  // Support flexible date ranges and caching
  // We use functional updates or internal checks to keep this stable
  const fetchVehicleHistory = useCallback(async (imei, startDate, endDate, force = false) => {
    if (!imei) return [];
    const now = Date.now();
    const CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutes

    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    
    const startObj = new Date(start);
    startObj.setMinutes(0, 0, 0);
    const endObj = new Date(end);
    endObj.setMinutes(0, 0, 0);
    const rangeKey = `${imei}_${startObj.getTime()}_${endObj.getTime()}`;

    // Concurrency & Redundancy Guard
    if (activeRequests.current.has(rangeKey) && !force) return [];
    if (historyCache[rangeKey] && !force && (Date.now() - historyCache[rangeKey].timestamp < 30000)) {
        return historyCache[rangeKey].data;
    }

    // Optimization: avoid loading state if we already have it in local state closure is tricky
    // but the effect in MapView will handle the data flow.
    // To truely avoid the loop, we MUST NOT let this function reference change when cache changes.
    // We'll rely on setHistoryCache's functional update to check 'prev' if needed, 
    // but for the initial check, we'll just proceed or use a simpler check.

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
  }, []); // STABLE CALLBACK - NO DEPENDENCIES

  // Helper to get cached data for a specific range without re-fetching
  const getHistory = useCallback((imei, startDate, endDate) => {
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    
    const startObj = new Date(start);
    startObj.setMinutes(0, 0, 0);
    const endObj = new Date(end);
    endObj.setMinutes(0, 0, 0);
    const rangeKey = `${imei}_${startObj.getTime()}_${endObj.getTime()}`;
    
    return historyCache[rangeKey]?.data || EMPTY_ARRAY;
  }, [historyCache]); 

  // Get cached speed chart data (shared between Playback and Analytics)
  const getSpeedChartData = useCallback((imei, startDate, endDate) => {
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    const startObj = new Date(start);
    startObj.setMinutes(0, 0, 0);
    const endObj = new Date(end);
    endObj.setMinutes(0, 0, 0);
    const rangeKey = `${imei}_${startObj.getTime()}_${endObj.getTime()}`;
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
