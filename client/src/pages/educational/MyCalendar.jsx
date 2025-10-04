import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { motion } from 'framer-motion';

// Animation variants for the list
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function MyCalendar() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED: Fetch from '/assignments' instead of '/assignments/me'
    api.get('/assignments')
      .then(res => {
        const sorted = (res.data || []).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setAssignments(sorted);
      })
      .catch(err => {
        console.error("Failed to fetch assignments for calendar", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-4xl font-bold font-heading">My Calendar</h1>
        <p className="text-muted-foreground">A schedule of all assignment due dates and events in the workspace.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading deadlines...</p>
          ) : assignments.length === 0 ? (
            <p className="text-muted-foreground">No upcoming assignment deadlines found.</p>
          ) : (
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {assignments.map(assignment => (
                <motion.div key={assignment._id} variants={itemVariants}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
                    <div>
                      <p className="font-semibold">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">{assignment.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-medium">
                        {new Date(assignment.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(assignment.dueDate).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}