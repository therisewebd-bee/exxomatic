import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCompliances, createCompliance } from '../services/api';
import { getVehicles } from '../services/api';
import { MdAssessment, MdAdd, MdClose, MdLocalGasStation, MdMoney } from 'react-icons/md';

export default function ReportsPanel() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [vehicleId, setVehicleId] = useState('');
  const [fuelQuantity, setFuelQuantity] = useState('');
  const [fuelRate, setFuelRate] = useState('');
  const [filledBy, setFilledBy] = useState(user?.name || '');
  const [filledAt, setFilledAt] = useState(new Date().toISOString().slice(0, 16));

  // Derived state
  const totalCost = (parseFloat(fuelQuantity || 0) * parseFloat(fuelRate || 0)).toFixed(2);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const rRes = await getCompliances();
      setReports(rRes.data || []);
      const vRes = await getVehicles();
      setVehicles(vRes.data || []);
    } catch (e) {
      console.error('Failed to load reports', e);
    }
  }

  function fetchLiveFuelRate() {
    // Simulating Gov API call for fuel rate (e.g. INR per liter)
    setFuelRate('104.50');
  }

  async function handleSave() {
    if (!vehicleId || !fuelQuantity || !fuelRate || !filledBy || !filledAt) {
      return alert('Please fill all required fields');
    }

    setLoading(true);
    try {
      await createCompliance({
        vehicleId,
        fuelQuantity: parseFloat(fuelQuantity),
        fuelRate: parseFloat(fuelRate),
        totalCost: parseFloat(totalCost),
        filledBy,
        filledAt: new Date(filledAt).toISOString(),
      });
      setShowModal(false);
      refresh();
      // Reset
      setFuelQuantity('');
      setFuelRate('');
    } catch (e) {
      alert(e.message || 'Failed to file report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdLocalGasStation size={28} className="text-brand-purple" />
            Fuel Compliance Reports
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-md shadow-brand-purple/20"
          >
            <MdAdd size={18} /> New Fuel Entry
          </button>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Alert ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Vehicle (IMEI)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Volume (L)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Rate (₹)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total Cost (₹)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Filled By</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No fuel entries found</td></tr>
              )}
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-brand-purple">{r.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{r.vehicle?.imei || 'Unknown'}</td>
                  <td className="px-6 py-4 font-bold text-gray-700">{Number(r.fuelQuantity).toFixed(2)} L</td>
                  <td className="px-6 py-4 text-gray-600">₹{Number(r.fuelRate).toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-green-600">₹{Number(r.totalCost).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">{r.filledBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(r.filledAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Add Fuel Log</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <select
                value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}
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

              <div className="flex justify-end">
                <button 
                  onClick={fetchLiveFuelRate}
                  className="text-xs font-bold text-brand-purple hover:underline"
                >
                  Fetch Live Govt Rate
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
                onClick={handleSave} disabled={loading}
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50 mt-4"
              >
                {loading ? 'Saving...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
