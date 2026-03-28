import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCompliancesQuery, useCreateComplianceMutation, useVehiclesQuery } from '../hooks/useQueries';
import { checkLiveFuelRate } from '../services/api';
import { MdAssessment, MdAdd, MdClose, MdLocalGasStation, MdMoney, MdTimeline, MdTrendingUp, MdBarChart } from 'react-icons/md';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PanelLayout from './ui/PanelLayout';
import Modal from './ui/Modal';
import DataTable from './ui/DataTable';
import StatCard from './ui/StatCard';
import { uploadFuelReceipt } from '../services/cloudinary';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

// Initialize Cloudinary instance using Vite env variable
const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dljqtrocn' } });

export default function ReportsPanel({ vehicles = [] }) {
  const { user } = useAuth();
  const { data: reports = [] } = useCompliancesQuery();
  const createMutation = useCreateComplianceMutation();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [vehicleId, setVehicleId] = useState('');
  const [fuelQuantity, setFuelQuantity] = useState('');
  const [fuelRate, setFuelRate] = useState('');
  const [city, setCity] = useState('delhi');
  const [filledBy, setFilledBy] = useState(user?.name || '');
  const [filledAt, setFilledAt] = useState(new Date().toISOString().slice(0, 16));
  const [receiptFile, setReceiptFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const totalCost = (parseFloat(fuelQuantity || 0) * parseFloat(fuelRate || 0)).toFixed(2);

  // Summary Aggregates & Chart Data
  const { stats, trendData } = useMemo(() => {
    const sorted = [...reports].sort((a, b) => new Date(a.filledAt) - new Date(b.filledAt));
    
    // Stats
    const totalFilled = reports.reduce((sum, r) => sum + Number(r.fuelQuantity || 0), 0);
    const totalSpent = reports.reduce((sum, r) => sum + Number(r.totalCost || 0), 0);
    const avgRate = reports.length > 0 ? (totalSpent / totalFilled).toFixed(2) : '0.00';

    // Trend Data (Last 10 entries)
    const trend = sorted.slice(-10).map(r => ({
      date: new Date(r.filledAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      rate: Number(r.fuelRate)
    }));

    return { 
      stats: {
        totalFilled: totalFilled.toFixed(1), 
        totalSpent: totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        avgRate 
      },
      trendData: trend
    };
  }, [reports]);

  const handleVehicleChange = async (vid) => {
    setVehicleId(vid);
    if (!vid) {
      setCity('unknown');
      return;
    }
    
    // Automatically extract exact physical city via Reverse Geocoding
    const v = vehicles.find(vec => vec.id === vid);
    if (v && v.lat && v.lng) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${v.lat}&lon=${v.lng}`);
        const data = await res.json();
        const detectedCity = data.address?.city || data.address?.town || data.address?.state_district;
        if (detectedCity) {
          setCity(detectedCity.toLowerCase().replace(/\s+/g, '-'));
        } else {
          setCity('unknown-gps-area');
        }
      } catch (err) {
        console.warn('Silent Geocode Fail', err);
        setCity('geocode-failed');
      }
    } else {
      setCity('no-gps-data');
    }
  };

  const [isFetchingFuel, setIsFetchingFuel] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');

  async function fetchLiveFuelRate() {
    if (!vehicleId) {
      return alert('Please select a Vehicle first! The system needs the vehicle GPS location to detect the city.');
    }

    setIsFetchingFuel(true);
    try {
      const res = await checkLiveFuelRate(city);
      if (res.data?.rate) {
         setFuelRate(res.data.rate);
         const source = res.data.source === 'live' ? 'Live' : 'Cached';
         setDetectedAddress(`${source} — ${res.data.city}`);
      } else {
         setFuelRate('94.72');
         setDetectedAddress('Fallback rate');
      }
    } catch (e) {
      // Use a safe fallback
      setFuelRate('94.72');
      setDetectedAddress('Using fallback rate (network issue)');
    } finally {
      setIsFetchingFuel(false);
    }
  }

  async function handleSave() {
    if (!vehicleId || !fuelQuantity || !fuelRate || !filledBy || !filledAt) {
      return alert('Please fill all required fields');
    }

    setIsUploading(true);
    try {
      let receiptUrl = null;
      if (receiptFile) {
        receiptUrl = await uploadFuelReceipt(receiptFile);
      }

      await createMutation.mutateAsync({
        vehicleId,
        fuelQuantity: parseFloat(fuelQuantity),
        fuelRate: parseFloat(fuelRate),
        totalCost: parseFloat(totalCost),
        filledBy,
        filledAt: new Date(filledAt).toISOString(),
        filledAddress: city,
        ...(receiptUrl && { receiptUrl })
      });
      setShowModal(false);
      // Reset
      setFuelQuantity('');
      setFuelRate('');
      setReceiptFile(null);
    } catch (e) {
      alert(e.message || 'Failed to file report');
    } finally {
      setIsUploading(false);
    }
  }

  const columns = [
    { key: 'id', label: 'Alert ID' },
    { key: 'vehicle', label: 'Vehicle Name' },
    { key: 'volume', label: 'Volume (L)' },
    { key: 'rate', label: 'Rate (₹)' },
    { key: 'cost', label: 'Total Cost (₹)' },
    { key: 'filledBy', label: 'Filled By' },
    { key: 'date', label: 'Date' },
    { key: 'receipt', label: 'Receipt' }
  ];

  const actionButton = (
    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-md shadow-brand-purple/20"
    >
      <MdAdd size={18} /> New Fuel Entry
    </button>
  );

  return (
    <PanelLayout 
      icon={<MdLocalGasStation size={28} className="text-brand-purple" />} 
      title="Fuel Compliance Reports" 
      action={actionButton} 
      maxWidth="6xl"
    >
      {/* Stats Dashboard */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Spent" value={`₹${stats.totalSpent}`} icon={<MdMoney size={26} />} color="purple" />
          <StatCard label="Volume" value={stats.totalFilled} suffix="L" icon={<MdLocalGasStation size={26} />} color="green" />
          <StatCard label="Avg Price/L" value={`₹${stats.avgRate}`} icon={<MdTrendingUp size={26} />} color="blue" />
          <StatCard label="Total Entries" value={reports.length} icon={<MdBarChart size={26} />} color="orange" />
        </div>

        {/* Price Trend Chart */}
        <div className="lg:w-[320px] bg-gradient-to-br from-white to-purple-50/30 p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <MdTimeline size={14} className="text-brand-purple" /> Fuel Price Trend
            </h4>
            <span className="text-[9px] font-bold text-gray-300 uppercase">Last {trendData.length} entries</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} width={35} />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" dot={{ r: 2, fill: '#8b5cf6' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', fontSize: '11px', fontWeight: 'bold', padding: '8px 12px' }}
                  labelStyle={{ fontSize: '9px', color: '#9ca3af', marginBottom: '2px' }}
                  formatter={(value) => [`₹${value}`, 'Rate']}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={reports}
        emptyMessage="No fuel entries found"
        renderRow={(r) => (
          <tr key={r.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors group">
            <td className="px-6 py-5">
              <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-[10px] font-bold tracking-tighter">
                {r.id.slice(0, 8).toUpperCase()}
              </span>
            </td>
            <td className="px-6 py-5">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">{r.vehicle?.vechicleNumb || r.vehicle?.imei || 'Unknown'}</span>
                <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{r.vehicle?.imei}</span>
              </div>
            </td>
            <td className="px-6 py-5">
              <span className="text-sm font-black text-gray-700">{Number(r.fuelQuantity).toFixed(1)} <span className="text-[10px] font-normal text-gray-400">Liters</span></span>
            </td>
            <td className="px-6 py-5">
              <span className="text-sm text-gray-500 font-medium">₹{Number(r.fuelRate).toFixed(2)}</span>
            </td>
            <td className="px-6 py-5">
              <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">₹{Number(r.totalCost).toLocaleString('en-IN')}</span>
            </td>
            <td className="px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                  {r.filledBy?.[0] || 'U'}
                </div>
                <span className="text-xs text-gray-600 font-medium">{r.filledBy}</span>
              </div>
            </td>
            <td className="px-6 py-5">
              <span className="text-[11px] text-gray-400 font-medium">{new Date(r.filledAt).toLocaleDateString()}</span>
            </td>
            <td className="px-6 py-5">
              {r.receiptUrl ? (
                <div 
                  onClick={() => setLightboxImage(r.receiptUrl)}
                  className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-brand-purple hover:ring-offset-1 transition-all"
                >
                  <AdvancedImage 
                    cldImg={cld.image(r.receiptUrl).format('auto').quality('auto').resize(auto().gravity(autoGravity()).width(80).height(80))} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <span className="text-[10px] text-gray-300 italic">No receipt</span>
              )}
            </td>
          </tr>
        )}
      />

      {showModal && (
        <Modal title="Fuel Log Entry" onClose={() => setShowModal(false)}>
          <div className="space-y-6 py-2">
            <div>
              <label className="block text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 ml-1">Vehicle Assignment</label>
              <div className="relative group">
                <select
                  value={vehicleId} onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm text-gray-700 bg-gray-50/50 appearance-none font-medium"
                >
                  <option value="">Select a Vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.plate || v.imei}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-4 pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                  <MdAssessment size={18} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Quantity (Liters)</label>
                <div className="relative">
                  <input
                    type="number" step="0.1" value={fuelQuantity} onChange={(e) => setFuelQuantity(e.target.value)}
                    placeholder="0.0"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm font-bold"
                  />
                  <MdLocalGasStation className="absolute left-3.5 top-4 text-gray-400" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate (₹/L)</label>
                  <button 
                    onClick={fetchLiveFuelRate}
                    disabled={isFetchingFuel || !vehicleId}
                    className="text-[9px] font-black text-brand-purple hover:underline disabled:opacity-30 flex items-center gap-1 uppercase tracking-tighter"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {isFetchingFuel ? 'Fetching...' : 'Fetch Live'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number" step="0.1" value={fuelRate} onChange={(e) => setFuelRate(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm font-bold"
                  />
                  <MdMoney className="absolute left-3.5 top-4 text-gray-400" />
                </div>
              </div>
            </div>

            {detectedAddress && (
              <div className="flex items-center gap-2 text-[10px] bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                {detectedAddress.includes('Live') && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                {detectedAddress.includes('Cached') && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                {detectedAddress.includes('Fallback') && <span className="w-2 h-2 rounded-full bg-red-400"></span>}
                <span className="text-gray-400">Rate source:</span>
                <span className="text-purple-600 font-bold uppercase">{detectedAddress}</span>
              </div>
            )}

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 flex justify-between items-center shadow-inner">
              <span className="text-xs text-green-700 font-bold uppercase tracking-wider">Total Est. Cost</span>
              <span className="text-2xl font-black text-green-600">₹{Number(totalCost).toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Staff Name</label>
                <input
                  type="text" value={filledBy} onChange={(e) => setFilledBy(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500 transition-all text-sm font-medium bg-gray-50/30"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Date Time</label>
                <input
                  type="datetime-local" value={filledAt} onChange={(e) => setFilledAt(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500 transition-all text-sm font-medium bg-gray-50/30 text-gray-600"
                />
              </div>
            </div>

            {/* Cloudinary Receipt Upload Field */}
            <div className="mt-2 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl relative hover:bg-purple-50 hover:border-brand-purple/50 transition-colors">
              <label className="block w-full cursor-pointer text-center">
                <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest block mb-2">Upload Fuel Receipt</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-purple file:text-white hover:file:bg-brand-purple-dark"
                />
              </label>
            </div>

            <button
              onClick={handleSave} disabled={createMutation.isPending || isUploading}
              className="w-full py-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-brand-purple/30 active:scale-[0.98] disabled:opacity-50 mt-2 flex justify-center items-center gap-2"
            >
              {(createMutation.isPending || isUploading) && <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>}
              {(createMutation.isPending || isUploading) ? 'Uploading & Syncing...' : 'Authorize & Submit'}
            </button>
          </div>
        </Modal>
      )}

      {/* Fullscreen Receipt Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm overflow-y-auto cursor-pointer animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setLightboxImage(null)}
        >
          <div className="min-h-full flex items-center justify-center p-6">
            <div className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20" onClick={(e) => e.stopPropagation()}>
              <AdvancedImage 
                cldImg={cld.image(lightboxImage).format('auto').quality('auto')} 
                className="w-full h-auto object-contain bg-white" 
              />
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors sticky"
              >
                <MdClose size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
