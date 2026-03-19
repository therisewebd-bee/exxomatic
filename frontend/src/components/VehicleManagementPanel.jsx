import { useState } from 'react';
import { createVehicle, deleteVehicle } from '../services/api';
import { MdDirectionsCar, MdAdd, MdClose, MdDelete } from 'react-icons/md';

export default function VehicleManagementPanel({ vehicles }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imei, setImei] = useState('');
  const [vechicleNumb, setVechicleNumb] = useState('');

  async function handleSave() {
    if (!imei || !vechicleNumb) return alert('Both fields are required');
    setLoading(true);
    try {
      await createVehicle({ imei, vechicleNumb });
      setShowModal(false);
      window.location.reload(); // Quick way to refresh
    } catch (e) {
      alert(e.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await deleteVehicle(id);
      window.location.reload();
    } catch (e) {
      alert('Failed to delete');
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdDirectionsCar size={24} className="text-brand-purple" />
            Active Fleet
          </h2>
          <button
            onClick={() => { setShowModal(true); setImei(''); setVechicleNumb(''); }}
            className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-md shadow-brand-purple/20"
          >
            <MdAdd size={18} /> Register Vehicle
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Marker</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Plate/Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">IMEI Tracker</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No vehicles registered</td></tr>
              )}
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className={`w-3 h-3 rounded-full ${v.status === 'moving' ? 'bg-green-500' : v.status === 'stopped' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{v.plate}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{v.imei}</td>
                  <td className="px-6 py-4">
                     <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">{v.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-600 transition p-1 bg-red-50 hover:bg-red-100 rounded">
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><MdAdd /> Register New Tracker</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text" placeholder="15-digit Tracker IMEI" value={imei}
                onChange={(e) => setImei(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm font-mono"
              />
              <input
                type="text" placeholder="Vehicle Name / License Plate" value={vechicleNumb}
                onChange={(e) => setVechicleNumb(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
              />
              <button
                onClick={handleSave} disabled={loading}
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
