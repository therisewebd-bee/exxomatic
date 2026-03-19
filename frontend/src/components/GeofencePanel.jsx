import { useState, useEffect } from 'react';
import { getGeofences, createGeofence, updateGeofence } from '../services/api';
import { getVehicles } from '../services/api';
import { MdFence, MdAdd, MdClose, MdSettings, MdDelete } from 'react-icons/md';

export default function GeofencePanel({ onDrawRequested, drawnZone, onDrawConsumed }) {
  const [geofences, setGeofences] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const gRes = await getGeofences();
      setGeofences(gRes.data || []);
      const vRes = await getVehicles();
      setVehicles(vRes.data || []);
    } catch (e) {
      console.error('Failed to load geofences', e);
    }
  }

  useEffect(() => {
    if (drawnZone) {
      setShowModal(true);
    }
  }, [drawnZone]);

  function openCreateModal() {
    setZoneName('');
    setSelectedVehicles([]);
    // Switch to MapView to activate drawing
    onDrawRequested?.();
  }

  async function handleSave() {
    if (!zoneName.trim()) return alert('Enter a zone name');
    if (!drawnZone) return alert('Draw a polygon on the map first');

    setLoading(true);
    try {
      await createGeofence({
        name: zoneName,
        zone: drawnZone,
        vehicleIds: selectedVehicles.length > 0 ? selectedVehicles : undefined,
      });
      setShowModal(false);
      onDrawConsumed?.();
      refresh();
    } catch (e) {
      alert(e.message || 'Failed to create geofence');
    } finally {
      setLoading(false);
    }
  }

  function toggleVehicle(id) {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdFence size={24} className="text-brand-purple" />
            Geofence Zones
          </h2>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-md shadow-brand-purple/20"
          >
            <MdAdd size={18} /> New Zone
          </button>
        </div>

        {/* Geofence Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Vehicles</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {geofences.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No geofences created yet</td></tr>
              )}
              {geofences.map((g) => (
                <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{g.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {g.vehicles?.length || 0} vehicles
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-brand-purple transition p-1">
                      <MdSettings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Create Geofence Zone</h3>
              <button onClick={() => { setShowModal(false); onDrawConsumed?.(); }} className="text-gray-400 hover:text-gray-600">
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text" placeholder="Zone Name" value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
                {drawnZone
                  ? '✅ Polygon drawn! You can save the zone now.'
                  : '⬟ Use the polygon tool on the map to draw your zone boundary.'}
              </div>

              {/* Vehicle assignment */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Assign Vehicles (optional)</p>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-1">
                  {vehicles.length === 0 && <span className="text-xs text-gray-400">No vehicles registered</span>}
                  {vehicles.map((v) => (
                    <label key={v.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(v.id)}
                        onChange={() => toggleVehicle(v.id)}
                        className="accent-purple-600"
                      />
                      {v.vechicleNumb || v.imei}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave} disabled={loading}
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
