import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Icons } from '../components/Icons';

export default function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="p-8">Loading assignments...</div>;
    }

    return (
        <div className="p-8 space-y-8">
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map(assignment => (
                    <Card key={assignment._id}>
                        <CardHeader>
                            <CardTitle>{assignment.title}</CardTitle>
                            <CardDescription>
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                            {/* UPDATE THIS BUTTON */}
                            <Button asChild variant="outline" size="sm">
                                <Link to={`/assignments/${assignment._id}`}>View Details</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}