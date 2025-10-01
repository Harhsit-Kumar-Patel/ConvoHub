import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Notices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/notices`)
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let arr = [...items];
    if (tab === 'pinned') arr = arr.filter((n) => n.pinned);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((n) => (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q));
    }
    return arr;
  }, [items, tab, query]);

  return (
    <section className="p-6">
      <div className="mb-5 space-y-3">
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-info via-accent to-secondary">Notices</h2>
        <p className="text-slate-600 dark:text-slate-400">Stay in the loop with the latest announcements.</p>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative max-w-sm md:ml-auto">
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search notices..."
              aria-label="Search notices"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
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
        {filtered.map((n, i) => (
          <motion.div
            key={n._id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.03 * i }}
            className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-4 shadow cursor-pointer hover:border-primary/40"
            onClick={()=>{ setSelected(n); setOpen(true); }}
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
        {filtered.length === 0 && (
          !loading && (
            <div className="rounded-2xl border border-dashed bg-white/40 dark:bg-slate-900/40 backdrop-blur p-6 text-center text-slate-500 dark:text-slate-400">
              No notices yet.
            </div>
          )
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  By {selected.author || 'Admin'} • {new Date(selected.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {selected.body}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
