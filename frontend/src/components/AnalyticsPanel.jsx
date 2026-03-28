import { useState, useEffect, useMemo } from 'react';
import { useVehiclesQuery } from '../hooks/useQueries';
import { useHistory } from '../context/HistoryContext';
import { MdHistory, MdSpeed, MdTimer, MdMoving } from 'react-icons/md';
import AddressCell from './AddressCell';
import { getDistanceFromLatLonInKm, calculateSpeed } from '../utils/geoUtils';
import PanelLayout from './ui/PanelLayout';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import SearchableMultiSelect from './ui/SearchableMultiSelect';

export default function AnalyticsPanel({ initialImei }) {
  const [selectedImei, setSelectedImei] = useState(initialImei || '');
  const [filter, setFilter] = useState('all');
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
        
        let haversineKm = 0;
        let idleMinutes = 0;
        let runningMinutes = 0;
        let stoppedMinutes = 0;
        let maxSpeed = 0;
        let speedSum = 0;
        let speedCount = 0;
        let runningPts = 0, idlePts = 0, stoppedPts = 0;

        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          
          const ms = new Date(p2.timestamp).getTime() - new Date(p1.timestamp).getTime();
          const mins = ms / 60000;

          const dist = getDistanceFromLatLonInKm(p1.lat, p1.lng, p2.lat, p2.lng);
          haversineKm += dist;

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

          const computedStatus = isMoving ? 'moving' : (hasIgnition ? 'idle' : 'stopped');
          p1.computedStatus = computedStatus;

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

        // Apply computedStatus to the very last point
        if (pts.length > 0) {
          const lastPt = pts[pts.length - 1];
          const lastSpeed = Number(lastPt.speed || 0);
          lastPt.computedStatus = lastSpeed > 3 ? 'moving' : (lastPt.ignition === true ? 'idle' : 'stopped');
        }

        // ── Real Odometer: use hardware ECU value if available ──
        const firstOdo = pts.length > 0 ? Number(pts[0].odometer) : NaN;
        const lastOdo = pts.length > 0 ? Number(pts[pts.length - 1].odometer) : NaN;
        const hasRealOdometer = !isNaN(firstOdo) && !isNaN(lastOdo) && lastOdo >= firstOdo;
        const totalKm = hasRealOdometer ? (lastOdo - firstOdo) : haversineKm;

        // ── Speed + Battery chart data ──
        const speedChartData = [];
        const tempChartData = [];
        const odometerChartData = [];
        const batteryBarData = [];
        const chartStep = Math.max(1, Math.floor(pts.length / 80)); 
        for (let i = 0; i < pts.length; i += chartStep) {
          const p = pts[i];
          const timeLabel = new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          let speed = Number(p.speed);
          if (speed < 1 && i < pts.length - 1) {
            speed = calculateSpeed(p, pts[i+1]);
          }
          speedChartData.push({
            time: timeLabel,
            speed: parseFloat(Number(speed).toFixed(1)),
            battery: p.batteryVoltage != null ? Number(p.batteryVoltage) : null,
            inputV: p.inputVoltage != null ? Number(p.inputVoltage) : null,
          });

          // Temperature timeline
          if (p.temperature != null) {
            tempChartData.push({ time: timeLabel, temp: Number(p.temperature) });
          }

          // Odometer progression
          if (p.odometer != null) {
            odometerChartData.push({ time: timeLabel, odometer: Number(p.odometer) });
          }

          // Battery health & charge
          if (p.batteryHealth != null || p.batteryCharge != null) {
            batteryBarData.push({
              time: timeLabel,
              health: p.batteryHealth != null ? Number(p.batteryHealth) : 0,
              charge: p.batteryCharge != null ? Number(p.batteryCharge) : 0,
            });
          }
        }

        const pieData = [
          { name: 'Running', value: Number(runningMinutes.toFixed(0)), points: runningPts, color: '#10b981' }, 
          { name: 'Idle', value: Number(idleMinutes.toFixed(0)), points: idlePts, color: '#f97316' },     
          { name: 'Stopped', value: Number(stoppedMinutes.toFixed(0)), points: stoppedPts, color: '#ef4444' } 
        ];

        setMetrics({ 
          totalKm, 
          hasRealOdometer,
          idleMinutes, 
          runningMinutes, 
          stoppedMinutes,
          maxSpeed, 
          avgSpeed: speedCount > 0 ? speedSum / speedCount : 0,
          pointsCount: pts.length,
          rawLogs: pts.reverse(), // Newest first for the table
          speedChartData,
          tempChartData,
          odometerChartData,
          batteryBarData,
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
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                    metrics.hasRealOdometer 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {metrics.hasRealOdometer ? 'ECU Odometer' : 'GPS Estimate'}
                  </span>
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
              <h3 className="font-bold text-gray-800 mb-6">Speed & Battery Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.speedChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickMargin={10} minTickGap={30} />
                    <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} tickMargin={10} domain={[0, 30]} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                    <Line yAxisId="right" type="monotone" dataKey="inputV" name="Vehicle Bat (V)" stroke="#10b981" strokeWidth={2} dot={false} connectNulls />
                    <Line yAxisId="right" type="monotone" dataKey="battery" name="Int. Bat (V)" stroke="#f97316" strokeWidth={1.5} dot={false} strokeDasharray="4 2" connectNulls />
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

          {/* ── New Hardware Charts Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Temperature Timeline */}
            {metrics.tempChartData.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Temperature (°C)</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.tempChartData}>
                      <defs>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="time" fontSize={10} stroke="#9ca3af" minTickGap={20} />
                      <YAxis fontSize={10} stroke="#9ca3af" />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="temp" name="Temp °C" stroke="#ef4444" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Battery Health & Charge */}
            {metrics.batteryBarData.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Battery Health & Charge (%)</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.batteryBarData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="time" fontSize={10} stroke="#9ca3af" minTickGap={20} />
                      <YAxis fontSize={10} stroke="#9ca3af" domain={[0, 100]} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="health" name="Health %" fill="#6366f1" radius={[4,4,0,0]} barSize={8} />
                      <Bar dataKey="charge" name="Charge %" fill="#10b981" radius={[4,4,0,0]} barSize={8} />
                      <Legend iconType="circle" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Odometer Progression */}
            {metrics.odometerChartData.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Odometer (km)</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.odometerChartData}>
                      <defs>
                        <linearGradient id="odoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="time" fontSize={10} stroke="#9ca3af" minTickGap={20} />
                      <YAxis fontSize={10} stroke="#9ca3af" />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="odometer" name="Odometer km" stroke="#3b82f6" fill="url(#odoGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Path Logs Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-800">Historical Movement Logs</h3>
                  <span className="text-[10px] text-gray-500 font-bold px-2 py-0.5 bg-gray-200 rounded-full">{metrics.pointsCount} points</span>
                </div>
                <div className="flex gap-2">
                  {['all', 'moving', 'idle', 'stopped'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border transition-colors ${
                        filter === f 
                          ? 'bg-brand-purple text-white border-brand-purple shadow hover:bg-brand-purple/90' 
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto w-full">
                <table className="w-full text-left selectable-text">
                    <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Speed</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Coords</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">IGN</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Odo (km)</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bat (V)</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Temp</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Engine</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {metrics.rawLogs
                          .filter(log => filter === 'all' || log.computedStatus === filter)
                          .slice(0, 200).map((log, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-700">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`font-bold ${Number(log.speed) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {Number(log.speed).toFixed(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-[11px] font-mono text-gray-500">
                                    {Number(log.lat).toFixed(4)}, {Number(log.lng).toFixed(4)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <AddressCell lat={log.lat} lng={log.lng} className="text-sm font-medium text-gray-700 max-w-[200px]" />
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.ignition ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {log.ignition ? 'ON' : 'OFF'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                    {log.odometer != null ? Number(log.odometer).toFixed(1) : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {log.batteryVoltage != null ? `${Number(log.batteryVoltage).toFixed(2)}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {log.temperature != null ? `${Number(log.temperature).toFixed(1)}°` : '-'}
                                </td>
                                <td className="px-4 py-3">
                                    {log.engine != null ? (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.engine ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {log.engine ? 'ON' : 'OFF'}
                                        </span>
                                    ) : '-'}
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
