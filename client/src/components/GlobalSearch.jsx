import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from './Icons';

// Debounce hook to delay API calls
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const SearchResultItem = ({ to, icon, title, description, onSelect }) => (
  <button
    onClick={() => onSelect(to)}
    className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-accent"
  >
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-muted">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="font-semibold text-sm">{title}</p>
      {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
    </div>
  </button>
);

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (!debouncedQuery) {
      setResults(null);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/search/global', { params: { q: debouncedQuery } });
        setResults(res.data);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleSelect = (path) => {
    setIsOpen(false);
    setQuery('');
    setResults(null);
    navigate(path);
  };

  const resultCategories = [
    { key: 'users', title: 'Users', icon: <Icons.profile className="h-4 w-4 text-muted-foreground" />, path: (item) => `/profile` }, // Assuming user profile pages are not public yet
    { key: 'courses', title: 'Courses', icon: <Icons.notice className="h-4 w-4 text-muted-foreground" />, path: (item) => `/courses/${item._id}` },
    { key: 'assignments', title: 'Assignments', icon: <Icons.calendar className="h-4 w-4 text-muted-foreground" />, path: (item) => `/assignments/${item._id}` },
    { key: 'projects', title: 'Projects', icon: <Icons.chat className="h-4 w-4 text-muted-foreground" />, path: (item) => `/projects/${item._id}` },
    { key: 'notices', title: 'Notices', icon: <Icons.notice className="h-4 w-4 text-muted-foreground" />, path: (item) => `/notices` },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full max-w-sm items-center gap-2 rounded-md border bg-card p-2 text-sm text-muted-foreground transition-colors hover:bg-accent">
          <Icons.search className="h-4 w-4" />
          <span>Search anything...</span>
          <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs">Ctrl+K</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl p-0">
        <div className="flex items-center border-b p-3">
          <Icons.search className="h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent p-2 text-base placeholder:text-muted-foreground focus:outline-none"
            placeholder="Search for users, courses, assignments..."
            autoFocus
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {loading && <p className="p-4 text-center text-sm text-muted-foreground">Searching...</p>}
          {!loading && results && (
            <div className="space-y-4">
              {resultCategories.map(cat => (
                results[cat.key]?.length > 0 && (
                  <div key={cat.key}>
                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">{cat.title}</h3>
                    <div className="space-y-1">
                      {results[cat.key].map(item => (
                        <SearchResultItem
                          key={item._id}
                          to={cat.path(item)}
                          icon={cat.icon}
                          title={item.name || item.title}
                          description={item.email || item.code}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
              {Object.values(results).every(arr => arr.length === 0) && (
                 <p className="p-8 text-center text-sm text-muted-foreground">No results found for "{debouncedQuery}"</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}