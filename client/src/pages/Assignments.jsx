import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Icons } from '../components/Icons';
import { getUser } from '@/lib/auth';

export default function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    useEffect(() => {
        api.get('/assignments')
            .then(res => {
                setAssignments(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch assignments", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const isSubmitted = (assignment) => {
        if (!user || !assignment.submissions) return false;
        return assignment.submissions.some(sub => sub.student === user._id);
    };

    if (loading) {
        return <div className="p-8">Loading assignments...</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold font-heading">Assignments</h1>
                    <p className="text-muted-foreground">View and manage your course assignments.</p>
                </div>
                <Button>
                    <Icons.notice className="w-4 h-4 mr-2" />
                    New Assignment
                </Button>
            </header>

            <div className="space-y-4">
                {assignments.map((assignment) => (
                    <Card key={assignment._id} className="transition-all hover:shadow-md">
                        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{assignment.description}</p>
                            </div>
                            <div className="w-full md:w-auto flex items-center justify-between gap-4">
                                <div className="text-sm text-muted-foreground text-left md:text-center w-32">
                                    <span className="font-medium text-foreground">Due:</span> {new Date(assignment.dueDate).toLocaleDateString()}
                                </div>
                                <div className="w-28 text-center">
                                    {isSubmitted(assignment) ? (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                            Submitted
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <div className="w-28 text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link to={`/assignments/${assignment._id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}