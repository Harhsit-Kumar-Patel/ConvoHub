import { useState } from 'react';
import api from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast'; // Corrected Import Path

export default function CreateAssignment() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !dueDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a title and a due date.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/assignments', { title, description, dueDate });
      toast({
        title: "Assignment Created",
        description: `"${title}" has been successfully created.`,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err?.response?.data?.message || "Could not create the assignment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-4xl font-bold font-heading">Create New Assignment</h1>
        <p className="text-muted-foreground">Fill out the details below to create a new assignment for students.</p>
      </header>

      <Card as="form" onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>This will be visible to all students in the educational workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
            <input id="dueDate" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" required />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Assignment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}