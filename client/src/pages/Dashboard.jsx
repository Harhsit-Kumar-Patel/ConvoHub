import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Dashboard() {
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const cards = [
    { to: '/notices', title: 'Notices', desc: 'Latest updates and announcements', color: 'from-info to-accent' },
    { to: '/chat', title: 'Cohort Chat', desc: 'Collaborate with your batch', color: 'from-primary to-secondary' },
    { to: '/direct', title: 'Direct Messages', desc: 'One-on-one conversations', color: 'from-success to-primary' },
    { to: '/complaints', title: 'Complaint Box', desc: 'Submit feedback or issues', color: 'from-warning to-danger' },
    { to: '/profile', title: 'Profile', desc: 'Your information and links', color: 'from-secondary to-info' },
  ];

  useEffect(() => {
    setLoadingNotices(true);
    api.get('/notices')
      .then((res) => setNotices(Array.isArray(res.data) ? res.data.slice(0, 5) : []))
      .catch(() => setNotices([]))
      .finally(() => setLoadingNotices(false));
  }, []);

  useEffect(() => {
    setLoadingThreads(true);
    api.get('/messages/recent-threads')
      .then((res) => setThreads(Array.isArray(res.data) ? res.data : []))
      .catch(() => setThreads([]))
      .finally(() => setLoadingThreads(false));
  }, []);

  return (
    <section className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Welcome back</h2>
        <p className="text-slate-600">Quick links to explore everything in ConvoHub.</p>
      </div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 1 },
          show: { opacity: 1, transition: { staggerChildren: 0.06 } },
        }}
      >
        {cards.map((c) => (
          <motion.div
            key={c.to}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow"
            whileHover={{ y: -2 }}
          >
            <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${c.color} mb-3`} />
            <h3 className="font-semibold text-lg">{c.title}</h3>
            <motion.div whileHover={{ y: -1 }}>
              <Link to={c.to} className="inline-block px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm shadow hover:opacity-90">Open</Link>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Widgets */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Recent Notices */}
        <div className="lg:col-span-2 rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Notices</h3>
            <Link to="/notices" className="text-xs px-2 py-1 rounded border bg-white hover:bg-slate-50">View all</Link>
          </div>
          <div className="grid gap-2">
            {loadingNotices && (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`s-${i}`} className="h-10 rounded-lg bg-[linear-gradient(90deg,rgba(148,163,184,0.25),rgba(148,163,184,0.45),rgba(148,163,184,0.25))] bg-[length:200%_100%] animate-shimmer" />
              ))
            )}
            {!loadingNotices && notices.map((n) => (
              <Link
                to="/notices"
                key={n._id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-slate-50 transition"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-info to-accent" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{n.title}</div>
                  <div className="text-xs text-slate-600 truncate">{n.body}</div>
                </div>
                <div className="text-[10px] text-slate-500 whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString()}</div>
              </Link>
            ))}
            {!loadingNotices && notices.length === 0 && (
              <div className="p-6 rounded-xl border border-dashed text-center text-slate-500 bg-white/60">No notices yet.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid gap-2">
            <Link to="/direct" className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm shadow hover:opacity-90">Start a DM</Link>
            <Link to="/chat" className="px-3 py-2 rounded-lg border bg-white text-sm hover:bg-slate-50">Open Cohort Chat</Link>
            <Link to="/complaints" className="px-3 py-2 rounded-lg border bg-white text-sm hover:bg-slate-50">File a Complaint</Link>
            <Link to="/profile" className="px-3 py-2 rounded-lg border bg-white text-sm hover:bg-slate-50">Edit Profile</Link>
          </div>
        </div>
      </div>

      {/* Recent DMs */}
      <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recent DMs</h3>
          <Link to="/direct" className="text-xs px-2 py-1 rounded border bg-white hover:bg-slate-50">Go to Direct</Link>
        </div>
        <div className="grid gap-2">
          {loadingThreads && Array.from({ length: 5 }).map((_, i) => (
            <div key={`t-s-${i}`} className="h-12 rounded-lg bg-[linear-gradient(90deg,rgba(148,163,184,0.25),rgba(148,163,184,0.45),rgba(148,163,184,0.25))] bg-[length:200%_100%] animate-shimmer" />
          ))}
          {!loadingThreads && threads.map((t, idx) => (
            <Link key={idx} to="/direct" className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-slate-50 transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border flex items-center justify-center text-[10px] font-semibold">
                {(t.user?.name || 'U').split(' ').map((w)=>w[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.user?.name || 'Unknown User'}</div>
                <div className="text-xs text-slate-600 truncate">{t.lastMessage}</div>
              </div>
              <div className="text-[10px] text-slate-500 whitespace-nowrap">{new Date(t.lastAt).toLocaleTimeString()}</div>
            </Link>
          ))}
          {!loadingThreads && threads.length === 0 && (
            <div className="p-6 rounded-xl border border-dashed text-center text-slate-500 bg-white/60">No recent direct messages.</div>
          )}
        </div>
      </div>
    </section>
  );
}
