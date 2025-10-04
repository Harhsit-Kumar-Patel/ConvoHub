import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StatCard = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/analytics/department')
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to fetch analytics", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading analytics...</div>;
  if (!data) return <div className="p-8">Could not load analytics data.</div>;

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-4xl font-bold font-heading">Department Analytics</h1>
        <p className="text-muted-foreground">An overview of academic performance and enrollment.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Courses" value={data.totalCourses} />
        <StatCard title="Total Students" value={data.totalStudents} />
        <StatCard title="Total Grades Recorded" value={data.totalGrades} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.enrollmentPerCourse.map(course => (
                <li key={course._id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                  <span>{course.name} ({course.code})</span>
                  <span className="font-semibold">{course.studentCount} Students</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-2">
              {Object.entries(data.gradeDistribution).sort().map(([grade, count]) => (
                <li key={grade} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                  <span>Grade '{grade}'</span>
                  <span className="font-semibold">{count} Recorded</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}