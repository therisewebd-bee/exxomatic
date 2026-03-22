import { useState, useEffect, useMemo } from 'react';
import { useVehiclesQuery } from '../hooks/useQueries';
import { useHistory } from '../context/HistoryContext';
import { MdHistory, MdSpeed, MdTimer, MdMoving } from 'react-icons/md';
import AddressCell from './AddressCell';
import { getDistanceFromLatLonInKm, calculateSpeed } from '../utils/geoUtils';
import PanelLayout from './ui/PanelLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import SearchableMultiSelect from './ui/SearchableMultiSelect';

export default function AnalyticsPanel() {
  const [selectedImei, setSelectedImei] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { fetchVehicleHistory } = useHistory();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const { data: vehicles = [] } = useVehiclesQuery();

  const vehicleOptions = useMemo(() => 
    vehicles.map(v => ({ id: v.imei, label: v.vechicleNumb || v.imei })),
  [vehicles]);

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
        let stoppedMinutes = 0;
        let unknownMinutes = 0;
        let maxSpeed = 0;
        let speedSum = 0;
        let speedCount = 0;
        let runningPts = 0, idlePts = 0, stoppedPts = 0, unknownPts = 0;

        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          
          const ms = new Date(p2.timestamp).getTime() - new Date(p1.timestamp).getTime();
          const mins = ms / 60000;
          


          const dist = getDistanceFromLatLonInKm(p1.lat, p1.lng, p2.lat, p2.lng);
          totalKm += dist;

          // If reported speed is 0 but distance is significant, derive speed
          let speed = Number(p1.speed || 0);
          if (speed < 1 && dist > 0.01) {
             speed = calculateSpeed(p1, p2);
          }

          if (speed > maxSpeed) maxSpeed = speed;
          if (speed > 3) {
            speedSum += speed;
            speedCount++;
          }

          const isMoving = speed > 3 || dist > 0.03;
          const hasIgnition = p1.ignition === true;

          if (isMoving) {
            runningMinutes += mins;
            runningPts++;
          } else if (hasIgnition) {
            idleMinutes += mins;
            idlePts++;
          } else {
            stoppedMinutes += mins;
            stoppedPts++;
          }
        }

        // Calculate chart speed with the same derived logic
        const speedChartData = [];
        const chartStep = Math.max(1, Math.floor(pts.length / 80)); 
        for (let i = 0; i < pts.length; i += chartStep) {
          let speed = Number(pts[i].speed);
          if (speed < 1 && i < pts.length - 1) {
            speed = calculateSpeed(pts[i], pts[i+1]);
          }
          speedChartData.push({
            time: new Date(pts[i].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            speed: parseFloat(Number(speed).toFixed(1))
          });
        }

        const pieData = [
          { name: 'Running', value: Number(runningMinutes.toFixed(0)), points: runningPts, color: '#10b981' }, 
          { name: 'Idle', value: Number(idleMinutes.toFixed(0)), points: idlePts, color: '#f97316' },     
          { name: 'Stopped', value: Number(stoppedMinutes.toFixed(0)), points: stoppedPts, color: '#ef4444' } 
        ];
        


        setMetrics({ 
          totalKm, 
          idleMinutes, 
          runningMinutes, 
          stoppedMinutes,
          maxSpeed, 
          avgSpeed: speedCount > 0 ? speedSum / speedCount : 0,
          pointsCount: pts.length,
          rawLogs: pts.reverse(), // Newest first for the table
          speedChartData,
          pieData
        });
      } catch (err) {

      } finally {
        if(isSubscribed) setLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isSubscribed = false; };
  }, [selectedImei, date]);

  const controlBar = (
    <div className="flex gap-4 items-center">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand-purple shadow-sm bg-white text-sm"
      />
      <div className="w-[280px]">
        <SearchableMultiSelect 
          options={vehicleOptions}
          selectedIds={selectedImei ? [selectedImei] : []}
          onChange={(ids) => setSelectedImei(ids[0] || '')}
          placeholder="Pick a vehicle..."
          multi={false}
        />
      </div>
    </div>
  );

  return (
    <PanelLayout 
      icon={<MdHistory size={28} className="text-brand-purple" />} 
      title="Vehicle Analytics" 
      action={controlBar} 
      maxWidth="6xl"
    >
      <div className="space-y-8 pb-10">
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6">Speed Overview (km/h)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.speedChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickMargin={10} minTickGap={30} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickMargin={10} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="speed" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6">Activity Breakdown (Mins / {metrics.pointsCount} Pts)</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={metrics.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {metrics.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-1 min-w-[120px]">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }}></div>
                                <span className="font-bold text-gray-800 text-xs uppercase">{data.name}</span>
                              </div>
                              <div className="text-gray-600 text-[11px] font-medium">
                                <span className="text-gray-900 font-bold">{data.value}</span> mins
                                <span className="mx-1 text-gray-300">|</span>
                                <span className="text-gray-900 font-bold">{data.points}</span> pts
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
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
                    <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Speed</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Coordinates</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location (City/State)</th>
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
                                <td className="px-6 py-4 whitespace-nowrap">
                          <AddressCell lat={log.lat} lng={log.lng} className="text-sm font-medium text-gray-700 max-w-[250px]" />
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
    </PanelLayout>
  );
}
