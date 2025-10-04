import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hasRoleAtLeast } from '@/lib/auth'; // Import the role checker

// A simple icon for a file
const FileIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const canManageCourse = hasRoleAtLeast('instructor'); // Check user role

  useEffect(() => {
    setLoading(true);
    api.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error("Failed to fetch course details", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading course details...</div>;
  }

  if (!course) {
    return <div className="p-8">Course not found.</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <header>
        <div className="flex justify-between items-center mb-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/courses">← Back to Courses</Link>
          </Button>
          {canManageCourse && (
            <div className="flex gap-2">
              <Button asChild>
                <Link to={`/courses/${id}/gradebook`}>View Gradebook</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to={`/courses/${id}/manage`}>Manage Course</Link>
              </Button>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold font-heading">{course.name}</h1>
        <p className="text-muted-foreground text-lg">{course.code} - Taught by {course.instructor || 'TBA'}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Course Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90">{course.description || 'No description provided.'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Materials</CardTitle>
          <CardDescription>Download syllabuses, lecture notes, and other resources.</CardDescription>
        </CardHeader>
        <CardContent>
          {course.materials && course.materials.length > 0 ? (
            <div className="space-y-3">
              {course.materials.map((material) => (
                <a 
                  key={material._id} 
                  href={material.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-3 rounded-lg bg-background border hover:bg-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{material.name}</p>
                      <p className="text-xs text-muted-foreground">{material.fileType || 'File'}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Download</Button>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No materials have been uploaded for this course yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}