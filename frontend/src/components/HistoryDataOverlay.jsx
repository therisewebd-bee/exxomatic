import { MdClose } from 'react-icons/md';
import AddressCell from './AddressCell';

/**
 * HistoryDataOverlay — Extracted from MapView
 * Shows a scrollable table of historical location data for a selected vehicle
 */
export default function HistoryDataOverlay({ vehicle, historyPath, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="absolute right-4 bottom-20 z-[1001] w-80 max-h-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <h3 className="font-bold text-gray-800 text-sm">{vehicle.vechicleNumb || vehicle.imei} Analysis</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MdClose size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <table className="w-full text-left text-[11px]">
          <thead className="sticky top-0 bg-gray-50 text-gray-500 font-semibold">
            <tr>
              <th className="px-2 py-1.5 border-b border-gray-100">Time</th>
              <th className="px-2 py-1.5 border-b border-gray-100 text-center">Speed</th>
              <th className="px-2 py-1.5 border-b border-gray-100 text-center">Status</th>
              <th className="px-2 py-1.5 border-b border-gray-100 text-right">Location</th>
            </tr>
          </thead>
          <tbody>
            {historyPath.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4 text-gray-400 italic">No history available for last 24h</td></tr>
            ) : (
              [...historyPath].reverse().map((loc, idx) => {
                const speed = Number(loc.speed || 0);
                const motionStatus = speed > 3 ? 'moving' : (loc.ignition === true ? 'idle' : 'stopped');
                const statusStyle = {
                  moving:  { dot: 'bg-green-500', text: 'text-green-700', label: 'Moving' },
                  idle:    { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Idle' },
                  stopped: { dot: 'bg-red-500',   text: 'text-red-700',   label: 'Stopped' },
                };
                const s = statusStyle[motionStatus];

                return (
                  <tr key={idx} className="hover:bg-purple-50 transition-colors border-b border-gray-50">
                    <td className="px-2 py-1.5 text-gray-600">
                      {new Date(loc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-2 py-1.5 font-bold text-brand-purple text-center">
                      {speed}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <AddressCell lat={loc.lat} lng={loc.lng} className="max-w-[100px]" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 bg-purple-50 text-[10px] text-brand-purple italic border-t border-purple-100">
        Showing last 24 hours of data (max 500 points)
      </div>
    </div>
  );
}
