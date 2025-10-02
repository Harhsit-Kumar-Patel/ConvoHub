import { useEffect, useState } from 'react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('convohub_token');
        const res = await fetch('/api/courses', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c._id} className="border rounded-lg p-4 bg-card">
              <h2 className="font-semibold">{c.name}</h2>
              <p className="text-sm text-muted-foreground">{c.code}</p>
              {c.instructor && (
                <p className="text-sm mt-1">Instructor: {c.instructor}</p>
              )}
              {c.description && (
                <p className="text-sm mt-2 line-clamp-3">{c.description}</p>
              )}
            </div>
          ))}
          {!courses.length && (
            <p className="text-sm text-muted-foreground">No courses to display.</p>
          )}
        </div>
      )}
    </div>
  );
}
