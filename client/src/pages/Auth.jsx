import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../lib/socket.js';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = mode === 'login' ? `${API}/auth/login` : `${API}/auth/register`;
      const payload = mode === 'login' ? { email, password } : { name, email, password };
      const res = await axios.post(url, payload);
      const { token, user } = res.data || {};
      if (token) {
        localStorage.setItem('convohub_token', token);
        localStorage.setItem('convohub_user', JSON.stringify(user));
        // identify this socket with the logged-in user
        try { getSocket().emit('identify', user.id || user._id); } catch {}
        navigate('/dashboard');
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setMode('login')} className={`px-3 py-1.5 rounded-lg text-sm ${mode==='login'?'bg-slate-900 text-white':'bg-white border'}`}>Login</button>
          <button onClick={() => setMode('register')} className={`px-3 py-1.5 rounded-lg text-sm ${mode==='register'?'bg-slate-900 text-white':'bg-white border'}`}>Register</button>
        </div>
        <form onSubmit={submit} className="grid gap-3 bg-white/70 backdrop-blur border rounded-2xl p-4 shadow">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-slate-600 mb-1">Name</label>
              <input className="w-full border rounded-lg px-3 py-2 bg-white/80" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input type="email" className="w-full border rounded-lg px-3 py-2 bg-white/80" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2 bg-white/80" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} disabled={loading} className="px-4 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-60">{loading ? 'Please wait...' : (mode==='login' ? 'Login' : 'Register')}</motion.button>
        </form>
      </div>
    </section>
  );
}
