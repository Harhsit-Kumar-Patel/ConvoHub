import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../lib/socket.js';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Icons } from '../components/Icons.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceType, setWorkspaceType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (mode === 'register' && !workspaceType) {
        setError('Please select a workspace type.');
        return;
    }
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-heading">
                    {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-6">
                    <Button onClick={() => setMode('login')} variant={mode === 'login' ? 'default' : 'outline'} className="w-full">Login</Button>
                    <Button onClick={() => setMode('register')} variant={mode === 'register' ? 'default' : 'outline'} className="w-full">Register</Button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    {mode === 'register' && (
                        <>
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-transparent border rounded-md" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">I am using ConvoHub for...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button type="button" variant={workspaceType === 'educational' ? 'secondary' : 'outline'} onClick={() => setWorkspaceType('educational')}>
                                        Education
                                    </Button>
                                    <Button type="button" variant={workspaceType === 'professional' ? 'secondary' : 'outline'} onClick={() => setWorkspaceType('professional')}>
                                        Work
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-transparent border rounded-md" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-transparent border rounded-md" required />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}