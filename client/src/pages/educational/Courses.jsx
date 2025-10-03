import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { motion } from 'framer-motion';
import api from '../../lib/api'; // Use the api utility
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/courses')
      .then(res => {
        setCourses(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("Failed to fetch courses", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div 
      className="p-8 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header>
        <h1 className="text-4xl font-bold font-heading">Your Courses</h1>
        <p className="text-muted-foreground">Select a course to view details and materials.</p>
      </header>

      {loading ? (
        <p className="text-muted-foreground">Loading courses...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <motion.div
              key={c._id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
            >
              <Link to={`/courses/${c._id}`} className="block h-full">
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{c.name}</CardTitle>
                    <CardDescription>{c.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {c.instructor && (
                      <p className="text-sm mt-1">Instructor: {c.instructor}</p>
                    )}
                    {c.description && (
                      <p className="text-sm mt-2 text-muted-foreground line-clamp-3">{c.description}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
          {!courses.length && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-10">No courses to display.</p>
          )}
        </div>
      )}
    </motion.div>
  );
}