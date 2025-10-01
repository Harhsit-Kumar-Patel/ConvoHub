import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../lib/socket.js';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Icons } from '../components/Icons.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TABS = ['login', 'register'];

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceType, setWorkspaceType] = useState('educational');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = mode === 'login' ? `${API}/auth/login` : `${API}/auth/register`;
      const payload = mode === 'login' ? { email, password } : { name, email, password, workspaceType };
      const res = await axios.post(url, payload);
      const { token, user } = res.data || {};
      if (token) {
        localStorage.setItem('convohub_token', token);
        localStorage.setItem('convohub_user', JSON.stringify(user));
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

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 relative overflow-hidden">
        {/* Decorative Blobs */}
        <motion.div
            className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"
        />
        <motion.div
            className="absolute top-0 right-0 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"
        />
        <motion.div
            className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"
        />

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md z-10"
        >
            <Card className="bg-card/60 backdrop-blur-lg border-white/20 shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-primary flex items-center justify-center">
                        <Icons.chat className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-3xl font-heading bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                        {mode === 'login' ? 'Welcome Back!' : 'Join ConvoHub'}
                    </CardTitle>
                    <CardDescription>
                        {mode === 'login' ? "Log in to continue your collaboration." : "Create an account to get started."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* --- THIS IS THE DEFINITIVE FIX FOR THE TOGGLE --- */}
                    <div className="p-1 mb-6 bg-muted rounded-full flex">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setMode(tab)}
                                className="relative w-1/2 py-2 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-full"
                            >
                                {mode === tab && (
                                    <motion.div
                                        layoutId="auth-mode-highlight"
                                        className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full shadow"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className={`relative capitalize ${mode === tab ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                    {tab}
                                </span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div key="register-fields" variants={inputVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                                        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background/50 border rounded-md focus:ring-2 focus:ring-primary" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">I'm using ConvoHub for...</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button type="button" variant={workspaceType === 'educational' ? 'default' : 'outline'} onClick={() => setWorkspaceType('educational')}>
                                                Education
                                            </Button>
                                            <Button type="button" variant={workspaceType === 'professional' ? 'default' : 'outline'} onClick={() => setWorkspaceType('professional')}>
                                                Work
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background/50 border rounded-md focus:ring-2 focus:ring-primary" required />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background/50 border rounded-md focus:ring-2 focus:ring-primary" required />
                        </div>

                        {error && <p className="text-sm text-center text-destructive">{error}</p>}

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" disabled={loading} className="w-full text-base py-3 h-auto">
                                {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
                            </Button>
                        </motion.div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}