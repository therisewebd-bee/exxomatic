import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCompliancesQuery, useCreateComplianceMutation, useVehiclesQuery } from '../hooks/useQueries';
import { checkLiveFuelRate } from '../services/api';
import { MdAssessment, MdAdd, MdClose, MdLocalGasStation, MdMoney } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';
import Modal from './ui/Modal';
import DataTable from './ui/DataTable';

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

  // Derived state
  const totalCost = (parseFloat(fuelQuantity || 0) * parseFloat(fuelRate || 0)).toFixed(2);

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
      return alert('Please select a Vehicle first! The system needs the vehicle to know which city to scrape fuel prices for.');
    }

    setIsFetchingFuel(true);
    try {
      const res = await checkLiveFuelRate(city);
      if (res.data?.rate) {
         setFuelRate(res.data.rate);
         setDetectedAddress(res.data.city); // display what the backend actually scraped or fell back to
      } else {
         alert(`Live price completely unavailable. Check network.`);
         setFuelRate('94.72');
         setDetectedAddress('fallback');
      }
    } catch (e) {
      alert('Could not fetch live fuel rate. Trying again later.');
    } finally {
      setIsFetchingFuel(false);
    }
  }

  async function handleSave() {
    if (!vehicleId || !fuelQuantity || !fuelRate || !filledBy || !filledAt) {
      return alert('Please fill all required fields');
    }

    try {
      await createMutation.mutateAsync({
        vehicleId,
        fuelQuantity: parseFloat(fuelQuantity),
        fuelRate: parseFloat(fuelRate),
        totalCost: parseFloat(totalCost),
        filledBy,
        filledAt: new Date(filledAt).toISOString(),
      });
      setShowModal(false);
      // Reset
      setFuelQuantity('');
      setFuelRate('');
    } catch (e) {
      alert(e.message || 'Failed to file report');
    }
  }

  const columns = [
    { key: 'id', label: 'Alert ID' },
    { key: 'vehicle', label: 'Vehicle Name' },
    { key: 'volume', label: 'Volume (L)' },
    { key: 'rate', label: 'Rate (₹)' },
    { key: 'cost', label: 'Total Cost (₹)' },
    { key: 'filledBy', label: 'Filled By' },
    { key: 'date', label: 'Date' }
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
      <DataTable 
        columns={columns}
        data={reports}
        emptyMessage="No fuel entries found"
        renderRow={(r) => (
          <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
            <td className="px-6 py-4 font-mono text-xs text-brand-purple">{r.id.slice(0, 8).toUpperCase()}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-800">
              {r.vehicle?.vechicleNumb || r.vehicle?.imei || 'Unknown'}
            </td>
            <td className="px-6 py-4 font-bold text-gray-700">{Number(r.fuelQuantity).toFixed(2)} L</td>
            <td className="px-6 py-4 text-gray-600">₹{Number(r.fuelRate).toFixed(2)}</td>
            <td className="px-6 py-4 font-bold text-green-600">₹{Number(r.totalCost).toFixed(2)}</td>
            <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">{r.filledBy}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{new Date(r.filledAt).toLocaleString()}</td>
          </tr>
        )}
      />

      {showModal && (
        <Modal title="Add Fuel Log" onClose={() => setShowModal(false)}>
          <select
            value={vehicleId} onChange={(e) => handleVehicleChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm text-gray-700 bg-white"
          >
            <option value="">Select a Vehicle...</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.plate || v.imei}</option>
            ))}
          </select>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Quantity (Liters)</label>
              <input
                type="number" step="0.1" value={fuelQuantity} onChange={(e) => setFuelQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Rate per L</label>
              <div className="relative">
                <input
                  type="number" step="0.1" value={fuelRate} onChange={(e) => setFuelRate(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
                />
                <MdMoney className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button 
              onClick={fetchLiveFuelRate}
              disabled={isFetchingFuel}
              className="text-xs font-bold text-brand-purple hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              {isFetchingFuel ? 'Scraping...' : 'Fetch Live Rate'}
            </button>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-semibold">Total Cost:</span>
            <span className="text-lg font-bold text-green-600">₹{totalCost}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Filled By</label>
            <input
              type="text" value={filledBy} onChange={(e) => setFilledBy(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Date & Time</label>
            <input
              type="datetime-local" value={filledAt} onChange={(e) => setFilledAt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm text-gray-700 bg-white"
            />
          </div>

          <button
            onClick={handleSave} disabled={createMutation.isPending}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50 mt-4"
          >
            {createMutation.isPending ? 'Saving...' : 'Submit Report'}
          </button>
        </Modal>
      )}
    </PanelLayout>
  );
}
