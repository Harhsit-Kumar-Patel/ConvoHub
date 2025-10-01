import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function AssignmentDetail() {
    const { id } = useParams(); // Get the assignment ID from the URL
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/assignments/${id}`)
            .then(res => {
                setAssignment(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch assignment details", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="p-8">Loading assignment details...</div>;
    }

    if (!assignment) {
        return <div className="p-8">Assignment not found.</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-4xl font-bold font-heading">{assignment.title}</h1>
                <p className="text-muted-foreground">
                    Due by: {new Date(assignment.dueDate).toLocaleString()}
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Assignment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{assignment.description}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Submit Your Work</CardTitle>
                    <CardDescription>Upload your file(s) to complete the assignment.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-4">
                    {/* A simple file input for submission */}
                    <input type="file" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    <Button>Submit Assignment</Button>
                </CardContent>
            </Card>
        </div>
    );
}