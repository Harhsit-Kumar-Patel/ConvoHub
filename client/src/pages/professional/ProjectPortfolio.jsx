import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// A simple progress bar component
const ProgressBar = ({ value }) => (
    <div className="w-full bg-muted rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${value}%` }}></div>
    </div>
);

export default function ProjectPortfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/projects/portfolio')
            .then(res => {
                setPortfolio(res.data || []);
            })
            .catch(err => {
                console.error("Failed to fetch project portfolio", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8">Loading project portfolio...</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <header>
                <h1 className="text-4xl font-bold font-heading">Project Portfolio</h1>
                <p className="text-muted-foreground">A high-level overview of all projects.</p>
            </header>

            {portfolio.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No projects found to display in the portfolio.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {portfolio.map(project => (
                        <Card key={project._id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>
                                    <Link to={`/projects/${project._id}`} className="hover:underline">
                                        {project.name}
                                    </Link>
                                </CardTitle>
                                {project.description && <CardDescription className="line-clamp-2 h-10 pt-1">{project.description}</CardDescription>}
                            </CardHeader>
                            <CardContent className="space-y-4 flex flex-col flex-grow justify-end">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium">Progress</span>
                                        <span className="text-sm font-bold">{project.progress}%</span>
                                    </div>
                                    <ProgressBar value={project.progress} />
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center border-t pt-4">
                                    <div>
                                        <p className="font-bold text-lg">{project.taskCounts.todo}</p>
                                        <p className="text-xs text-muted-foreground">To Do</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{project.taskCounts['in-progress']}</p>
                                        <p className="text-xs text-muted-foreground">In Progress</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{project.taskCounts.done}</p>
                                        <p className="text-xs text-muted-foreground">Done</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}