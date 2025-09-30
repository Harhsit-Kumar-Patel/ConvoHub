import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Notices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/notices`)
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="p-6">
      <div className="mb-5">
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-info via-accent to-secondary">Notices</h2>
        <p className="text-slate-600 dark:text-slate-400">Stay in the loop with the latest announcements.</p>
      </div>
      <div className="grid gap-4">
        {loading && (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur p-4 shadow"
            >
              <div className="h-4 w-24 rounded bg-[linear-gradient(90deg,rgba(148,163,184,0.25),rgba(148,163,184,0.45),rgba(148,163,184,0.25))] bg-[length:200%_100%] animate-shimmer" />
              <div className="mt-3 h-5 w-2/3 rounded bg-[linear-gradient(90deg,rgba(148,163,184,0.25),rgba(148,163,184,0.45),rgba(148,163,184,0.25))] bg-[length:200%_100%] animate-shimmer" />
              <div className="mt-2 h-4 w-full rounded bg-[linear-gradient(90deg,rgba(148,163,184,0.25),rgba(148,163,184,0.45),rgba(148,163,184,0.25))] bg-[length:200%_100%] animate-shimmer" />
              <div className="mt-2 h-4 w-5/6 rounded bg-[linear-gradient(90deg,rgba(148,163,184,0.25),rgba(148,163,184,0.45),rgba(148,163,184,0.25))] bg-[length:200%_100%] animate-shimmer" />
            </div>
          ))
        )}
        {items.map((n, i) => (
          <motion.div
            key={n._id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.03 * i }}
            className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-4 shadow"
          >
            <div className="flex items-center gap-2">
              {n.pinned && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-warning to-secondary text-white shadow">
                  Pinned
                </span>
              )}
              <h3 className="text-lg font-semibold">{n.title}</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{n.body}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">By {n.author || 'Admin'} • {new Date(n.createdAt).toLocaleString()}</p>
          </motion.div>
        ))}
        {items.length === 0 && (
          !loading && (
            <div className="rounded-2xl border border-dashed bg-white/40 dark:bg-slate-900/40 backdrop-blur p-6 text-center text-slate-500 dark:text-slate-400">
              No notices yet.
            </div>
          )
        )}
      </div>
    </section>
  );
}
