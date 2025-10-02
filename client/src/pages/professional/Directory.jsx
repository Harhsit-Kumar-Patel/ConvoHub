import { useEffect, useMemo, useState } from 'react';

export default function Directory() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQ = useDebounce(q, 250);

  useEffect(() => {
    async function search() {
      setLoading(true);
      try {
        const token = localStorage.getItem('convohub_token');
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(debouncedQ)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [debouncedQ]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Employee Directory</h1>
      <input
        className="w-full md:w-96 border rounded px-3 py-2 bg-background"
        placeholder="Search by name or email..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((u) => (
          <div key={u._id} className="border rounded-lg p-4 bg-card">
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm text-muted-foreground">{u.email}</p>
            {u.role && <p className="text-xs mt-1">Role: {u.role}</p>}
            {Array.isArray(u.skills) && u.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {u.skills.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
