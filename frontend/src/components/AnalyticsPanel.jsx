import { useState, useEffect } from 'react';
import { getVehicles, getLocationHistory } from '../services/api';
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
  const [vehicles, setVehicles] = useState([]);
  const [selectedImei, setSelectedImei] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    getVehicles().then((res) => setVehicles(res.data || [])).catch(console.error);
  }, []);

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

        const res = await getLocationHistory({
          imei: selectedImei,
          start: start.toISOString(),
          end: end.toISOString()
        });

        if (!isSubscribed) return;

        const pts = res.data?.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)) || [];
        
        let totalKm = 0;
        let idleMinutes = 0;
        let runningMinutes = 0;

        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          
          const ms = new Date(p2.timestamp).getTime() - new Date(p1.timestamp).getTime();
          const mins = ms / 60000;
          
          // Skip data gaps larger than 2 hours to avoid skewed lines/times
          if (mins > 120) continue;

          // Distance
          const dist = getDistanceFromLatLonInKm(p1.lat, p1.lng, p2.lat, p2.lng);
          totalKm += dist;

          // Idling Logic: IGN ON, Engine ON (assuming IGN=ON means engine is on for this dataset), Speed < 5 km/h
          const speed = Number(p1.speed || 0);
          if (p1.ignition === true && speed < 5) {
            idleMinutes += mins;
          } else if (p1.ignition === true && speed >= 5) {
            runningMinutes += mins;
          }
        }

        setMetrics({ totalKm, idleMinutes, runningMinutes, pointsCount: pts.length });
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        if(isSubscribed) setLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isSubscribed = false; };
  }, [selectedImei, date]);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
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
                <option key={v.imei} value={v.imei}>{v.plate || v.imei}</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Odometer Summary */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-2">Daily Summary Report</h3>
                <p className="text-gray-400 text-sm mb-6">Total computed running distance for {date}</p>
              </div>
              <div className="flex items-end gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <MdMoving size={32} />
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-800 tracking-tight">
                    {metrics.totalKm.toFixed(2)} <span className="text-lg text-gray-400 font-medium">km</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">From {metrics.pointsCount} GPS logs</p>
                </div>
              </div>
            </div>

            {/* Idling Report */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-2">Vehicle Idling Report</h3>
                <p className="text-gray-400 text-sm mb-6">Time spent with Engine ON and Speed &lt; 5 km/h</p>
              </div>
              
              <div className="flex items-end gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                  <MdTimer size={32} />
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-800 tracking-tight">
                    {metrics.idleMinutes.toFixed(0)} <span className="text-lg text-gray-400 font-medium">min</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">Total Idle Time</p>
                </div>
              </div>

              {/* Graphical Format */}
              <div className="w-full bg-gray-100 rounded-full h-4 flex overflow-hidden">
                {metrics.runningMinutes + metrics.idleMinutes > 0 ? (
                  <>
                    <div 
                      className="bg-green-500 h-full transition-all duration-1000 relative group"
                      style={{ width: `${(metrics.runningMinutes / (metrics.runningMinutes + metrics.idleMinutes)) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100">
                        Running {Math.round(metrics.runningMinutes)}m
                      </div>
                    </div>
                    <div 
                      className="bg-orange-500 h-full transition-all duration-1000 relative group"
                      style={{ width: `${(metrics.idleMinutes / (metrics.runningMinutes + metrics.idleMinutes)) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100">
                        Idling {Math.round(metrics.idleMinutes)}m
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full bg-gray-200 h-full"></div>
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-medium mt-2 px-1">
                <span>Running</span>
                <span>Idling</span>
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
