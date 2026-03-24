import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthOverlay() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-inter"
         style={{ background: '#0f172a' }}>
      <div className="w-full max-w-md mx-4 rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-sm"
           style={{ background: '#1e293b/80' }}>
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 3v1m0 0a8.001 8.001 0 00-4.582 1.54M12 4a8.001 8.001 0 014.582 1.54M12 4v1m0 16v1m0-1a10.003 10.003 0 01-5.713-1.792M12 21a10.003 10.003 0 005.713-1.792M12 21V12" />
              </svg>
           </div>
           <h2 className="text-3xl font-extrabold text-white tracking-tight">FleetLive Ingress</h2>
           <p className="text-gray-400 mt-2 text-sm font-medium">Monitoring Node Authorization Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Fleet Identifier (Email)</label>
            <input
              type="email" placeholder="adm@fleet-live.io" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-white/5 bg-[#0f172a]/50 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-medium"
              required
            />
          </div>
          
          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Secure Key (Password)</label>
             <input
              type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-white/5 bg-[#0f172a]/50 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-medium"
              required
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 active:scale-[0.98] mt-4"
          >
            {loading ? 'Decrypting Access...' : 'Authenticate'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-2">
             <span className="text-red-400 text-sm font-medium animate-pulse">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
