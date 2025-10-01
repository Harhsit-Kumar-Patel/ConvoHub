import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';

export default function Complaints() {
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);

  async function loadMine() {
    try {
      const res = await api.get('/complaints/me');
      setItems(res.data || []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    loadMine();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/complaints', { body: text, anonymous });
      setText('');
      setAnonymous(false);
      await loadMine();
      setSuccessOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-6 grid gap-6">
      <div>
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-danger via-warning to-secondary">Complaint Box</h2>
        <p className="text-slate-600">Submit feedback or complaints. You can choose to submit anonymously.</p>
      </div>

      <form onSubmit={submit} className="grid gap-3 bg-white/70 backdrop-blur border rounded-2xl p-4 shadow" aria-labelledby="complaint-title">
        <div>
          <label className="block text-sm text-slate-600 mb-1" htmlFor="complaint-body">Your message</label>
          <textarea id="complaint-body" className="w-full border rounded-lg px-3 py-2 min-h-[120px] bg-white/80" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Describe your issue or feedback..." required />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={anonymous} onChange={(e)=>setAnonymous(e.target.checked)} /> Submit anonymously
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} disabled={loading} className="px-4 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-60">{loading ? 'Submitting...' : 'Submit'}</motion.button>
      </form>

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission received</DialogTitle>
            <DialogDescription>Your complaint has been submitted. Our team will review it shortly.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 text-sm text-muted-foreground">
            You can track the status below in "Your submissions". Thank you for helping us improve the experience.
          </div>
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <button className="px-3 py-1.5 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground text-sm">Close</button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <h3 className="text-xl font-semibold mb-3">Your submissions</h3>
        <div className="grid gap-3">
          {items.map((c) => (
            <div key={c._id} className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-3 shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 border">{c.status}</span>
                <span className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-slate-700 whitespace-pre-wrap">{c.body}</p>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-slate-500">No submissions yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
