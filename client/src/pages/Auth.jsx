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

const educationalRoles = ['student', 'ta', 'instructor', 'coordinator', 'principal'];
const professionalRoles = ['member', 'lead', 'manager', 'org_admin'];

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceType, setWorkspaceType] = useState('educational');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = mode === 'login' ? `${API}/auth/login` : `${API}/auth/register`;
      const payload = mode === 'login'
        ? { email, password }
        : { name, email, password, workspaceType, role };
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
  
  const handleWorkspaceChange = (type) => {
    setWorkspaceType(type);
    setRole(type === 'educational' ? 'student' : 'member');
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-muted p-8">
        <div className="max-w-md w-full">
            <Icons.authIllustration />
        </div>
        <div className="mt-8 text-center max-w-md">
            <h2 className="text-3xl font-bold font-heading">Welcome to ConvoHub</h2>
            <p className="text-muted-foreground mt-2">Your all-in-one platform for seamless communication and collaboration. Let's get started.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Icons.chat className="w-8 h-8 text-primary"/>
                <span className="font-heading text-2xl font-bold">ConvoHub</span>
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-muted-foreground mt-2">
                {mode === 'login' ? "Sign in to access your dashboard." : "Fill in the details to join."}
            </p>
          </div>
        
          <motion.form 
            key={mode}
            onSubmit={submit} 
            className="space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div key="name-field" variants={itemVariants}>
                  <InputField icon={<Icons.profile className="h-4 w-4 text-gray-400" />} type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
                <InputField icon={<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </motion.div>
            <motion.div variants={itemVariants}>
                <InputField icon={<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </motion.div>

            <AnimatePresence>
              {mode === 'register' && (
                <motion.div key="register-fields" className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} variants={itemVariants}>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Select your workspace</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button type="button" variant={workspaceType === 'educational' ? 'default' : 'outline'} onClick={() => handleWorkspaceChange('educational')}>Education</Button>
                      <Button type="button" variant={workspaceType === 'professional' ? 'default' : 'outline'} onClick={() => handleWorkspaceChange('professional')}>Work</Button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="role-select" className="text-sm font-medium text-muted-foreground">Select your role</label>
                    <select id="role-select" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background/50 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none">
                      {(workspaceType === 'educational' ? educationalRoles : professionalRoles).map(r => (
                        <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-sm text-center text-destructive">{error}</p>}
            <motion.div variants={itemVariants}>
                <Button type="submit" disabled={loading} className="w-full text-base py-3 h-auto">{loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}</Button>
            </motion.div>
          </motion.form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <p>Don't have an account? <button type="button" onClick={() => setMode('register')} className="font-semibold text-primary hover:underline">Sign up</button></p>
            ) : (
              <p>Already have an account? <button type="button" onClick={() => setMode('login')} className="font-semibold text-primary hover:underline">Log in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}