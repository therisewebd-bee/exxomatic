import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import AddressCell from './AddressCell';

/**
 * PlaybackControls — A fully self-contained subsystem for History Playback.
 * Handles the 60fps animation loop, rendering the ghost-marker in the Leaflet map,
 * and portaling the bottom UI controls completely out of the Leaflet DOM.
 */

const statusConfig = {
  moving:  { label: 'Moving',  color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  idle:    { label: 'Idle',    color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
  stopped: { label: 'Stopped', color: 'bg-red-500',   textColor: 'text-red-700',   bgColor: 'bg-red-50' },
};

function getMotionStatus(point) {
  if (!point) return 'stopped';
  const speed = Number(point.speed || 0);
  if (speed > 3) return 'moving';
  if (point.ignition === true) return 'idle';
  return 'stopped';
}

// Focus icon for the ghost marker
function createFocusIcon(status, isAlert = false, colorOverride = null) {
  const colors = { moving: '#22C55E', stopped: '#64748B', idle: '#F59E0B' };
  const color = colorOverride || (isAlert ? '#EF4444' : (colors[status] || '#7C3AED'));
  return L.divIcon({
    className: 'custom-vehicle-marker-focus',
    html: `
      <div style="width: 38px; height: 38px; background: ${color}; border: 4px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

export default function PlaybackControls({ validHistoryPath, selectedVehicle, overlayTarget }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoFocus, setAutoFocus] = useState(true);
  const map = useMap();

  // Reset when vehicle changes
  useEffect(() => {
    setPlaybackIndex(0);
    setIsPlaying(false);
    setAutoFocus(true);
  }, [selectedVehicle?.imei, validHistoryPath?.length]);

  // Disable auto-focus when user manually drags the map
  useEffect(() => {
    const handleMapDrag = () => setAutoFocus(false);
    map.on('dragstart', handleMapDrag);
    return () => map.off('dragstart', handleMapDrag);
  }, [map]);

  // Interpolated ghost position
  const playbackPos = useMemo(() => {
    if (!validHistoryPath || validHistoryPath.length === 0) return null;
    const idx = Math.floor(playbackIndex);
    const nextIdx = Math.min(idx + 1, validHistoryPath.length - 1);
    const fraction = playbackIndex - idx;

    const p1 = validHistoryPath[idx];
    const p2 = validHistoryPath[nextIdx];
    if (!p1 || !p2) return p1 ? [Number(p1.lat), Number(p1.lng)] : null;
    
    return [
      Number(p1.lat) + (Number(p2.lat) - Number(p1.lat)) * fraction,
      Number(p1.lng) + (Number(p2.lng) - Number(p1.lng)) * fraction
    ];
  }, [validHistoryPath, playbackIndex]);

  // Auto-focus map updates matching playback position
  useEffect(() => {
    if (autoFocus && playbackPos) {
      map.setView(playbackPos, map.getZoom(), { animate: false });
    }
  }, [playbackPos, autoFocus, map]);

  // 60FPS Animation Loop
  useEffect(() => {
    if (isPlaying && validHistoryPath && validHistoryPath.length > 1) {
      let lastTime = performance.now();
      let frameId;

      const step = (now) => {
        const dt = now - lastTime;
        lastTime = now;
        const deltaIndex = (dt / 1000) * playbackSpeed;

        setPlaybackIndex(prev => {
          const next = prev + deltaIndex;
          if (next >= validHistoryPath.length - 1) {
            setIsPlaying(false);
            return validHistoryPath.length - 1;
          }
          return next;
        });
        frameId = requestAnimationFrame(step);
      };
      
      frameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frameId);
    }
  }, [isPlaying, validHistoryPath, playbackSpeed]);

  if (!overlayTarget || !selectedVehicle || !validHistoryPath || validHistoryPath.length === 0) return null;

  const currentIdx = Math.floor(playbackIndex);
  const currentPoint = validHistoryPath[currentIdx];
  const motionStatus = getMotionStatus(currentPoint);
  const config = statusConfig[motionStatus] || statusConfig.stopped;

  const timestamp = currentPoint?.timestamp ? new Date(currentPoint.timestamp).toLocaleTimeString() : '--:--:--';
  const speed = Number(currentPoint?.speed || 0).toFixed(0);

  const isPlaybackActive = isPlaying || playbackIndex > 0;
  
  // Calculate the past and future paths to create a "glowing tail" effect
  const pastPath = isPlaybackActive 
      ? validHistoryPath.slice(0, currentIdx + 2).map(loc => [Number(loc.lat), Number(loc.lng)])
      : validHistoryPath.map(loc => [Number(loc.lat), Number(loc.lng)]);
      
  const futurePath = isPlaybackActive && validHistoryPath.length > 1
      ? validHistoryPath.slice(currentIdx).map(loc => [Number(loc.lat), Number(loc.lng)])
      : [];

  // The Ghost Marker renders directly into the Leaflet DOM, 
  // The Controls render into the overlayTarget external DOM
  return (
    <>
      {pastPath.length > 1 && (
        <Polyline positions={pastPath} pathOptions={{ color: '#3B82F6', weight: 4, opacity: 0.9 }} />
      )}
      
      {futurePath.length > 1 && (
        <Polyline positions={futurePath} pathOptions={{ color: '#94A3B8', weight: 4, opacity: 0.25, dashArray: '5, 10' }} />
      )}

      {playbackPos && (
        <Marker position={playbackPos} icon={createFocusIcon(motionStatus, false, '#3B82F6')} zIndexOffset={1000}>
          <Popup>
            <div className="text-xs min-w-[140px]">
              <div className="font-bold mb-1">Playback Position</div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${config.color}`}></span>
                <span className="font-medium text-gray-600">{config.label}</span>
                <span className="text-gray-400">•</span>
                <span className="font-bold text-gray-800">{speed} km/h</span>
              </div>
              <div className="text-[10px] text-gray-500 mb-1">{timestamp}</div>
              {currentPoint && <AddressCell lat={currentPoint.lat} lng={currentPoint.lng} className="text-[10px] text-gray-400" />}
            </div>
          </Popup>
        </Marker>
      )}

      {createPortal(
        <div className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => validHistoryPath.length > 1 && setIsPlaying(!isPlaying)} 
                  disabled={validHistoryPath.length < 2}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg text-white ${validHistoryPath.length > 1 ? 'bg-brand-purple hover:scale-105 active:scale-95' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">Movement Playback</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.bgColor} ${config.textColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.color}`}></span>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                    <span>{timestamp}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-bold">{speed} km/h</span>
                    {currentPoint && (
                      <>
                        <span className="text-gray-300">•</span>
                        <AddressCell lat={currentPoint.lat} lng={currentPoint.lng} className="max-w-[180px] truncate" />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setAutoFocus(!autoFocus)} 
                  className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${autoFocus ? 'bg-white shadow-sm text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                  title={autoFocus ? "Auto-Focus Active" : "Enable Auto-Focus"}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${autoFocus ? 'bg-brand-purple animate-pulse' : 'bg-gray-400'}`}></div>
                  FOCUS
                </button>
                <div className="w-[1px] h-3 bg-gray-300 mx-1"></div>
                {[1, 2, 5, 10].map(sp => (
                  <button key={sp} onClick={() => setPlaybackSpeed(sp)} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${playbackSpeed === sp ? 'bg-white shadow-sm text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}>
                    {sp}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input 
                type="range" min="0" max={Math.max(0, validHistoryPath.length - 1)} step="0.01" value={playbackIndex}
                onChange={(e) => { setPlaybackIndex(parseFloat(e.target.value)); setIsPlaying(false); }}
                disabled={validHistoryPath.length < 2}
                className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-brand-purple ${validHistoryPath.length > 1 ? 'bg-gray-200' : 'bg-gray-100 cursor-not-allowed'}`}
              />
              <span className="text-[10px] font-mono text-gray-400 min-w-[60px] text-right">
                {currentIdx + 1} / {validHistoryPath.length}
              </span>
            </div>
          </div>
        </div>,
        overlayTarget
      )}
    </>
  );
}
