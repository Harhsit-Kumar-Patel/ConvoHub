import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

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
    if (!text.trim()) {
      setError('Complaint message cannot be empty.');
      return;
    }
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
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-destructive to-secondary">Complaint Box</h2>
        <p className="text-muted-foreground">Submit feedback or complaints. You can choose to submit anonymously.</p>
      </div>

      <Card as="form" onSubmit={submit} className="grid gap-4 shadow-sm">
        <CardContent className="pt-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="complaint-body">Your message</label>
          <textarea id="complaint-body" className="w-full border rounded-lg px-3 py-2 min-h-[120px] bg-background" value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your issue or feedback..." required />
        </CardContent>
        <div className="px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded" /> Submit anonymously
          </label>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </div>
        {error && <p className="px-6 pb-6 text-sm text-destructive">{error}</p>}
      </Card>

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
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <h3 className="text-xl font-semibold mb-3">Your submissions</h3>
        <div className="grid gap-3">
          {items.map((c) => (
            <Card key={c._id} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize">{c.status}</span>
                  <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-foreground/90 whitespace-pre-wrap">{c.body}</p>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No submissions yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}