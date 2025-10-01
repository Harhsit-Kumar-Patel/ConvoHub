import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Icons } from '../components/Icons';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold font-heading">Projects</h1>
                    <p className="text-muted-foreground">Collaborate and track your team's projects.</p>
                </div>
                <Button>
                    <Icons.chat className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => (
                    <Card key={project._id}>
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>
                                {project.tasks.length} tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                            <Button asChild variant="outline" size="sm">
                                <Link to={`/projects/${project._id}`} state={{ project }}>View Board</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}