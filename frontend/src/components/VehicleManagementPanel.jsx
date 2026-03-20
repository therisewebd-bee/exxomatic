import { useState } from 'react';
import { useCreateVehicleMutation, useUpdateVehicleMutation, useDeleteVehicleMutation } from '../hooks/useQueries';
import { MdDirectionsCar, MdAdd, MdClose, MdDelete, MdEdit } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';
import Modal from './ui/Modal';
import DataTable from './ui/DataTable';
import { StatusPill } from './ui/StatusBadge';

export default function VehicleManagementPanel({ vehicles }) {
  const createMutation = useCreateVehicleMutation();
  const updateMutation = useUpdateVehicleMutation();
  const deleteMutation = useDeleteVehicleMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const [showModal, setShowModal] = useState(false);
  const [imei, setImei] = useState('');
  const [vechicleNumb, setVechicleNumb] = useState('');
  const [editingId, setEditingId] = useState(null);

  async function handleSave() {
    if (!imei || !vechicleNumb) return alert('Both fields are required');
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: { imei, vechicleNumb } });
      } else {
        await createMutation.mutateAsync({ imei, vechicleNumb });
      }
      setShowModal(false);
    } catch (e) {
      alert(e.message || 'Failed to save');
    }
  }

  function openEdit(v) {
    setEditingId(v.id);
    setImei(v.imei);
    setVechicleNumb(v.vechicleNumb);
    setShowModal(true);
  }

  function openCreate() {
    setEditingId(null);
    setImei('');
    setVechicleNumb('');
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
              <button onClick={() => openEdit(v)} className="text-brand-purple hover:text-brand-purple-dark transition p-1 bg-purple-50 hover:bg-purple-100 rounded">
                <MdEdit size={18} />
              </button>
              <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-600 transition p-1 bg-red-50 hover:bg-red-100 rounded">
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
          onClose={() => setShowModal(false)}
        >
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
          <button
            onClick={handleSave} disabled={isSaving}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? 'Saving...' : editingId ? 'Update Vehicle' : 'Register Vehicle'}
          </button>
        </Modal>
      )}
    </PanelLayout>
  );
}
