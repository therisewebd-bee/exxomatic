import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthOverlay() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password, role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
         style={{ background: '#0f172a' }}>
      <div className="w-full max-w-md mx-4 rounded-2xl border border-white/10 p-8"
           style={{ background: '#1e293b' }}>
        <h2 className="text-2xl font-bold text-white text-center mb-6">FleetLive Ingress</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 text-center py-3 text-sm font-medium border-b-2 transition-all ${
              mode === 'login'
                ? 'border-purple-500 text-purple-400 opacity-100'
                : 'border-transparent text-gray-400 opacity-50'
            }`}
          >Login</button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 text-center py-3 text-sm font-medium border-b-2 transition-all ${
              mode === 'signup'
                ? 'border-purple-500 text-purple-400 opacity-100'
                : 'border-transparent text-gray-400 opacity-50'
            }`}
          >Create Account</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <input
                type="text" placeholder="Full Name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f172a] text-white outline-none focus:border-purple-500 transition"
                required
              />
              <select
                value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f172a] text-white outline-none focus:border-purple-500 transition"
              >
                <option value="Customer">Standard Customer</option>
                <option value="Admin">Administrator</option>
              </select>
            </>
          )}
          <input
            type="email" placeholder="Email Address" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f172a] text-white outline-none focus:border-purple-500 transition"
            required
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f172a] text-white outline-none focus:border-purple-500 transition"
            required
          />
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
