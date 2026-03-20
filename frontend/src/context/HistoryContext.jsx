import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { getLocationHistory } from '../services/api';

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
      
      // Process logs to create speedChartData
      const speedChartData = logs.map(loc => ({
        time: new Date(loc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speed: parseFloat(Number(loc.speed).toFixed(1))
      }));

      setHistoryCache(prev => ({
        ...prev,
        [rangeKey]: { data: logs, speedChartData: speedChartData, timestamp: Date.now() }
      }));

      return logs;
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
 // getHistory can still depend on cache as it's not used in lifecycle effects typically

  const clearHistory = useCallback((imei) => {
    // ...
  }, []);

  const value = useMemo(() => ({
    historyCache,
    fetchVehicleHistory,
    getHistory,
    clearHistory,
    loading,
    error
  }), [historyCache, fetchVehicleHistory, getHistory, clearHistory, loading, error]);

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
