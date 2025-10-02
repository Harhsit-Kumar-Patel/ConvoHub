import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import { getUser } from '../lib/auth.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';

export default function TeamChat() {
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const me = getUser();
  const socket = useMemo(() => getSocket(), []);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get('/teams').then((res) => {
      const list = res.data || [];
      setTeams(list);
      if (!teamId && list.length) setTeamId(list[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!teamId) return;
    socket.emit('joinTeam', teamId);
    setMessages([]); // Clear messages when changing teams
    api.get('/messages', { params: { teamId } }).then((res) => setMessages(res.data || []));

    const onTeamMessage = (payload) => {
      if (payload.teamId === teamId) {
        setMessages((m) => [...m, payload.message]);
      }
    };
    socket.on('teamMessage', onTeamMessage);
    return () => {
      socket.off('teamMessage', onTeamMessage);
    };
  }, [teamId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    if (!input.trim() || !teamId) return;
    await api.post('/messages', { body: input, teamId });
    setInput('');
  }

  return (
    <section className="p-6 flex flex-col gap-4" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <div>
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Team Chat</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Select Team</label>
          <select className="border rounded-lg px-3 py-2 bg-background" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>
      <Card className="flex-1 p-4 flex flex-col gap-3 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              const isMe = me?._id && (m.from?._id === me._id);
              const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const name = isMe ? 'You' : (m.from?.name || 'User');
              return (
                <motion.div
                  key={m._id || i}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <div className={`text-xs mb-1 font-semibold ${isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{name} • {time}</div>
                    <div className="whitespace-pre-wrap">{m.body}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                className="w-full border rounded-lg pl-3 pr-24 py-2 bg-background"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Type a message..."
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button onClick={send} size="sm">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}