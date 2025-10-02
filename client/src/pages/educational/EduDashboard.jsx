import { useEffect, useState } from 'react';

export default function EduDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [aRes, nRes] = await Promise.all([
          fetch('/api/assignments'),
          fetch('/api/notices'),
        ]);
        const [a, n] = await Promise.all([aRes.json(), nRes.json()]);
        setAssignments(a?.slice(0, 5) || []);
        setNotices(n?.slice(0, 5) || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Upcoming Assignments</h2>
            <ul className="space-y-2">
              {assignments.map((a) => (
                <li key={a._id} className="text-sm">
                  <span className="font-medium">{a.title}</span>
                  {a.dueDate && (
                    <span className="text-muted-foreground"> — due {new Date(a.dueDate).toLocaleDateString()}</span>
                  )}
                </li>
              ))}
              {!assignments.length && <li className="text-sm text-muted-foreground">No assignments</li>}
            </ul>
          </section>
          <section className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Pinned Notices</h2>
            <ul className="space-y-2">
              {notices.map((n) => (
                <li key={n._id} className="text-sm">
                  <span className="font-medium">{n.title}</span>
                </li>
              ))}
              {!notices.length && <li className="text-sm text-muted-foreground">No notices</li>}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
