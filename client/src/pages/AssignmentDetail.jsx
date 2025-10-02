import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';

export default function AssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [submission, setSubmission] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get(`/assignments/${id}`)
      .then(res => setAssignment(res.data))
      .catch(err => console.error("Failed to fetch assignment details", err))
      .finally(() => setLoading(false));

    api.get(`/assignments/${id}/submissions/me`)
      .then(res => setSubmission(res.data || null))
      .catch(() => setSubmission(null));
  }, [id]);

  async function handleSubmit() {
    try {
      setSubmitting(true);
      await api.post(`/assignments/${id}/submissions`, { comment });
      const me = await api.get(`/assignments/${id}/submissions/me`);
      setSubmission(me.data || null);
      setOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

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
          <p className="whitespace-pre-wrap text-foreground/90">{assignment.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
          <CardDescription>
            {submission ? "You have already submitted this assignment. You can update your submission below." : "Upload your file(s) and add comments to complete the assignment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <textarea
            className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background"
            placeholder="Add a comment, or a link to your work (e.g., GitHub, Google Drive)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Submitting…' : (submission ? 'Update Submission' : 'Submit Assignment')}
            </Button>
            {submission && (
              <span className="text-sm text-muted-foreground">Last submitted at {new Date(submission.submittedAt).toLocaleString()}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Received</DialogTitle>
            <DialogDescription>Your submission has been recorded. You can update it by resubmitting before the deadline.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}