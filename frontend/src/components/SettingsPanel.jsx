import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUpdateUserMutation } from '../hooks/useQueries';
import { MdSettings, MdPerson, MdSecurity } from 'react-icons/md';
import PanelLayout from './ui/PanelLayout';

export default function SettingsPanel() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const updateMutation = useUpdateUserMutation();
  const [message, setMessage] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setMessage('');
    try {
      await updateMutation.mutateAsync({ id: user.id, data: { name } });
      setMessage('Settings updated successfully. (Requires re-login to update sidebar)');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  return (
    <PanelLayout 
      icon={<MdSettings size={28} className="text-brand-purple" />} 
      title="Account Settings" 
      maxWidth="3xl"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-4 text-sm font-semibold text-brand-purple border-b-2 border-brand-purple bg-brand-purple/5">Profile</button>
          <button className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-50">Preferences</button>
          <button className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-50">Security</button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdPerson className="text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdSecurity className="text-gray-400" /> Account Role
              </label>
              <input
                type="text"
                value={user?.role || 'Customer'}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className={`text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </span>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-brand-purple hover:bg-brand-purple-dark px-8 py-3 rounded-xl text-white font-semibold transition shadow-lg shadow-brand-purple/20 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PanelLayout>
  );
}
