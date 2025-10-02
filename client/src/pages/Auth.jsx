import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../lib/socket.js';
import { Button } from '../components/ui/button';
import { Icons } from '../components/Icons.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const InputField = ({ icon, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
        </div>
        <input {...props} className="block w-full pl-10 px-3 py-2 bg-background/50 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none" />
    </div>
);


export default function Auth() {
  const [mode, setMode] = useState('login');
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
        try { getSocket().emit('identify', user.id || user._id); } catch { }
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

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      
      <motion.div
        className="w-full max-w-md z-10 text-center"
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
      >
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex justify-center items-center gap-2 mb-4">
            <Icons.chat className="w-8 h-8 text-primary"/>
            <span className="font-heading text-2xl font-bold">ConvoHub</span>
        </motion.div>

        <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="font-heading text-4xl font-bold tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Get Started'}
        </motion.h1>

        <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-muted-foreground mt-2">
            {mode === 'login' ? "Sign in to access your dashboard." : "Create an account to start collaborating."}
        </motion.p>
        
        <motion.div
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="mt-8 text-left"
            animate={error ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.3 } } : {}}
        >
            <form onSubmit={submit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {mode === 'register' && (
                    <motion.div key="name-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', duration: 0.5 }}>
                        <InputField icon={<Icons.profile className="h-4 w-4 text-gray-400" />} type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </motion.div>
                )}
              </AnimatePresence>

              <InputField icon={<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <InputField icon={<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div key="workspace-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', duration: 0.5, delay: 0.1 }} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">I'm using ConvoHub for...</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button type="button" variant={workspaceType === 'educational' ? 'default' : 'outline'} onClick={() => setWorkspaceType('educational')}>Education</Button>
                      <Button type="button" variant={workspaceType === 'professional' ? 'default' : 'outline'} onClick={() => setWorkspaceType('professional')}>Work</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && <p className="text-sm text-center text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full text-base py-3 h-auto">{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}</Button>
            </form>
        </motion.div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <p>Don't have an account? <button type="button" onClick={() => setMode('register')} className="font-semibold text-primary hover:underline">Sign up</button></p>
          ) : (
            <p>Already have an account? <button type="button" onClick={() => setMode('login')} className="font-semibold text-primary hover:underline">Log in</button></p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}