import { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HistoryProvider, useHistory } from './context/HistoryContext';
import Sidebar from './components/Sidebar';
import VehicleList from './components/VehicleList';
import MapView from './components/MapView';
import GeofencePanel from './components/GeofencePanel';
import { useVehiclesQuery } from './hooks/useQueries';
import { useWebSocketVehicles } from './hooks/useWebSocketVehicles';

// Lazy loaded panels to reduce initial bundle size
const ReportsPanel = lazy(() => import('./components/ReportsPanel'));
const IdlingReportPanel = lazy(() => import('./components/IdlingReportPanel'));
const AnalyticsPanel = lazy(() => import('./components/AnalyticsPanel'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const NotificationsPanel = lazy(() => import('./components/NotificationsPanel'));
const VehicleManagementPanel = lazy(() => import('./components/VehicleManagementPanel'));
const UserManagementPanel = lazy(() => import('./components/UserManagementPanel'));
const AuthOverlay = lazy(() => import('./components/AuthOverlay'));

const LazyFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50 h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading module...</p>
    </div>
  </div>
);

function Dashboard() {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('liveMap');
  const { data: vehicles = [] } = useVehiclesQuery(isAuthenticated);
  const [selection, setSelection] = useState({ id: null, ts: 0 });
  const [drawingActive, setDrawingActive] = useState(false);
  const [drawnZone, setDrawnZone] = useState(null);
  const [registerImei, setRegisterImei] = useState(null);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [analyticsImei, setAnalyticsImei] = useState(null);

  // WebSocket vehicle tracking — all batching, eviction, and events handled by the hook
  const { livePositions, unknownDevices, notifications, handleViewportChange, totalLiveCount } = useWebSocketVehicles(isAuthenticated, isAdmin);

  // Merge API vehicles with live WS positions — optimized to avoid O(n log n) sort
  const mergedVehicles = useMemo(() => {
    const nowTime = Date.now();
    
    const registered = vehicles.map((v) => {
      const live = livePositions[v.imei];
      const liveAge = live?.timestamp ? (nowTime - new Date(live.timestamp).getTime()) : Infinity;
      const isLiveFresh = liveAge < 120000;

      let currentStatus = v.status || 'stopped';
      if (isLiveFresh && live) {
         currentStatus = live.motionStatus || (live.speed > 2 ? 'moving' : (live.ignition ? 'idle' : 'stopped'));
      } else if (currentStatus === 'online' || currentStatus === 'moving' || currentStatus === 'idle') {
         // Fallback for stale registered data
         currentStatus = v.speed > 2 ? 'moving' : (v.engine || v.ignition ? 'idle' : 'stopped');
      }

      return {
        ...v,
        lat: isLiveFresh ? live.lat : v.lat ?? 0,
        lng: isLiveFresh ? live.lng : v.lng ?? 0,
        speed: currentStatus === 'offline' ? 0 : (isLiveFresh ? live.speed : v.speed ?? 0),
        status: currentStatus,
        isLive: isLiveFresh, // NEW: Explicit flag for live data communication
        isAlert: isLiveFresh ? (live.status === 'ALERT') : false,
        plate: v.vechicleNumb || v.imei,
        isUnregistered: false,
        diagnostics: isLiveFresh ? (live.diagnostics || {}) : {}
      };
    });

    // For Admin: merge unknown devices via O(N) functional composition
    if (isAdmin) {
      const registeredImeis = new Set(vehicles.map(v => String(v.imei)));

      const unregPool = Object.entries(unknownDevices)
        .filter(([imei, pos]) => 
          !registeredImeis.has(String(imei)) && 
          pos.timestamp && 
          (nowTime - new Date(pos.timestamp).getTime()) <= 120000
        )
        .slice(0, 500)
        .map(([imei, pos]) => ({
          id: `unregistered-${imei}`,
          imei,
          lat: pos.lat,
          lng: pos.lng,
          speed: pos.speed || 0,
          status: pos.motionStatus || (pos.speed > 5 ? 'moving' : 'idle'),
          isLive: true, // Unregistered devices coming from WS are by definition live
          isAlert: false,
          plate: `Unregistered (${imei.slice(-6)})`,
          isUnregistered: true,
          diagnostics: pos.diagnostics || {}
        }));

      registered.push(...unregPool);
    }

    return registered;
  }, [vehicles, livePositions, unknownDevices, isAdmin]);

  const selectedVehicle = useMemo(() => {
    if (!selection.id) return null;
    return mergedVehicles.find(v => v.id === selection.id) || null;
  }, [mergedVehicles, selection.id]);

  const handleSelectVehicle = useCallback((vehicle) => {
    setSelection({ id: vehicle?.id || null, ts: Date.now() });
    setActiveTab('liveMap');
  }, []);

  const handleRegisterRequest = useCallback((imei) => {
    setRegisterImei(imei);
    setActiveTab('vehicles');
  }, []);

  const handleEditRequest = useCallback((vehicle) => {
    setEditVehicleId(vehicle.id);
    setActiveTab('vehicles');
  }, []);

  const handleAnalyzeRequest = useCallback((vehicle) => {
    setAnalyticsImei(vehicle.imei);
    setActiveTab('analytics');
  }, []);

  // Geofence drawing callbacks
  const handleDrawRequested = useCallback(() => {
    setDrawingActive(true);
    setActiveTab('liveMap');
  }, []);

  // Global debug hook
  window.debugDraw = handleDrawRequested;

  const handleDrawComplete = useCallback((zone) => {
    setDrawnZone(zone);
    setDrawingActive(false);
    setActiveTab('geofences');
  }, []);

  const handleDrawConsumed = useCallback(() => {
    setDrawingActive(false);
    setDrawnZone(null);
  }, []);

  const registeredVehiclesOnly = useMemo(() => mergedVehicles.filter(v => !v.isUnregistered), [mergedVehicles]);

  if (!isAuthenticated) return (
    <Suspense fallback={<LazyFallback />}>
      <AuthOverlay />
    </Suspense>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

      {activeTab === 'liveMap' && (
        <>
          <VehicleList
            vehicles={mergedVehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            totalLiveCount={totalLiveCount}
            isAdmin={isAdmin}
            onRegisterRequest={handleRegisterRequest}
            onEditRequest={handleEditRequest}
            onAnalyzeRequest={handleAnalyzeRequest}
          />
          <MapView
            vehicles={registeredVehiclesOnly}
            livePositions={livePositions}
            selectedVehicle={selectedVehicle}
            selectionTime={selection.ts}
            onSelectVehicle={handleSelectVehicle}
            unknownDevices={unknownDevices}
            onDrawComplete={handleDrawComplete}
            isAdmin={isAdmin}
            onViewportChange={handleViewportChange}
            onRegisterRequest={handleRegisterRequest}
            onEditRequest={handleEditRequest}
            onAnalyzeRequest={handleAnalyzeRequest}
          />
        </>
      )}

      <Suspense fallback={<LazyFallback />}>
        {activeTab === 'geofences' && (
          <GeofencePanel
            onDrawRequested={handleDrawRequested}
            drawnZone={drawnZone}
            onDrawConsumed={handleDrawConsumed}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehicleManagementPanel
            vehicles={registeredVehiclesOnly}
            registerImei={registerImei}
            editVehicleId={editVehicleId}
            onClearRegisterImei={() => {
              setRegisterImei(null);
              setEditVehicleId(null);
            }}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsPanel key={analyticsImei} initialImei={analyticsImei} />}
        {activeTab === 'fuel_reports' && <ReportsPanel vehicles={mergedVehicles} />}
        {activeTab === 'idling_reports' && <IdlingReportPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'notifications' && <NotificationsPanel notifications={notifications} />}
        {activeTab === 'users' && <UserManagementPanel />}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <Dashboard />
      </HistoryProvider>
    </AuthProvider>
  );
}
