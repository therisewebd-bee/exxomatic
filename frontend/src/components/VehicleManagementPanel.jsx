import { useState, useEffect, useRef } from 'react';
import { useCreateVehicleMutation, useUpdateVehicleMutation, useDeleteVehicleMutation, useUsersQuery } from '../hooks/useQueries';
import { useUpdateVehicleLocationMutation } from '../hooks/useVehicleQueries';
import { useAuth } from '../context/AuthContext';
import { MdDirectionsCar, MdAdd, MdClose, MdDelete, MdEdit, MdMyLocation } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';
import Modal from './ui/Modal';
import DataTable from './ui/DataTable';
import { StatusPill } from './ui/StatusBadge';

export default function VehicleManagementPanel({ vehicles, registerImei, editVehicleId, onClearRegisterImei }) {
  const { isAdmin } = useAuth();
  const createMutation = useCreateVehicleMutation();
  const updateMutation = useUpdateVehicleMutation();
  const deleteMutation = useDeleteVehicleMutation();
  const updateLocationMutation = useUpdateVehicleLocationMutation();
  const { data: users = [] } = useUsersQuery(isAdmin);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const [showModal, setShowModal] = useState(false);
  const [imei, setImei] = useState('');
  const [vechicleNumb, setVechicleNumb] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const initializationRef = useRef(null); // Tracks the last entity (ID or IMEI) initialized in the form

  useEffect(() => {
    // Determine the current "target" entity for the form
    const currentTrigger = editVehicleId || registerImei;
    
    // If the modal is open and we've already initialized for this specific entity,
    // do NOT overwrite the local state (user's typing).
    if (showModal && initializationRef.current === currentTrigger) return;

    if (editVehicleId) {
      const v = vehicles.find(v => v.id === editVehicleId);
      if (v) {
        setEditingId(v.id);
        setImei(v.imei);
        setVechicleNumb(v.vechicleNumb);
        setCustomerId(v.customerId || '');
        initializationRef.current = editVehicleId;
        setShowModal(true);
      }
    } else if (registerImei) {
      setEditingId(null);
      setImei(registerImei);
      setVechicleNumb('');
      setCustomerId('');
      initializationRef.current = registerImei;
      setShowModal(true);
    }
  }, [registerImei, editVehicleId, vehicles, showModal]); 

  // Filter to only show Customer-role users in the dropdown
  const customers = users.filter(u => u.role === 'Customer');

  function handleCloseModal() {
    setShowModal(false);
    initializationRef.current = null; // Clear initialization tracker on close
    if (onClearRegisterImei) onClearRegisterImei();
  }

  async function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!imei || !vechicleNumb) return alert('Both fields are required');
    // Removed mandatory customerId check for admins as per request
    try {
      const payload = { imei, vechicleNumb };
      if (isAdmin && customerId) payload.customerId = customerId;

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      handleCloseModal();
    } catch (e) {
      alert(e.message || 'Failed to save');
    }
  }

  function openEdit(v) {
    setEditingId(v.id);
    setImei(v.imei);
    setVechicleNumb(v.vechicleNumb);
    setCustomerId(v.customerId || '');
    setShowModal(true);
  }

  function openCreate() {
    setEditingId(null);
    setImei('');
    setVechicleNumb('');
    setCustomerId('');
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (e) {
      alert('Failed to delete');
    }
  }

  const columns = [
    { key: 'marker', label: 'Marker' },
    { key: 'plate', label: 'Plate/Name' },
    { key: 'imei', label: 'IMEI Tracker' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  const actionButton = (
    <button
      onClick={openCreate}
      className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-md shadow-brand-purple/20"
    >
      <MdAdd size={18} /> Register Vehicle
    </button>
  );

  return (
    <PanelLayout 
      icon={<MdDirectionsCar size={28} className="text-brand-purple" />} 
      title="Active Fleet" 
      action={actionButton} 
      maxWidth="5xl"
    >
      <DataTable 
        columns={columns}
        data={vehicles}
        emptyMessage="No vehicles registered"
        renderRow={(v) => (
          <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
            <td className="px-6 py-4">
              <div className={`w-3 h-3 rounded-full ${v.status === 'moving' ? 'bg-green-500' : v.status === 'stopped' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
            </td>
            <td className="px-6 py-4 font-bold text-gray-800">{v.vechicleNumb}</td>
            <td className="px-6 py-4 font-mono text-sm text-gray-500">{v.imei}</td>
            <td className="px-6 py-4">
               <StatusPill status={v.status} />
            </td>
            <td className="px-6 py-4 flex items-center gap-2">
              <button onClick={() => openEdit(v)} className="text-brand-purple hover:text-brand-purple-dark transition p-1 bg-purple-50 hover:bg-purple-100 rounded" title="Edit Vehicle">
                <MdEdit size={18} />
              </button>
              <button 
                onClick={() => {
                  const coords = prompt(`Enter new coordinates for ${v.vechicleNumb || v.imei}\nFormat: "lat, lng" (e.g. 18.5204, 73.8567):`);
                  if (coords) {
                    const parts = coords.split(',');
                    if (parts.length === 2) {
                      const lat = parseFloat(parts[0].trim());
                      const lng = parseFloat(parts[1].trim());
                      if (!isNaN(lat) && !isNaN(lng)) {
                        updateLocationMutation.mutate({ id: v.id, data: { lat, lng } }, {
                          onSuccess: () => alert('Location updated successfully!'),
                          onError: (err) => alert(err.message || 'Location update failed')
                        });
                      } else {
                        alert('Invalid coordinates. Please enter valid numbers.');
                      }
                    } else {
                      alert('Invalid format. Please enter exactly as: "lat, lng"');
                    }
                  }
                }}
                className="text-blue-500 hover:text-blue-700 transition p-1 bg-blue-50 hover:bg-blue-100 rounded"
                title="Update GPS Location"
              >
                <MdMyLocation size={18} />
              </button>
              <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-600 transition p-1 bg-red-50 hover:bg-red-100 rounded" title="Delete Vehicle">
                <MdDelete size={18} />
              </button>
            </td>
          </tr>
        )}
      />

      {showModal && (
        <Modal 
          title={editingId ? 'Edit Vehicle Info' : 'Register New Tracker'}
          titleIcon={editingId ? <MdEdit /> : <MdAdd />}
          onClose={handleCloseModal}
        >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Tracker IMEI</label>
            <input
              type="text" placeholder="15-digit Tracker IMEI" value={imei}
              onChange={(e) => setImei(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Vehicle Name / Plate</label>
            <input
              type="text" placeholder="e.g. MH-12-AB-1234" value={vechicleNumb}
              onChange={(e) => setVechicleNumb(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
            />
          </div>

          {/* Admin-only: Assign vehicle to a customer */}
          {isAdmin && (
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Assign to Customer (Optional)</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm bg-white"
              >
                <option value="">— Unassigned / Register to Self —</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit" disabled={isSaving}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? 'Saving...' : editingId ? 'Update Vehicle' : 'Register Vehicle'}
          </button>
        </form>
        </Modal>
      )}
    </PanelLayout>
  );
}
