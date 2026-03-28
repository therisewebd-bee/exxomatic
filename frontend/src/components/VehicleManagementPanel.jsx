import { useState, useEffect, useRef } from 'react';
import { useCreateVehicleMutation, useUpdateVehicleMutation, useDeleteVehicleMutation, useUsersQuery } from '../hooks/useQueries';
import { useUpdateVehicleLocationMutation } from '../hooks/useVehicleQueries';
import { useAuth } from '../context/AuthContext';
import { MdDirectionsCar, MdAdd, MdClose, MdDelete, MdEdit, MdMyLocation, MdSave, MdSpeed, MdPowerSettingsNew, MdPerson, MdGpsFixed } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';
import Modal from './ui/Modal';
import DataTable from './ui/DataTable';
import { StatusPill } from './ui/StatusBadge';

/* ─── Inline Vehicle Detail Card ─────────────────────────── */
function VehicleDetailCard({ vehicle, isAdmin, customers, onClose, onSave, onLocationUpdate, isSaving, isLocationSaving }) {
  const [imei, setImei] = useState(vehicle.imei || '');
  const [vechicleNumb, setVechicleNumb] = useState(vehicle.vechicleNumb || '');
  const [customerId, setCustomerId] = useState(vehicle.customerId || '');
  const [lat, setLat] = useState(vehicle.lat ?? '');
  const [lng, setLng] = useState(vehicle.lng ?? '');
  const [speed, setSpeed] = useState(vehicle.speed ?? 0);
  const [ignition, setIgnition] = useState(vehicle.ignition ?? false);
  const [activeTab, setActiveTab] = useState('info');

  // Sync when vehicle prop changes
  useEffect(() => {
    setImei(vehicle.imei || '');
    setVechicleNumb(vehicle.vechicleNumb || '');
    setCustomerId(vehicle.customerId || '');
    setLat(vehicle.lat ?? '');
    setLng(vehicle.lng ?? '');
    setSpeed(vehicle.speed ?? 0);
    setIgnition(vehicle.ignition ?? false);
  }, [vehicle.id]);

  function handleInfoSave(e) {
    e.preventDefault();
    const payload = { imei, vechicleNumb };
    if (isAdmin && customerId) payload.customerId = customerId;
    onSave(vehicle.id, payload);
  }

  function handleLocationSave(e) {
    e.preventDefault();
    if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
      return alert('Please enter valid latitude and longitude');
    }
    onLocationUpdate(vehicle.id, {
      lat: Number(lat),
      lng: Number(lng),
      speed: Number(speed) || 0,
      ignition
    });
  }

  const tabs = [
    { id: 'info', label: 'Vehicle Info', icon: <MdDirectionsCar size={16} /> },
    { id: 'location', label: 'GPS & Location', icon: <MdGpsFixed size={16} /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-purple/10 via-purple-50 to-blue-50 px-6 py-4 flex items-center justify-between border-b border-purple-100/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
            vehicle.status === 'moving' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
            vehicle.status === 'idle' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
            'bg-gradient-to-br from-gray-400 to-slate-500'
          }`}>
            <MdDirectionsCar size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">{vehicle.vechicleNumb || vehicle.imei}</h3>
            <p className="text-xs text-gray-500 font-mono">{vehicle.imei}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/80 hover:bg-red-50 flex items-center justify-center transition shadow-sm border border-gray-200 hover:border-red-200 group">
          <MdClose size={16} className="text-gray-400 group-hover:text-red-500 transition" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'info' && (
          <form onSubmit={handleInfoSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Tracker IMEI</label>
                <input
                  type="text" value={imei} onChange={e => setImei(e.target.value)}
                  placeholder="15-digit IMEI"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition text-sm font-mono bg-gray-50/50"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Vehicle Name / Plate</label>
                <input
                  type="text" value={vechicleNumb} onChange={e => setVechicleNumb(e.target.value)}
                  placeholder="MH-12-AB-1234"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition text-sm bg-gray-50/50"
                />
              </div>
            </div>

            {isAdmin && (
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 block">
                  <MdPerson size={14} /> Assign to Customer
                </label>
                <select
                  value={customerId} onChange={e => setCustomerId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition text-sm bg-gray-50/50"
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
              className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20"
            >
              <MdSave size={16} />
              {isSaving ? 'Saving...' : 'Save Vehicle Info'}
            </button>
          </form>
        )}

        {activeTab === 'location' && (
          <form onSubmit={handleLocationSave} className="space-y-4">
            {/* Coordinate Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Latitude</label>
                <input
                  type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
                  placeholder="18.5204"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition text-sm font-mono bg-gray-50/50"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Longitude</label>
                <input
                  type="number" step="any" value={lng} onChange={e => setLng(e.target.value)}
                  placeholder="73.8567"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition text-sm font-mono bg-gray-50/50"
                />
              </div>
            </div>

            {/* Speed & Ignition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 block">
                  <MdSpeed size={14} /> Speed (km/h)
                </label>
                <input
                  type="number" min="0" step="0.1" value={speed} onChange={e => setSpeed(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition text-sm font-mono bg-gray-50/50"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 block">
                  <MdPowerSettingsNew size={14} /> Ignition
                </label>
                <button
                  type="button"
                  onClick={() => setIgnition(!ignition)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    ignition
                      ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${ignition ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  {ignition ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Current Position Preview */}
            {vehicle.lat && vehicle.lng && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100/50">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Current Position</p>
                <p className="text-xs font-mono text-blue-700">
                  {Number(vehicle.lat).toFixed(6)}, {Number(vehicle.lng).toFixed(6)}
                  {vehicle.speed > 0 && <span className="text-blue-500 ml-2">• {Number(vehicle.speed).toFixed(0)} km/h</span>}
                </p>
              </div>
            )}

            <button
              type="submit" disabled={isLocationSaving}
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              <MdMyLocation size={16} />
              {isLocationSaving ? 'Updating...' : 'Update GPS Location'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Main Panel ─────────────────────────────────────────── */
export default function VehicleManagementPanel({ vehicles, registerImei, editVehicleId, onClearRegisterImei }) {
  const { isAdmin } = useAuth();
  const createMutation = useCreateVehicleMutation();
  const updateMutation = useUpdateVehicleMutation();
  const deleteMutation = useDeleteVehicleMutation();
  const updateLocationMutation = useUpdateVehicleLocationMutation();
  const { data: users = [] } = useUsersQuery(isAdmin);

  const [showModal, setShowModal] = useState(false);
  const [imei, setImei] = useState('');
  const [vechicleNumb, setVechicleNumb] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const initializationRef = useRef(null);

  useEffect(() => {
    const currentTrigger = editVehicleId || registerImei;
    if (showModal && initializationRef.current === currentTrigger) return;

    if (editVehicleId) {
      // Open inline card instead of modal for edits
      setExpandedVehicleId(editVehicleId);
      if (onClearRegisterImei) onClearRegisterImei();
      initializationRef.current = editVehicleId;
    } else if (registerImei) {
      setEditingId(null);
      setImei(registerImei);
      setVechicleNumb('');
      setCustomerId('');
      initializationRef.current = registerImei;
      setShowModal(true);
    }
  }, [registerImei, editVehicleId, vehicles, showModal]);

  const customers = users.filter(u => u.role === 'Customer');

  function handleCloseModal() {
    setShowModal(false);
    initializationRef.current = null;
    if (onClearRegisterImei) onClearRegisterImei();
  }

  async function handleCreateSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!imei || !vechicleNumb) return alert('Both fields are required');
    try {
      const payload = { imei, vechicleNumb };
      if (isAdmin && customerId) payload.customerId = customerId;
      await createMutation.mutateAsync(payload);
      handleCloseModal();
    } catch (e) {
      alert(e.message || 'Failed to save');
    }
  }

  async function handleInlineInfoSave(vehicleId, payload) {
    try {
      await updateMutation.mutateAsync({ id: vehicleId, data: payload });
    } catch (e) {
      alert(e.message || 'Failed to update vehicle');
    }
  }

  async function handleLocationUpdate(vehicleId, locationData) {
    try {
      await updateLocationMutation.mutateAsync({ id: vehicleId, data: locationData });
    } catch (e) {
      alert(e.message || 'Location update failed');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      if (expandedVehicleId === id) setExpandedVehicleId(null);
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
      onClick={() => { setEditingId(null); setImei(''); setVechicleNumb(''); setCustomerId(''); setShowModal(true); }}
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
          <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition group">
            <td className="px-6 py-4">
              <div className={`w-3 h-3 rounded-full ${v.status === 'moving' ? 'bg-green-500' : v.status === 'stopped' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
            </td>
            <td className="px-6 py-4 font-bold text-gray-800">{v.vechicleNumb}</td>
            <td className="px-6 py-4 font-mono text-sm text-gray-500">{v.imei}</td>
            <td className="px-6 py-4">
               <StatusPill status={v.status} />
            </td>
            <td className="px-6 py-4 flex items-center gap-1.5">
              <button 
                onClick={() => setExpandedVehicleId(expandedVehicleId === v.id ? null : v.id)} 
                className={`transition p-1.5 rounded-lg ${expandedVehicleId === v.id ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30' : 'text-brand-purple bg-purple-50 hover:bg-purple-100'}`} 
                title="Edit Vehicle"
              >
                <MdEdit size={16} />
              </button>
              <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-600 transition p-1.5 bg-red-50 hover:bg-red-100 rounded-lg" title="Delete Vehicle">
                <MdDelete size={16} />
              </button>
            </td>
          </tr>
        )}
        renderExpansion={(v) => expandedVehicleId === v.id ? (
          <tr key={`${v.id}-expand`}>
            <td colSpan={5} className="px-4 py-3 bg-gray-50/30">
              <VehicleDetailCard
                vehicle={v}
                isAdmin={isAdmin}
                customers={customers}
                onClose={() => setExpandedVehicleId(null)}
                onSave={handleInlineInfoSave}
                onLocationUpdate={handleLocationUpdate}
                isSaving={updateMutation.isPending}
                isLocationSaving={updateLocationMutation.isPending}
              />
            </td>
          </tr>
        ) : null}
      />

      {/* Create-only Modal (for new registrations) */}
      {showModal && (
        <Modal 
          title="Register New Tracker"
          titleIcon={<MdAdd />}
          onClose={handleCloseModal}
        >
        <form onSubmit={handleCreateSave} className="space-y-4">
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
            type="submit" disabled={createMutation.isPending}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createMutation.isPending ? 'Saving...' : 'Register Vehicle'}
          </button>
        </form>
        </Modal>
      )}
    </PanelLayout>
  );
}
