import { useState } from 'react';
import api from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Link } from 'react-router-dom';

export default function CreateCourse() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [instructor, setInstructor] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !code) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a course name and code.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/courses', { name, code, instructor, description });
      toast({
        title: "Course Created",
        description: `"${name}" has been successfully created.`,
      });
      // Reset form
      setName('');
      setCode('');
      setInstructor('');
      setDescription('');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err?.response?.data?.message || "Could not create the course.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <header>
         <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to="/courses">← Back to Courses</Link>
        </Button>
        <h1 className="text-4xl font-bold font-heading">Create New Course</h1>
        <p className="text-muted-foreground">Fill out the details below to create a new course offering.</p>
      </header>

      <Card as="form" onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>This information will be visible to all students.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Course Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-background" required />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-muted-foreground mb-1">Course Code</label>
              <input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-background" placeholder="e.g., CS101" required />
            </div>
          </div>
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium text-muted-foreground mb-1">Instructor Name</label>
            <input id="instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full max-w-xl border rounded-lg px-3 py-2 bg-background" />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Course'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}