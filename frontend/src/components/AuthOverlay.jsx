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

  function fillDemo() {
    setEmail('test1@gmail.com');
    setPassword('test@123T');
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-inter"
         style={{ background: '#0f172a' }}>
      <div className="w-full max-w-md mx-4 rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-sm"
           style={{ background: '#1e293b/80' }}>
        <div className="flex flex-col items-center mb-8">
           <h2 className="text-3xl font-extrabold text-white tracking-tight">FleetTracker</h2>
           <p className="text-gray-400 mt-2 text-sm font-medium uppercase tracking-widest">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
            <input
              type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-white/5 bg-[#0f172a]/50 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-medium"
              required
            />
          </div>
          
          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">Demo Credentials</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300 space-y-1">
              <p>Email: <span className="text-white font-mono font-bold">test1@gmail.com</span></p>
              <p>Pass: <span className="text-white font-mono font-bold">test@123T</span></p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold rounded-lg transition-colors border border-purple-500/20"
            >
              Auto-fill
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-2">
             <span className="text-red-400 text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
