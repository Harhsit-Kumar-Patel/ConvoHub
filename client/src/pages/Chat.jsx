import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import { getUser } from '../lib/auth.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';

export default function Chat() {
  const [cohorts, setCohorts] = useState([]);
  const [cohortId, setCohortId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef(null);
  const me = getUser();
  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    api.get('/cohorts').then((res) => {
      const list = res.data || [];
      setCohorts(list);
      if (!cohortId && list.length) setCohortId(list[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!cohortId) return;
    socket.emit('joinCohort', cohortId);
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

  function onInputChange(e) {
    setInput(e.target.value);
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 1200);
  }

  return (
    <section className="p-6 flex flex-col gap-4" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <div>
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">Cohort Chat</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Select Cohort</label>
          <select className="border rounded-lg px-3 py-2 bg-background backdrop-blur" value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
            {cohorts.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <Card className="flex-1 p-4 flex flex-col gap-3 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              const isMe = me?._id && (m.from?._id === me._id);
              const text = m.message || m.body;
              const time = new Date(m.at || m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const name = isMe ? 'You' : (m.from?.name || '');
              return (
                <motion.div
                  key={m._id || `${i}-${text}-${time}`}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <div className={`text-xs mb-1 font-semibold ${isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{name} • {time}</div>
                    <div className="whitespace-pre-wrap">{text}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="mt-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                className="w-full border rounded-lg pl-3 pr-24 py-2 bg-background backdrop-blur"
                value={input}
                onChange={onInputChange}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Type a message"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button onClick={send} size="sm">Send</Button>
              </div>
            </div>
          </div>
          {typing && <div className="mt-1 text-xs text-muted-foreground">Typing…</div>}
        </div>
      </Card>
    </section>
  );
}