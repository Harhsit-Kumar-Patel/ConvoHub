import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/all')
      .then(res => setComplaints(res.data))
      .catch(err => console.error("Failed to fetch complaints", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-4xl font-bold font-heading">View All Complaints</h1>
        <p className="text-muted-foreground">This is a restricted page for coordinators and above.</p>
      </header>

      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <p className="text-muted-foreground">No complaints have been submitted yet.</p>
          ) : (
            complaints.map(c => (
              <Card key={c._id} className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      Complaint from: {c.anonymous ? 'Anonymous User' : (c.user?.name || 'A User')}
                    </CardTitle>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize">{c.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">{new Date(c.createdAt).toLocaleString()}</p>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{c.body}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}