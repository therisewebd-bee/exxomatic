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
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [drawingActive, setDrawingActive] = useState(false);
  const [drawnZone, setDrawnZone] = useState(null);

  // WebSocket vehicle tracking — all batching, eviction, and events handled by the hook
  const { livePositions, unknownDevices, notifications, handleViewportChange, totalLiveCount } = useWebSocketVehicles(isAuthenticated, isAdmin);

  // Merge API vehicles with live WS positions
  const mergedVehicles = useMemo(() => {
    const registeredImeis = new Set(vehicles.map(v => v.imei));
    const nowTime = Date.now();
    
    const registered = vehicles.map((v) => {
      const live = livePositions[v.imei];
      const liveAge = live?.timestamp ? (nowTime - new Date(live.timestamp).getTime()) : Infinity;
      const isLiveFresh = liveAge < 120000; // 2 minutes

      let currentStatus = v.status;
      if (isLiveFresh && live) {
         currentStatus = live.motionStatus || (live.speed > 5 ? 'moving' : 'idle');
      } else if (currentStatus === 'online') {
         currentStatus = v.speed > 5 ? 'moving' : 'idle';
      }

      return {
        ...v,
        lat: isLiveFresh ? live.lat : v.lat ?? 0,
        lng: isLiveFresh ? live.lng : v.lng ?? 0,
        speed: currentStatus === 'offline' ? 0 : (isLiveFresh ? live.speed : v.speed ?? 0),
        status: currentStatus,
        isAlert: isLiveFresh ? (live.status === 'ALERT') : false,
        plate: v.vechicleNumb || v.imei,
        isUnregistered: false,
      };
    });

    // For Admin: merge unknown devices into fleet list so they appear in VehicleList
    const unknownAsList = isAdmin
      ? Object.entries(unknownDevices)
          .filter(([imei, pos]) => (nowTime - new Date(pos.timestamp||0).getTime()) < 120000) // hide stale unknowns
          .map(([imei, pos]) => ({
          id: `unregistered-${imei}`,
          imei,
          lat: pos.lat,
          lng: pos.lng,
          speed: pos.speed || 0,
          status: pos.motionStatus || (pos.speed > 5 ? 'moving' : 'idle'),
          isAlert: false,
          plate: `Unregistered (${imei.slice(-6)})`,
          isUnregistered: true,
        }))
      : [];

    // Also include "live-only" registered devices that aren't from REST but arrived via WS
    const liveOnly = Object.entries(livePositions)
      .filter(([imei]) => !registeredImeis.has(imei))
      .map(([imei, pos]) => ({
        id: imei,
        imei,
        lat: pos.lat,
        lng: pos.lng,
        speed: pos.speed || 0,
        status: pos.motionStatus || (pos.speed > 5 ? 'moving' : 'idle'),
        isAlert: pos.status === 'ALERT',
        plate: imei,
        isUnregistered: false,
      }));

    return [...registered, ...liveOnly, ...unknownAsList];
  }, [vehicles, livePositions, unknownDevices, isAdmin]);



  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setActiveTab('liveMap');
  };

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
          />
          <MapView
            vehicles={mergedVehicles}
            livePositions={livePositions}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={setSelectedVehicle}
            unknownDevices={unknownDevices}
            onDrawComplete={handleDrawComplete}
            isAdmin={isAdmin}
            onViewportChange={handleViewportChange}
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
            vehicles={mergedVehicles}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'reports' && <ReportsPanel vehicles={mergedVehicles} />}
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
