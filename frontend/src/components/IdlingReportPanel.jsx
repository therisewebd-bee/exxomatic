import { useState, useMemo } from 'react';
import { useVehiclesQuery } from '../hooks/useQueries';
import { useHistory } from '../context/HistoryContext';
import { MdTimer, MdLocalParking, MdTimeline, MdDirectionsCar } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';
import DataTable from './ui/DataTable';
import StatCard from './ui/StatCard';

export default function IdlingReportPanel() {
  const { data: vehicles = [] } = useVehiclesQuery();
  const { fetchVehicleHistory, loading } = useHistory();
  
  const [selectedImei, setSelectedImei] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [idlingEvents, setIdlingEvents] = useState([]);
  const [hasScanned, setHasScanned] = useState(false);

  async function handleGenerateReport() {
    if (!selectedImei) return alert('Select a vehicle first');
    
    setHasScanned(false);
    const result = await fetchVehicleHistory(selectedImei, date, date);
    
    if (result && result.path && result.path.length > 0) {
      const pts = [...result.path].reverse(); // Sort chronological if it was descending
      // We assume points are chronological now
      
      const events = [];
      let currentEvent = null;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const isIdling = p.ignition === true && Number(p.speed || 0) < 3;

        if (isIdling) {
          if (!currentEvent) {
            currentEvent = {
              startTime: new Date(p.timestamp),
              startLat: p.lat,
              startLng: p.lng,
              pointsCount: 1,
              endTime: new Date(p.timestamp)
            };
          } else {
            currentEvent.endTime = new Date(p.timestamp);
            currentEvent.pointsCount++;
          }
        } else {
          if (currentEvent) {
            // Event ended! Process duration
            const durationMs = currentEvent.endTime.getTime() - currentEvent.startTime.getTime();
            const durationMins = Math.round(durationMs / 60000);
            
            // Only count if idling was longer than 2 minutes to avoid false positives at red lights
            if (durationMins >= 2) {
              events.push({
                ...currentEvent,
                duration: durationMins,
                id: `idle-${currentEvent.startTime.getTime()}`
              });
            }
            currentEvent = null;
          }
        }
      }

      // Close trailing event
      if (currentEvent) {
        const durationMs = currentEvent.endTime.getTime() - currentEvent.startTime.getTime();
        const durationMins = Math.round(durationMs / 60000);
        if (durationMins >= 2) {
          events.push({
             ...currentEvent,
             duration: durationMins,
             id: `idle-${currentEvent.startTime.getTime()}`
          });
        }
      }

      setIdlingEvents(events.reverse()); // latest first
    } else {
      setIdlingEvents([]);
    }
    setHasScanned(true);
  }

  const { totalIdlingTime, totalIncidents } = useMemo(() => {
    return {
      totalIdlingTime: idlingEvents.reduce((sum, e) => sum + e.duration, 0),
      totalIncidents: idlingEvents.length
    };
  }, [idlingEvents]);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'start', label: 'Idle Start Time' },
    { key: 'end', label: 'Idle End Time' },
    { key: 'duration', label: 'Duration (Minutes)' },
    { key: 'location', label: 'GPS Coordinates' }
  ];

  const vehicleSelector = (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <select 
        value={selectedImei} onChange={(e) => setSelectedImei(e.target.value)}
        className="px-4 py-2 border rounded-lg text-sm bg-white min-w-[200px]"
      >
        <option value="">-- Select Vehicle --</option>
        {vehicles.map(v => (
          <option key={v.imei} value={v.imei}>{v.plate || v.vechicleNumb || v.imei}</option>
        ))}
      </select>
      <input 
        type="date" 
        value={date} onChange={(e) => setDate(e.target.value)}
        className="px-4 py-2 border rounded-lg text-sm bg-white"
        max={new Date().toISOString().split('T')[0]}
      />
      <button 
        onClick={handleGenerateReport} 
        disabled={loading || !selectedImei}
        className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-brand-purple/20 transition-all disabled:opacity-50"
      >
        {loading ? 'Scanning Logs...' : 'Generate Report'}
      </button>
    </div>
  );

  return (
    <PanelLayout 
      icon={<MdTimer size={28} className="text-brand-purple" />} 
      title="Idling Reports" 
      action={vehicleSelector} 
      maxWidth="6xl"
    >
      {hasScanned && (
        <>
          {/* Stats Dashboard */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <StatCard label="Total Idle Events" value={totalIncidents} icon={<MdLocalParking size={26} />} color="blue" />
            <StatCard label="Total Idling Time" value={totalIdlingTime} suffix="mins" icon={<MdTimer size={26} />} color="orange" />
            <StatCard label="Avg Idle Duration" value={totalIncidents > 0 ? (totalIdlingTime / totalIncidents).toFixed(1) : 0} suffix="mins" icon={<MdTimeline size={26} />} color="purple" />
          </div>

          <DataTable 
            columns={columns}
            data={idlingEvents}
            emptyMessage="No idling events longer than 2 minutes detected on this day."
            renderRow={(e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                <td className="px-6 py-5 text-sm font-medium text-gray-800">{e.startTime.toLocaleDateString()}</td>
                <td className="px-6 py-5 text-sm font-bold text-red-500">{e.startTime.toLocaleTimeString()}</td>
                <td className="px-6 py-5 text-sm font-bold text-green-500">{e.endTime.toLocaleTimeString()}</td>
                <td className="px-6 py-5 text-sm font-black text-gray-700">{e.duration} <span className="text-[10px] font-normal text-gray-400">mins</span></td>
                <td className="px-6 py-5">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${e.startLat},${e.startLng}`}
                    target="_blank" rel="noreferrer"
                    className="text-brand-purple hover:underline text-[11px] font-mono bg-purple-50 px-2 py-1 rounded"
                  >
                    {e.startLat.toFixed(5)}, {e.startLng.toFixed(5)}
                  </a>
                </td>
              </tr>
            )}
          />
        </>
      )}

      {!hasScanned && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
           <MdDirectionsCar size={48} className="text-gray-300 mb-4" />
           <p className="font-medium text-sm">Select a vehicle and date to scan historical path logs for idling events.</p>
        </div>
      )}
    </PanelLayout>
  );
}
