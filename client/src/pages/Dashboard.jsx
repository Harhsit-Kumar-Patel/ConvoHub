import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api.js';
import { Icons } from '../components/Icons.jsx';
import { getUser } from '../lib/auth.js';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' } }
};


const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    </motion.div>
);

const EmptyState = () => (
    <div className="text-center p-8 sm:p-12 border-2 border-dashed rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-foreground">No recent activity</h3>
        <p className="mt-1 text-sm text-muted-foreground">Get started by sending a message or checking for notices.</p>
    </div>
);


export default function Dashboard() {
    const [stats, setStats] = useState({ notices: 0, threads: 0 });
    const [activityFeed, setActivityFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [noticesRes, threadsRes] = await Promise.all([
                    api.get('/notices'),
                    api.get('/messages/recent-threads')
                ]);

                const notices = (noticesRes.data || []).map(item => ({ ...item, type: 'notice', date: item.createdAt }));
                const threads = (threadsRes.data || []).map(item => ({ ...item, type: 'dm', date: item.lastAt }));

                setStats({ notices: notices.length, threads: threads.length });

                const combinedFeed = [...notices, ...threads]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10);

                setActivityFeed(combinedFeed);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <motion.div 
            className="p-6 md:p-8 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-lg bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground shadow-lg"
            >
                <h1 className="text-3xl font-bold font-heading">Welcome Back, {user?.name || 'User'}!</h1>
                <p className="mt-1 opacity-90">Here’s what’s happening in your workspace today.</p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <Button asChild variant="outline" className="h-auto py-3"><Link to="/direct">New Message</Link></Button>
                 <Button asChild variant="outline" className="h-auto py-3"><Link to="/projects">View Projects</Link></Button>
                 <Button asChild variant="outline" className="h-auto py-3"><Link to="/assignments">Assignments</Link></Button>
                 <Button asChild variant="outline" className="h-auto py-3"><Link to="/complaints">Submit Feedback</Link></Button>
            </motion.div>

            {/* Stat Cards */}
            <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Active Notices" value={`${stats.notices}`} icon={Icons.notice} colorClass="bg-blue-500" />
                <StatCard title="Recent DMs" value={`${stats.threads}`} icon={Icons.dm} colorClass="bg-purple-500" />
                <StatCard title="Your Cohort" value="Alpha 2025" icon={Icons.chat} colorClass="bg-green-500" />
            </motion.div>

            {/* Activity Feed */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>The latest updates from your workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                             <div className="text-center p-8 text-muted-foreground">Loading activity...</div>
                        ) : (
                            <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                                {activityFeed.length > 0 ? activityFeed.map((item, index) => (
                                    <motion.div key={`${item.type}-${item._id || index}`} variants={itemVariants} className="group transition-all duration-300 ease-in-out">
                                        <Link to={item.type === 'notice' ? '/notices' : '/direct'} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent hover:shadow-md transform group-hover:scale-[1.02]">
                                            <div className={`w-10 h-10 rounded-full ${item.type === 'notice' ? 'bg-primary/10' : 'bg-secondary/10'} flex-shrink-0 flex items-center justify-center`}>
                                                {item.type === 'notice' ? <Icons.notice className="w-5 h-5 text-primary" /> : <span className="font-bold text-secondary text-xs">{(item.user?.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</span>}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-sm">{item.type === 'notice' ? item.title : `New message from ${item.user.name}`}</p>
                                                <p className="text-sm text-muted-foreground truncate">{item.type === 'notice' ? item.body : item.lastMessage}</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground self-start hidden sm:block">{new Date(item.date).toLocaleDateString()}</div>
                                        </Link>
                                    </motion.div>
                                )) : <EmptyState />}
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}