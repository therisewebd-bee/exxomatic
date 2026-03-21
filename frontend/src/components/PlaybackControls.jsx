import { useMemo } from 'react';
import AddressCell from './AddressCell';

/**
 * PlaybackControls — Extracted from MapView
 * Shows play/pause, speed selector, scrubber, and enriched status info
 * (moving/idle/stopped + speed + reverse-geocoded location)
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

export default function PlaybackControls({
  isPlaying,
  onTogglePlay,
  playbackIndex,
  onSeek,
  playbackSpeed,
  onSpeedChange,
  historyPath,
  validHistoryPath,
}) {
  const currentIdx = Math.floor(playbackIndex);
  const currentPoint = validHistoryPath[currentIdx];

  const motionStatus = useMemo(() => getMotionStatus(currentPoint), [currentPoint]);
  const config = statusConfig[motionStatus] || statusConfig.stopped;

  const timestamp = currentPoint?.timestamp 
    ? new Date(currentPoint.timestamp).toLocaleTimeString() 
    : '--:--:--';

  const speed = Number(currentPoint?.speed || 0).toFixed(0);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl">
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex flex-col gap-3">
        {/* Top row: Play button + Info + Speed selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
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
                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.bgColor} ${config.textColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${config.color}`}></span>
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
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
            {[1, 2, 5, 10].map(sp => (
              <button
                key={sp}
                onClick={() => onSpeedChange(sp)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${playbackSpeed === sp ? 'bg-white shadow-sm text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrubber */}
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="0" 
            max={validHistoryPath.length - 1} 
            step="0.01"
            value={playbackIndex}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
          />
          <span className="text-[10px] font-mono text-gray-400 min-w-[60px] text-right">
            {currentIdx + 1} / {validHistoryPath.length}
          </span>
        </div>
      </div>
    </div>
  );
}
