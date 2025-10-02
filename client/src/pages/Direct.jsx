import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import { getSocket } from '../lib/socket.js';
import { getUser } from '../lib/auth.js';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card.jsx';

export default function Direct() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [toUser, setToUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const me = getUser();

  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    const onDM = (msg) => {
      if (toUser && msg?.from && (msg.from._id === toUser._id || msg.from._id === toUser.id)) {
        setMessages((m) => [...m, { body: msg.message, createdAt: msg.at, from: msg.from }]);
      }
    };
    socket.on('directMessage', onDM);
    return () => socket.off('directMessage', onDM);
  }, [socket, toUser]);

  async function search() {
    if (!query.trim()) return;
    const res = await api.get('/users/search', { params: { q: query } });
    setResults((res.data || []).filter(u => u._id !== me._id));
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
    <section className="p-6 flex flex-col gap-4" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Direct Messages</h2>

      <div className="grid md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <Card className="md:col-span-1 p-3 shadow-sm flex flex-col overflow-hidden">
          <div className="flex gap-2 mb-2">
            <input className="flex-1 border rounded-lg px-3 py-2 bg-background" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search() }} />
            <Button onClick={search}>Search</Button>
          </div>
          <div className="flex-1 grid gap-2 overflow-y-auto">
            {results.map((u) => (
              <button key={u._id} onClick={() => openThread(u)} className={`text-left px-3 py-2 rounded-lg border bg-background hover:bg-accent transition ${toUser?._id === u._id ? 'ring-2 ring-primary' : ''}`}>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </button>
            ))}
            {results.length === 0 && <p className="text-sm text-center text-muted-foreground p-4">No results</p>}
          </div>
        </Card>

        <Card className="md:col-span-2 p-3 flex flex-col shadow-sm">
          {toUser ? (
            <>
              <div className="flex items-center justify-between border rounded-lg p-3 bg-background mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-9 h-9 rounded-full bg-primary/20 border flex items-center justify-center text-xs font-semibold">
                    {(toUser.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                    <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" title="Online" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{toUser.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{toUser.email}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {messages.map((m, i) => {
                  const isMe = me?._id && (m.from?._id === me._id);
                  const time = new Date(m.createdAt || m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={i} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="whitespace-pre-wrap">{m.body}</p>
                        <div className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-2">
                <input className="flex-1 border rounded-lg px-3 py-2 bg-background" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Type a message" />
                <Button onClick={send} disabled={!toUser}>Send</Button>
              </div>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold mb-1 text-foreground">Start a conversation</h3>
                <p className="text-sm text-muted-foreground mb-3">Search for a user on the left to begin a 1:1 chat.</p>
                <Button onClick={() => document.querySelector('input[placeholder="Search users..."]').focus()}>Find users</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}