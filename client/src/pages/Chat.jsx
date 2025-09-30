import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import { getUser } from '../lib/auth.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
  const [cohorts, setCohorts] = useState([]);
  const [cohortId, setCohortId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    // Load cohorts
    api.get('/cohorts').then((res) => {
      const list = res.data || [];
      setCohorts(list);
      if (!cohortId && list.length) setCohortId(list[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!cohortId) return;
    socket.emit('joinCohort', cohortId);
    // Load history
    api.get('/messages', { params: { cohortId } }).then((res) => setMessages(res.data || []));

    const onCohort = (msg) => {
      if (msg.cohortId === cohortId) setMessages((m) => [...m, msg]);
    };
    socket.on('cohortMessage', onCohort);
    return () => {
      socket.off('cohortMessage', onCohort);
    };
  }, [cohortId, socket]);

  async function send() {
    if (!input.trim() || !cohortId) return;
    await api.post('/messages', { body: input, cohortId });
    setInput('');
  }

  return (
    <section className="p-6 grid gap-4">
      <div>
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Cohort Chat</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Cohort</label>
          <select className="border rounded-lg px-3 py-2 bg-white/80 backdrop-blur" value={cohortId} onChange={(e)=>setCohortId(e.target.value)}>
            {cohorts.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-4 h-64 overflow-auto flex flex-col gap-2 shadow">
        <AnimatePresence initial={false}>
        {messages.map((m, i) => {
          const me = (getUser()?._id || getUser()?.id) && (m.from?._id === (getUser()?._id || getUser()?.id));
          const text = m.message || m.body;
          const time = new Date(m.at || m.createdAt).toLocaleTimeString();
          const name = me ? 'You' : (m.from?.name || '');
          return (
            <motion.div
              key={m._id || `${i}-${text}-${time}`}
              className={`flex ${me ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${me ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-white border'}`}>
                <div className="opacity-80 text-[11px] mb-0.5">{name} • {time}</div>
                <div className="whitespace-pre-wrap">{text}</div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
      <div className="mt-1 flex gap-2">
        <input className="flex-1 border rounded-lg px-3 py-2 bg-white/80 backdrop-blur" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={send} className="px-4 py-2 rounded-lg bg-slate-900 text-white shadow">Send</motion.button>
      </div>
    </section>
  );
}
