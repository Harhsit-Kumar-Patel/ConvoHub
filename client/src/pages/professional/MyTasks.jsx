import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
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
        opacity: 1,
    },
};

const statusColors = {
    todo: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
};

export default function MyTasks() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/projects/my-tasks')
            .then(res => {
                setProjects(res.data || []);
            })
            .catch(err => {
                console.error('Failed to fetch tasks', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8">Loading your tasks...</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <header>
                <h1 className="text-4xl font-bold font-heading">My Tasks</h1>
                <p className="text-muted-foreground">A list of all tasks assigned to you across all projects.</p>
            </header>

            {projects.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You have no tasks assigned to you.</p>
                </div>
            ) : (
                <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {projects.map(project => (
                        <motion.div key={project._id} variants={itemVariants}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        <Link to={`/projects/${project._id}`} className="hover:underline">
                                            {project.name}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {project.tasks.map(task => (
                                        <div key={task._id} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                                            <div>
                                                <p className="font-semibold">{task.title}</p>
                                                {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
                                                {task.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}