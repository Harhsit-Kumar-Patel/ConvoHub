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
        return (
            <div className="p-8 space-y-8">
                <header>
                    <h1 className="text-4xl font-bold font-heading">Projects</h1>
                    <p className="text-muted-foreground">Loading your team's projects...</p>
                </header>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-1/2 mt-2 animate-pulse"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-5/6 mb-4 animate-pulse"></div>
                                <div className="h-9 bg-muted rounded w-28 animate-pulse"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
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
                    <Card key={project._id} className="hover:border-primary/50 transition-colors shadow-sm">
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>
                                {project.tasks.length} tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
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