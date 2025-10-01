import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast.jsx';

export default function AssignmentDetail() {
  const { id } = useParams(); // Get the assignment ID from the URL
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [submission, setSubmission] = useState(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, title: '', desc: '' });

  useEffect(() => {
    api.get(`/assignments/${id}`)
      .then(res => {
        setAssignment(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch assignment details", err);
      })
      .finally(() => {
        setLoading(false);
      });
    // Load my submission status
    api.get(`/assignments/${id}/submissions/me`).then(res => setSubmission(res.data || null)).catch(()=>setSubmission(null));
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading assignment details...</div>;
  }

  if (!assignment) {
    return <div className="p-8">Assignment not found.</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-heading">{assignment.title}</h1>
        <p className="text-muted-foreground">
          Due by: {new Date(assignment.dueDate).toLocaleString()}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{assignment.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
          <CardDescription>Upload your file(s) to complete the assignment.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          {/* For now, submissions accept a comment only; files can be added later */}
          <textarea
            className="w-full max-w-xl border rounded-lg px-3 py-2 bg-white"
            placeholder="Notes or link to your work (e.g., GitHub/Drive)"
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button disabled={submitting} onClick={async ()=>{
              try {
                setSubmitting(true);
                await api.post(`/assignments/${id}/submissions`, { comment });
                const me = await api.get(`/assignments/${id}/submissions/me`);
                setSubmission(me.data || null);
                setOpen(true);
                setToast({ open: true, title: 'Submitted', desc: 'Your assignment was submitted successfully.' });
              } finally {
                setSubmitting(false);
              }
            }}>{submitting ? 'Submitting…' : 'Submit Assignment'}</Button>
            {submission && (
              <span className="text-sm text-muted-foreground">Submitted at {new Date(submission.submittedAt).toLocaleString()}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission received</DialogTitle>
            <DialogDescription>Your submission has been recorded. You can update it by resubmitting.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <button className="px-3 py-1.5 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground text-sm">Close</button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toasts */}
      {toast.open && (
        <Toast open={toast.open} onOpenChange={(o)=>!o && setToast((t)=>({ ...t, open: false }))}>
          <ToastTitle>{toast.title}</ToastTitle>
          {toast.desc && <ToastDescription>{toast.desc}</ToastDescription>}
        </Toast>
      )}
    </div>
  );
}