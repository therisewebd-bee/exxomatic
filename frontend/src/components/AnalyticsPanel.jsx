import { useState, useEffect } from 'react';
import { getLocationHistory } from '../services/api';
import { useVehiclesQuery } from '../hooks/useQueries';
import { useHistory } from '../context/HistoryContext';
import { MdHistory, MdSpeed, MdTimer, MdMoving } from 'react-icons/md';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AnalyticsPanel() {
  const [selectedImei, setSelectedImei] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { fetchVehicleHistory } = useHistory();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const { data: vehicles = [] } = useVehiclesQuery();

  useEffect(() => {
    if (!selectedImei || !date) return;
    
    let isSubscribed = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const data = await fetchVehicleHistory(selectedImei, start.toISOString(), end.toISOString());

        if (!isSubscribed) return;

        const pts = (data || []).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)) || [];
        
        let totalKm = 0;
        let idleMinutes = 0;
        let runningMinutes = 0;
        let maxSpeed = 0;
        let speedSum = 0;
        let speedCount = 0;

        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          
          const ms = new Date(p2.timestamp).getTime() - new Date(p1.timestamp).getTime();
          const mins = ms / 60000;
          if (mins > 120) continue;

          const dist = getDistanceFromLatLonInKm(p1.lat, p1.lng, p2.lat, p2.lng);
          totalKm += dist;

          const speed = Number(p1.speed || 0);
          if (speed > maxSpeed) maxSpeed = speed;
          if (speed > 5) {
            speedSum += speed;
            speedCount++;
          }

          if (p1.ignition === true && speed < 5) {
            idleMinutes += mins;
          } else if (p1.ignition === true && speed >= 5) {
            runningMinutes += mins;
          }
        }

        setMetrics({ 
          totalKm, 
          idleMinutes, 
          runningMinutes, 
          maxSpeed, 
          avgSpeed: speedCount > 0 ? speedSum / speedCount : 0,
          pointsCount: pts.length,
          rawLogs: pts.reverse() // Newest first for the table
        });
      } catch (err) {

      } finally {
        if(isSubscribed) setLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isSubscribed = false; };
  }, [selectedImei, date]);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 h-screen">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdHistory size={28} className="text-brand-purple" />
            Vehicle Analytics
          </h2>
          
          <div className="flex gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand-purple shadow-sm bg-white"
            />
            <select
              value={selectedImei}
              onChange={(e) => setSelectedImei(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand-purple shadow-sm bg-white min-w-[200px]"
            >
              <option value="">Select Vehicle...</option>
              {vehicles.map((v) => (
                <option key={v.imei} value={v.imei}>{v.vechicleNumb || v.imei}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {!selectedImei ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <MdSpeed size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Select a vehicle to view daily analytics.</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-brand-purple/20 border-t-brand-purple animate-spin"></div>
          </div>
        ) : metrics ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Odometer Summary */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Distance Moved</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <MdMoving size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 tracking-tight">
                    {metrics.totalKm.toFixed(2)} <span className="text-sm text-gray-400 font-medium">km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Idling Report */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Idling Time</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <MdTimer size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 tracking-tight">
                    {metrics.idleMinutes.toFixed(0)} <span className="text-sm text-gray-400 font-medium">min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Max Speed */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Max Speed</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <MdSpeed size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 tracking-tight">
                    {metrics.maxSpeed.toFixed(1)} <span className="text-sm text-gray-400 font-medium">km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Avg Speed */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Avg Speed</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                  <MdMoving size={24} className="rotate-45" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 tracking-tight">
                    {metrics.avgSpeed.toFixed(1)} <span className="text-sm text-gray-400 font-medium">km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Path Logs Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Historical Movement Logs</h3>
                <span className="text-xs text-gray-500 font-medium">{metrics.pointsCount} points captured</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Speed</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Coordinates</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ignition</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {metrics.rawLogs.slice(0, 200).map((log, i) => ( // Show first 200 for performance
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-3 text-sm text-gray-700">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="px-6 py-3 text-sm">
                                    <span className={`font-bold ${Number(log.speed) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {Number(log.speed).toFixed(1)} km/h
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-sm font-mono text-gray-500">
                                    {Number(log.lat).toFixed(4)}, {Number(log.lng).toFixed(4)}
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.ignition ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {log.ignition ? 'ON' : 'OFF'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
          </>
        ) : null}

      </div>
    </div>
  );
}
