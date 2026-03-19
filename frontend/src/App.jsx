import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthOverlay from './components/AuthOverlay';
import Sidebar from './components/Sidebar';
import VehicleList from './components/VehicleList';
import MapView from './components/MapView';
import { getVehicles } from './services/api';
import * as ws from './services/websocket';

// Lazy loaded panels to reduce initial bundle size
const GeofencePanel = lazy(() => import('./components/GeofencePanel'));
const ReportsPanel = lazy(() => import('./components/ReportsPanel'));
const AnalyticsPanel = lazy(() => import('./components/AnalyticsPanel'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const NotificationsPanel = lazy(() => import('./components/NotificationsPanel'));
const VehicleManagementPanel = lazy(() => import('./components/VehicleManagementPanel'));

const LazyFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50 h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading module...</p>
    </div>
  </div>
);

function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('liveMap');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [livePositions, setLivePositions] = useState({});   // { imei: { lat, lng, timestamp } }
  const [unknownDevices, setUnknownDevices] = useState({});  // { imei: { lat, lng, timestamp } }
  const [notifications, setNotifications] = useState([]);
  const [drawingActive, setDrawingActive] = useState(false);
  const [drawnZone, setDrawnZone] = useState(null);

  // Fetch vehicles from API
  useEffect(() => {
    if (!isAuthenticated) return;
    getVehicles()
      .then((res) => setVehicles(res.data || []))
      .catch((e) => console.error('Failed to load vehicles', e));
  }, [isAuthenticated]);

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!isAuthenticated) return;

    let liveBuffer = {};
    let unknownBuffer = {};
    let bufferTimer = null;

    const flushBuffers = () => {
      if (Object.keys(liveBuffer).length > 0) {
        setLivePositions(prev => ({ ...prev, ...liveBuffer }));
        liveBuffer = {};
      }
      if (Object.keys(unknownBuffer).length > 0) {
        setUnknownDevices(prev => ({ ...prev, ...unknownBuffer }));
        unknownBuffer = {};
      }
    };

    function handleLive(data) {
      const loc = data.location;
      if (!loc) return;
      liveBuffer[loc.imei] = { lat: loc.lat, lng: loc.lng, speed: loc.speed || 0, ignition: loc.ignition, timestamp: loc.timestamp };
    }

    function handleUnknown(data) {
      const loc = data.location;
      if (!loc) return;
      // We also handle 'unknown' devices broadcasting as live payload per recent backend changes
      if (data.status === 'UNKNOWN_DEVICE') {
        unknownBuffer[loc.imei] = { lat: loc.lat, lng: loc.lng, speed: loc.speed || 0, timestamp: loc.timestamp };
      } else {
        liveBuffer[loc.imei] = { lat: loc.lat, lng: loc.lng, speed: loc.speed || 0, ignition: loc.ignition, timestamp: loc.timestamp };
      }
    }

    // Flush updates to React twice a second (500ms) to prevent UI freezing
    bufferTimer = setInterval(flushBuffers, 500);

    function handleBreach(data) {
      setNotifications((prev) => [
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

    ws.on('tracker:live', handleLive);
    ws.on('tracker:unknown', handleUnknown);
    ws.on('geofence:breach', handleBreach);

    return () => {
      clearInterval(bufferTimer);
      ws.off('tracker:live', handleLive);
      ws.off('tracker:unknown', handleUnknown);
      ws.off('geofence:breach', handleBreach);
    };
  }, [isAuthenticated]);

  // Merge API vehicles with live WS positions
  const registeredVehicles = vehicles.map((v) => {
    const live = livePositions[v.imei];
    return {
      ...v,
      lat: live?.lat ?? v.lat ?? 0,
      lng: live?.lng ?? v.lng ?? 0,
      speed: live?.speed ?? v.speed ?? 0,
      status: live ? (live.speed > 3 ? 'moving' : 'idle') : 'stopped',
      plate: v.vechicleNumb || v.imei,
    };
  });

  // Also include unregistered devices that are actively sending data
  const registeredImeis = new Set(vehicles.map(v => v.imei));
  const liveOnlyVehicles = Object.entries(livePositions)
    .filter(([imei]) => !registeredImeis.has(imei))
    .map(([imei, pos]) => ({
      id: imei,
      imei,
      lat: pos.lat,
      lng: pos.lng,
      speed: pos.speed || 0,
      status: pos.speed > 3 ? 'moving' : 'idle',
      plate: imei,
    }));

  const mergedVehicles = [...registeredVehicles, ...liveOnlyVehicles];

  const handleSelectVehicle = (vehicle) => setSelectedVehicle(vehicle);

  // Geofence drawing callbacks
  const handleDrawRequested = useCallback(() => {
    setDrawingActive(true);
    setActiveTab('liveMap');
  }, []);

  const handleDrawComplete = useCallback((zone) => {
    setDrawnZone(zone);
    setDrawingActive(false);
    setActiveTab('geofences');
  }, []);

  const handleDrawConsumed = useCallback(() => {
    setDrawingActive(false);
    setDrawnZone(null);
  }, []);

  if (!isAuthenticated) return <AuthOverlay />;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

      {activeTab === 'liveMap' && (
        <>
          <VehicleList
            vehicles={mergedVehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
          />
          <MapView
            vehicles={mergedVehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            unknownDevices={unknownDevices}
            drawingActive={true}
            onDrawComplete={handleDrawComplete}
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
        {activeTab === 'reports' && <ReportsPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'notifications' && <NotificationsPanel notifications={notifications} />}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
