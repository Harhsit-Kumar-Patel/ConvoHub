import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { Icons } from '../components/Icons.jsx';

const StatCard = ({ title, description, icon: Icon, colorClass }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{description}</div>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const [notices, setNotices] = useState([]);
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        api.get('/notices').then(res => setNotices(res.data.slice(0, 3)));
        api.get('/messages/recent-threads').then(res => setThreads(res.data.slice(0, 3)));
    }, []);

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-4xl font-bold font-heading">Dashboard</h1>
                <p className="text-muted-foreground">A quick overview of your ConvoHub activity.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Notices" description={`${notices.length} Recent`} icon={Icons.notice} colorClass="bg-primary" />
                <StatCard title="Recent DMs" description={`${threads.length} Threads`} icon={Icons.dm} colorClass="bg-secondary" />
                <StatCard title="Your Cohort" description="Alpha 2025" icon={Icons.chat} colorClass="bg-green-500" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Notices</CardTitle>
                        <CardDescription>The latest announcements and updates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {notices.map(notice => (
                                <div key={notice._id} className="flex items-start gap-4">
                                    <div className="w-8 h-8 mt-1 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                                        <Icons.notice className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{notice.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{notice.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent DMs</CardTitle>
                        <CardDescription>Your latest one-on-one conversations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {threads.map(thread => (
                                <div key={thread.user._id} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-secondary">
                                            {(thread.user?.name || 'U').split(' ').map((w)=>w[0]).slice(0,2).join('').toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{thread.user.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}