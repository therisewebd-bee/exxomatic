import { createContext, useContext, useState, useCallback } from 'react';
import { getLocationHistory } from '../services/api';

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [historyCache, setHistoryCache] = useState({}); // { imei: { data: [], expires: timestamp } }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Support flexible date ranges and caching
  const fetchVehicleHistory = useCallback(async (imei, startDate, endDate, force = false) => {
    const now = Date.now();
    const CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutes

    // Default to last 24h if no dates provided
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    
    // Composite key for caching different ranges
    const rangeKey = `${imei}_${start.slice(0, 13)}_${end.slice(0, 13)}`; // Hourly precision for cache keys

    if (!force && historyCache[rangeKey] && (now - historyCache[rangeKey].timestamp < CACHE_STALE_TIME)) {

      return historyCache[rangeKey].data;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getLocationHistory({
        imei,
        startDate: start,
        endDate: end,
        limit: 1000
      });

      const logs = (res.data || []).filter(loc => loc.lat && loc.lng);
      
      setHistoryCache(prev => ({
        ...prev,
        [rangeKey]: { data: logs, timestamp: Date.now() }
      }));

      return logs;
    } catch (err) {

      setError('Failed to load history');
      return [];
    } finally {
      setLoading(false);
    }
  }, [historyCache]);

  // Helper to get cached data for a specific range without re-fetching
  const getHistory = useCallback((imei, startDate, endDate) => {
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    const rangeKey = `${imei}_${start.slice(0, 13)}_${end.slice(0, 13)}`;
    return historyCache[rangeKey]?.data || [];
  }, [historyCache]);

  const clearHistory = useCallback((imei) => {
    // ...
  }, []);

  return (
    <HistoryContext.Provider value={{
      historyCache,
      fetchVehicleHistory,
      getHistory,
      clearHistory,
      loading,
      error
    }}>
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
