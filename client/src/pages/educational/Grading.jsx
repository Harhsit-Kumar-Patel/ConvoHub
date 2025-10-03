import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

// A component to manage grading for a single submission
function SubmissionCard({ submission, assignmentId, onGradeSave }) {
  const [grade, setGrade] = useState(submission.grade || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.post(`/assignments/${assignmentId}/submissions/${submission._id}/grade`, {
        grade,
        feedback,
      });
      onGradeSave(res.data); // Update parent state
      toast({ title: "Grade Saved", description: `Grade for ${submission.student.name} has been updated.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not save the grade." });
      console.error("Failed to save grade", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{submission.student.name}</CardTitle>
            <CardDescription>Submitted on: {new Date(submission.submittedAt).toLocaleString()}</CardDescription>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${submission.grade ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {submission.grade ? 'Graded' : 'Not Graded'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {submission.comment && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Student Comment</label>
            <p className="text-sm border bg-background rounded-md p-2 mt-1 whitespace-pre-wrap">{submission.comment}</p>
          </div>
        )}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label htmlFor={`grade-${submission._id}`} className="text-sm font-medium">Grade</label>
            <input id={`grade-${submission._id}`} value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g., A+" className="mt-1 w-full border rounded-md px-3 py-2 bg-background" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`feedback-${submission._id}`} className="text-sm font-medium">Feedback</label>
            <textarea id={`feedback-${submission._id}`} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide feedback..." rows={2} className="mt-1 w-full border rounded-md px-3 py-2 bg-background" />
          </div>
        </div>
        <div className="text-right">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Grade'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default function Grading() {
  const { id } = useParams(); // This is the assignment ID
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [asgmtRes, subsRes] = await Promise.all([
          api.get(`/assignments/${id}`),
          api.get(`/assignments/${id}/submissions`)
        ]);
        setAssignment(asgmtRes.data);
        setSubmissions(subsRes.data);
      } catch (err) {
        console.error("Failed to load grading data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleGradeUpdate = (updatedSubmission) => {
    setSubmissions(prev => 
      prev.map(sub => sub._id === updatedSubmission._id ? { ...sub, ...updatedSubmission } : sub)
    );
  };

  if (loading) return <div className="p-8">Loading submissions...</div>;
  if (!assignment) return <div className="p-8">Assignment not found.</div>;

  return (
    <div className="p-8 space-y-6">
      <header>
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to="/assignments">← Back to Assignments</Link>
        </Button>
        <p className="text-sm font-semibold text-primary">Grading Dashboard</p>
        <h1 className="text-4xl font-bold font-heading">{assignment.title}</h1>
        <p className="text-muted-foreground">Due by: {new Date(assignment.dueDate).toLocaleString()}</p>
      </header>
      
      <div className="space-y-4">
        {submissions.length > 0 ? (
          submissions.map(sub => (
            <SubmissionCard 
              key={sub._id} 
              submission={sub} 
              assignmentId={id}
              onGradeSave={handleGradeUpdate} 
            />
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No submissions have been made for this assignment yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}