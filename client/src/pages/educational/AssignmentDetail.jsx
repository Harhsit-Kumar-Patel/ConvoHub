import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';

export default function AssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch both assignment and submission data
  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get(`/assignments/${id}`), api.get(`/assignments/${id}/submissions/me`)])
      .then(([assignmentRes, submissionRes]) => {
        setAssignment(assignmentRes.data);
        setSubmission(submissionRes.data || null);
      })
      .catch((err) => console.error('Failed to fetch data', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('comment', comment);
      for (let i = 0; i < files.length; i++) {
        formData.append('assignmentFiles', files[i]);
      }

      await api.post(`/assignments/${id}/submissions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setOpen(true); // Show success dialog
      fetchData(); // Refresh data to show new submission status
    } catch (error) {
      console.error('Submission failed', error);
      // You could add a toast notification for the error here
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
        <p className="text-muted-foreground">Due by: {new Date(assignment.dueDate).toLocaleString()}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground/90">{assignment.description}</p>
        </CardContent>
      </Card>

      {/* --- Grade & Feedback Section --- */}
      {submission?.grade && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle>Grade & Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Grade</p>
              <p className="text-2xl font-bold text-primary">{submission.grade}</p>
            </div>
            {submission.feedback && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Instructor Feedback</p>
                <p className="mt-1 whitespace-pre-wrap text-foreground/90">{submission.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
          <CardDescription>{submission ? 'You can update your submission below.' : 'Upload your file(s) and add comments to complete the assignment.'}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <textarea className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" placeholder="Add a comment, or a link to your work..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="w-full max-w-xl text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
          <div className="flex items-center gap-3">
            <Button disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Submitting…' : submission ? 'Update Submission' : 'Submit Assignment'}
            </Button>
            {submission && <span className="text-sm text-muted-foreground">Last submitted at {new Date(submission.submittedAt).toLocaleString()}</span>}
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