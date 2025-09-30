import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Notices from './pages/Notices.jsx';
import Chat from './pages/Chat.jsx';
import Complaints from './pages/Complaints.jsx';
import Profile from './pages/Profile.jsx';
import Auth from './pages/Auth.jsx';
import Direct from './pages/Direct.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { getUser, isAuthed, logout } from './lib/auth.js';

export default function App() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(isAuthed());
  const user = getUser();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('convohub_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('convohub_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('convohub_theme', 'light');
    }
  }, [dark]);

  function handleLogout() {
    logout();
    setAuthed(false);
    navigate('/');
  }

  return (
    <div className="min-h-screen relative text-slate-800 dark:text-slate-200">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-primary via-accent to-secondary bg-[length:200%_200%] animate-gradient-x opacity-20 dark:opacity-25" />

      {/* Subtle radial highlight */}
      <div className="pointer-events-none absolute -z-10 inset-0 [background:radial-gradient(600px_300px_at_30%_10%,rgba(255,255,255,0.5),transparent_60%)] dark:[background:radial-gradient(600px_300px_at_30%_10%,rgba(15,23,42,0.6),transparent_60%)]" />

      <nav className="mx-4 mt-4 mb-6 rounded-2xl border border-white/60 bg-white/70 dark:border-white/10 dark:bg-slate-900/60 backdrop-blur shadow flex items-center justify-between px-6 py-3">
        <Link to="/" className="font-extrabold text-2xl tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">ConvoHub</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/notices', label: 'Notices' },
            { to: '/chat', label: 'Chat' },
            { to: '/direct', label: 'Direct' },
            { to: '/complaints', label: 'Complaints' },
            { to: '/profile', label: 'Profile' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800/60 transition">
              {item.label}
            </Link>
          ))}
          <motion.button
            whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
            onClick={() => setDark((v) => !v)}
            className="ml-1 px-3 py-1.5 rounded-lg text-sm border bg-white/70 hover:bg-white dark:bg-slate-800 dark:border-white/10 dark:hover:bg-slate-700"
            title="Toggle theme"
          >
            {dark ? 'Light' : 'Dark'}
          </motion.button>
          {authed ? (
            <div className="flex items-center gap-2 pl-1">
              <span className="hidden sm:inline text-xs text-slate-600 dark:text-slate-400">{user?.name}</span>
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow hover:opacity-90">
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.div whileHover={{ y: -1 }}>
              <Link to="/auth" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow hover:opacity-90">Login</Link>
            </motion.div>
          )}
        </div>
      </nav>

      <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/direct" element={<ProtectedRoute><Direct /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </motion.main>
    </div>
  );
}
