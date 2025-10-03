import { useState } from 'react';
import api from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Link } from 'react-router-dom';

export default function CreateNotice() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !body) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both a title and a body for the notice.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/notices', { title, body, pinned });
      toast({
        title: "Announcement Posted",
        description: "The new notice is now visible to everyone.",
      });
      // Reset form
      setTitle('');
      setBody('');
      setPinned(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err?.response?.data?.message || "Could not post the announcement.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <header>
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to="/notices">← Back to Notices</Link>
        </Button>
        <h1 className="text-4xl font-bold font-heading">Post New Announcement</h1>
        <p className="text-muted-foreground">Create a new notice that will be visible to all users.</p>
      </header>

      <Card as="form" onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Notice Details</CardTitle>
          <CardDescription>Clearly state the title and content for the announcement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" required />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-muted-foreground mb-1">Body</label>
            <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" required />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="pinned"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="pinned" className="text-sm font-medium">Pin this announcement to the top</label>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Announcement'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}