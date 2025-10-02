import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Icons } from '../components/Icons';
import { getUser } from '@/lib/auth';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
    },
};


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch projects", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

    if (loading) {
        return <div className="p-8">Loading projects...</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold font-heading">Projects</h1>
                    <p className="text-muted-foreground">Collaborate and track your team's projects.</p>
                </div>
                {isAdmin && (
                  <Button>
                      <Icons.chat className="w-4 h-4 mr-2" />
                      New Project
                  </Button>
                )}
            </header>

            <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {projects.map((project) => (
                    <motion.div
                        key={project._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                        <Card className="transition-all hover:shadow-md">
                            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{project.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
                                </div>
                                <div className="w-full md:w-auto flex items-center justify-between gap-4">
                                    <div className="text-sm text-muted-foreground text-left md:text-center w-32">
                                        <span className="font-medium text-foreground">{project.tasks.length}</span> Tasks
                                    </div>
                                    <div className="w-28 text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link to={`/projects/${project._id}`} state={{ project }}>View Board</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}