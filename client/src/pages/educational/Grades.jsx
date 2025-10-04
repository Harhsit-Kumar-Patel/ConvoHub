import { useEffect, useState } from 'react';
import api from '../../lib/api'; // Use the api utility
import { getUser, hasRoleAtLeast } from '../../lib/auth'; // Import auth helpers

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  // CORRECTED: Changed 'principal' to 'instructor'
  const isAdminView = hasRoleAtLeast('instructor');

  useEffect(() => {
    async function load() {
      // Determine which endpoint to use based on user role
      const url = isAdminView ? '/grades/all' : '/grades/me';
      try {
        const res = await api.get(url);
        setGrades(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load grades", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdminView]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{isAdminView ? 'All Student Grades' : 'My Grades'}</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-3">
          {grades.map((g) => (
            <div key={g._id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{g.assignment?.title || 'Assignment'}</p>
                  <p className="text-sm text-muted-foreground">{g.course?.name || 'Course'}</p>
                  {/* Show student name for admin view */}
                  {isAdminView && g.student?.name && (
                    <p className="text-xs mt-1 pt-1 border-t text-primary">{g.student.name}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-semibold text-lg">{g.score}</p>
                  {g.feedback && <p className="text-xs text-muted-foreground mt-1">{g.feedback}</p>}
                </div>
              </div>
            </div>
          ))}
          {!grades.length && (
            <p className="text-sm text-muted-foreground">No grades have been recorded yet.</p>
          )}
        </div>
      )}
    </div>
  );
}