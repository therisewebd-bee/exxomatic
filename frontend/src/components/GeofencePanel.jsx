import { useState, useEffect } from 'react';
import { MdFence, MdAdd, MdClose, MdDelete } from 'react-icons/md';
import { 
  useGeofencesQuery, 
  useVehiclesQuery, 
  useCreateGeofenceMutation, 
  useDeleteGeofenceMutation 
} from '../hooks/useQueries';
import PanelLayout from './ui/PanelLayout';
import Modal from './ui/Modal';
import DataTable from './ui/DataTable';

export default function GeofencePanel({ onDrawRequested, drawnZone, onDrawConsumed }) {
  const { data: geofences = [] } = useGeofencesQuery();
  const { data: vehicles = [] } = useVehiclesQuery();
  const createMutation = useCreateGeofenceMutation();
  const deleteMutation = useDeleteGeofenceMutation();

  const [showModal, setShowModal] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  useEffect(() => {
    if (drawnZone) {
      setShowModal(true);
    }
  }, [drawnZone]);

  function openCreateModal() {
    setZoneName('');
    setSelectedVehicles([]);
    onDrawRequested?.();
  }

  async function handleSave() {
    if (!zoneName.trim()) return alert('Enter a zone name');
    if (!drawnZone) return alert('Draw a polygon on the map first');

    try {
      await createMutation.mutateAsync({
        name: zoneName,
        zone: drawnZone,
        vehicleIds: selectedVehicles.length > 0 ? selectedVehicles : undefined,
      });
      setShowModal(false);
      onDrawConsumed?.();
    } catch (e) {
      alert(e.message || 'Failed to create geofence');
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete geofence "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (e) {
      alert(e.message || 'Failed to delete geofence. Note: geofences linked to multiple vehicles cannot be deleted.');
    }
  }

  function toggleVehicle(id) {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'vehicles', label: 'Vehicles' },
    { key: 'actions', label: 'Actions' }
  ];

  const actionButton = (
    <button
      onClick={openCreateModal}
      className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-md shadow-brand-purple/20"
    >
      <MdAdd size={18} /> New Zone
    </button>
  );

  return (
    <PanelLayout 
      icon={<MdFence size={28} className="text-brand-purple" />} 
      title="Geofence Zones" 
      action={actionButton} 
      maxWidth="5xl"
    >
      <DataTable 
        columns={columns}
        data={geofences}
        emptyMessage="No geofences created yet"
        renderRow={(g) => (
          <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
            <td className="px-6 py-4 font-medium text-gray-800">{g.name}</td>
            <td className="px-6 py-4">
              <span className="inline-block bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                {g.vehicles?.length || 0} vehicles
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleDelete(g.id, g.name)}
                disabled={deleteMutation.isPending}
                className="text-gray-400 hover:text-red-500 transition p-1 disabled:opacity-50"
                title="Delete geofence"
              >
                {deleteMutation.isPending && deleteMutation.variables === g.id ? (
                  <div className="w-[18px] h-[18px] border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <MdDelete size={18} />
                )}
              </button>
            </td>
          </tr>
        )}
      />

      {/* Create Modal */}
      {showModal && (
        <Modal title="Create Geofence Zone" onClose={() => { setShowModal(false); onDrawConsumed?.(); }}>
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
            onClick={handleSave} disabled={createMutation.isPending}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Zone'}
          </button>
        </Modal>
      )}
    </PanelLayout>
  );
}
