import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthOverlay() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
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
           <h2 className="text-3xl font-extrabold text-white tracking-tight">FleetTracker</h2>
           <p className="text-gray-400 mt-2 text-sm font-medium uppercase tracking-widest">
             {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
           </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex mb-6 bg-[#0f172a]/50 rounded-xl p-1 border border-white/5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <input
                type="text" placeholder="John Doe" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-white/5 bg-[#0f172a]/50 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-medium"
                required
              />
            </div>
          )}

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
              required minLength={6}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 active:scale-[0.98] mt-4"
          >
            {loading
              ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...')
              : (mode === 'signup' ? 'Create Account' : 'Sign In')
            }
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
