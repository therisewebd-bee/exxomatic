import { useState } from 'react';
import { useUsersQuery, useCreateUserMutation, useDeleteUserMutation } from '../hooks/useQueries';
import { MdPeople, MdAdd, MdDelete, MdPerson } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';
import Modal from './ui/Modal';
import DataTable from './ui/DataTable';

export default function UserManagementPanel() {
  const { data: users = [], isLoading } = useUsersQuery();
  const createMutation = useCreateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');

  async function handleSave() {
    if (!name || !email || !password) return alert('Please fill in all required fields');
    try {
      await createMutation.mutateAsync({ name, email, password, role });
      setShowModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('Customer');
    } catch (e) {
      alert(e.message || 'Failed to create user');
    }
  }

  async function handleDelete(id, userName) {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (e) {
      alert(e.message || 'Failed to delete user.');
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: 'Actions' }
  ];

  const actionButton = (
    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-md shadow-brand-purple/20"
    >
      <MdAdd size={18} /> New User
    </button>
  );

  return (
    <PanelLayout 
      icon={<MdPeople size={28} className="text-brand-purple" />} 
      title="User Management" 
      action={actionButton} 
      maxWidth="5xl"
    >
      <DataTable 
        columns={columns}
        data={users}
        emptyMessage={isLoading ? "Loading users..." : "No users found"}
        renderRow={(u) => (
          <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
            <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                <MdPerson size={18} />
              </div>
              {u.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
            <td className="px-6 py-4">
               <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                 {u.role}
               </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleDelete(u.id, u.name)}
                disabled={deleteMutation.isPending && deleteMutation.variables === u.id}
                className="text-gray-400 hover:text-red-500 transition p-1 disabled:opacity-50"
                title="Delete user"
              >
                {deleteMutation.isPending && deleteMutation.variables === u.id ? (
                  <div className="w-[18px] h-[18px] border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <MdDelete size={18} />
                )}
              </button>
            </td>
          </tr>
        )}
      />

      {showModal && (
        <Modal title="Create New User" onClose={() => setShowModal(false)}>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
            <input
              type="text" placeholder="John Doe" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email Address</label>
            <input
              type="email" placeholder="john@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
            />
          </div>
          <div>
             <label className="text-xs font-semibold text-gray-500 mb-1 block">Password</label>
             <input
               type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm"
             />
          </div>
          <div>
             <label className="text-xs font-semibold text-gray-500 mb-1 block">Role</label>
             <select
               value={role}
               onChange={(e) => setRole(e.target.value)}
               className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-purple-500 transition text-sm bg-white"
             >
               <option value="Customer">Customer</option>
               <option value="Admin">Admin</option>
             </select>
          </div>
          <button
            onClick={handleSave} disabled={createMutation.isPending}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg transition disabled:opacity-50 mt-4"
          >
            {createMutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </Modal>
      )}
    </PanelLayout>
  );
}
