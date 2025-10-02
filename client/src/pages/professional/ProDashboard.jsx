import { useEffect, useState } from 'react';

export default function ProDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tasks = projects.flatMap((p) => (p.tasks || []).map((t) => ({ ...t, project: p.name })));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Professional Dashboard</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-2">My Tasks</h2>
            <ul className="space-y-2">
              {tasks.slice(0, 8).map((t, idx) => (
                <li key={idx} className="text-sm flex justify-between">
                  <span>{t.title} <span className="text-muted-foreground">— {t.project}</span></span>
                  <span className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">{t.status}</span>
                </li>
              ))}
              {!tasks.length && <li className="text-sm text-muted-foreground">No tasks</li>}
            </ul>
          </section>
          <section className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Projects</h2>
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p._id} className="text-sm">
                  <span className="font-medium">{p.name}</span>
                  {p.description && <span className="text-muted-foreground"> — {p.description}</span>}
                </li>
              ))}
              {!projects.length && <li className="text-sm text-muted-foreground">No projects</li>}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
