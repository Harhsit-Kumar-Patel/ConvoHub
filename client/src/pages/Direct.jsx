import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import { getUser } from '../lib/auth.js';
import { motion } from 'framer-motion';

export default function Direct() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [toUser, setToUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    const onDM = (msg) => {
      // If active thread matches, append
      if (toUser && msg?.from && (msg.from._id === toUser._id || msg.from._id === toUser.id)) {
        setMessages((m) => [...m, { body: msg.message, createdAt: msg.at, from: msg.from }]);
      }
    };
    socket.on('directMessage', onDM);
    return () => socket.off('directMessage', onDM);
  }, [socket, toUser]);

  async function search() {
    const res = await api.get('/users/search', { params: { q: query } });
    setResults(res.data || []);
  }

  async function openThread(user) {
    setToUser(user);
    const res = await api.get('/messages', { params: { toUser: user._id } });
    setMessages(res.data || []);
  }

  async function send() {
    if (!input.trim() || !toUser) return;
    await api.post('/messages', { body: input, toUser: toUser._id });
    setInput('');
  }

  return (
    <section className="p-6 grid gap-4">
      <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-success via-accent to-primary">Direct Messages</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 border rounded-2xl bg-white/70 backdrop-blur p-3 shadow">
          <div className="flex gap-2 mb-2">
            <input className="flex-1 border rounded-lg px-3 py-2 bg-white/80 backdrop-blur" placeholder="Search users by name/email" value={query} onChange={(e)=>setQuery(e.target.value)} />
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={search} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Search</motion.button>
          </div>
          <div className="grid gap-2">
            {results.map((u) => (
              <button key={u._id} onClick={() => openThread(u)} className={`text-left px-3 py-2 rounded-lg border bg-white/80 hover:bg-white transition ${toUser?._id===u._id?'ring-1 ring-primary/40':''}`}>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-slate-500">{u.email}</div>
              </button>
            ))}
            {results.length === 0 && <p className="text-sm text-slate-500">No results</p>}
          </div>
        </div>

        <div className="md:col-span-2 border rounded-2xl bg-white/70 backdrop-blur p-3 flex flex-col shadow">
          {/* Thread header */}
          {toUser ? (
            <div className="flex items-center justify-between border rounded-lg p-3 bg-white mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border flex items-center justify-center text-xs font-semibold">
                  {(toUser.name || 'U').split(' ').map((w)=>w[0]).slice(0,2).join('').toUpperCase()}
                  {/* Presence dot (placeholder) */}
                  <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-emerald-500 border border-white" title="Online" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate flex items-center gap-2">
                    <span className="truncate">{toUser.name}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">Online</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{toUser.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} disabled className="px-2 py-1.5 text-xs rounded-lg border bg-white text-slate-600">Start Call</motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} disabled className="px-2 py-1.5 text-xs rounded-lg border bg-white text-slate-600">Share File</motion.button>
              </div>
            </div>
          ) : null}

          <div className="h-64 overflow-auto border rounded-lg p-3 bg-white flex flex-col gap-2">
            {toUser ? (
              messages.map((m, i) => {
                const me = (getUser()?._id || getUser()?.id) && (m.from?._id === (getUser()?._id || getUser()?.id));
                const text = m.message || m.body;
                const time = new Date(m.createdAt || m.at).toLocaleTimeString();
                const name = me ? 'You' : (m.from?.name || '');
                return (
                  <div key={i} className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${me ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-white border'}`}>
                      <div className="opacity-80 text-[11px] mb-0.5">{name} • {time}</div>
                      <div className="whitespace-pre-wrap">{text}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                    <span className="text-xl">💬</span>
                  </div>
                  <h3 className="font-semibold mb-1">Start a conversation</h3>
                  <p className="text-sm text-slate-600 mb-3">Search for a user on the left to begin a 1:1 chat.</p>
                  <div className="flex items-center justify-center">
                    <button onClick={search} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm">Find users</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2 bg-white/80 backdrop-blur" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message" />
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={send} className="px-4 py-2 rounded-lg bg-slate-900 text-white" disabled={!toUser}>Send</motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
