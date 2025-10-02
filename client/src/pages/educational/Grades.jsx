import { useEffect, useState } from 'react';

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('convohub_token');
        const res = await fetch('/api/grades/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setGrades(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Grades</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-3">
          {grades.map((g) => (
            <div key={g._id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{g.assignment?.title || 'Assignment'}</p>
                  <p className="text-sm text-muted-foreground">{g.course?.name || 'Course'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{g.score}</p>
                  {g.feedback && <p className="text-xs text-muted-foreground">{g.feedback}</p>}
                </div>
              </div>
            </div>
          ))}
          {!grades.length && (
            <p className="text-sm text-muted-foreground">No grades yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
