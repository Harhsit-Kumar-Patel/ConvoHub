import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Gradebook() {
  const { id } = useParams(); // This is the course ID
  const [gradebookData, setGradebookData] = useState({ assignments: [], gradebook: [] });
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [courseRes, gradebookRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/gradebook`)
        ]);
        setCourse(courseRes.data);
        setGradebookData(gradebookRes.data);
      } catch (err) {
        console.error("Failed to load gradebook data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-8">Loading Gradebook...</div>;
  if (!course) return <div className="p-8">Course not found.</div>;

  const { assignments, gradebook } = gradebookData;

  return (
    <div className="p-8 space-y-6">
      <header>
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to={`/courses/${id}`}>← Back to Course</Link>
        </Button>
        <p className="text-sm font-semibold text-primary">Instructor Dashboard</p>
        <h1 className="text-4xl font-bold font-heading">Gradebook: {course.name}</h1>
        <p className="text-muted-foreground">{course.code}</p>
      </header>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Student Name</th>
                  {assignments.map(asgmt => (
                    <th key={asgmt._id} className="px-4 py-3 font-medium text-center">{asgmt.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gradebook.map(row => (
                  <tr key={row.studentId} className="border-b">
                    <td className="px-4 py-3 font-medium">{row.studentName}</td>
                    {assignments.map(asgmt => (
                      <td key={asgmt._id} className="px-4 py-3 text-center">
                        {row.grades[asgmt._id] || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {gradebook.length === 0 && (
            <p className="p-8 text-center text-muted-foreground">No students or assignments found for this course.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}