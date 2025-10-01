import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api.js';
import { Icons } from '../components/Icons.jsx';

const StatCard = ({ title, description, icon: Icon, colorClass }) => (
  <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
    <Card className="transition-colors hover:border-primary/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{description}</div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Dashboard() {
    const [notices, setNotices] = useState([]);
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        api.get('/notices').then(res => setNotices(res.data.slice(0, 3)));
        api.get('/messages/recent-threads').then(res => setThreads(res.data.slice(0, 3)));
    }, []);

    return (
      <div className="p-6 md:p-8 space-y-8">
        <header className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">A quick overview of your ConvoHub activity.</p>
        </header>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/notices">View Notices</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/assignments">Assignments</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/projects">Projects</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/chat">Cohort Chat</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/direct">Direct Messages</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/complaints">Complaint Box</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/profile">Profile</Link></Button>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Notices" description={`${notices.length} Recent`} icon={Icons.notice} colorClass="bg-primary" />
          <StatCard title="Recent DMs" description={`${threads.length} Threads`} icon={Icons.dm} colorClass="bg-secondary" />
          <StatCard title="Your Cohort" description="Alpha 2025" icon={Icons.chat} colorClass="bg-green-500" />
        </div>

        {/* Feature Shortcuts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/assignments" className="block group">
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm"><Icons.notice className="w-5 h-5 text-white"/></div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View tasks, due dates, and submit work.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/projects" className="block group">
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm"><Icons.chat className="w-5 h-5 text-white"/></div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View boards, add tasks, and track progress.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/notices" className="block group">
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notices</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm"><Icons.notice className="w-5 h-5 text-white"/></div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">See announcements. Filter by pinned, search content.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/complaints" className="block group">
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Complaint Box</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center shadow-sm"><Icons.dm className="w-5 h-5 text-white"/></div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Submit feedback or issues, anonymously if you like.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile" className="block group">
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center shadow-sm"><Icons.profile className="w-5 h-5 text-white"/></div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Edit basics, links, and skills with tabs.</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Notices</CardTitle>
                    <CardDescription>The latest announcements and updates.</CardDescription>
                  </div>
                  <Link className="text-sm text-primary hover:underline" to="/notices">View all</Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notices.map(notice => (
                    <Link key={notice._id} to={`/notices`} className="group flex items-start gap-4">
                      <div className="w-8 h-8 mt-1 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icons.notice className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold group-hover:text-foreground transition-colors">{notice.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{notice.body}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
            <Card className="hover:border-secondary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent DMs</CardTitle>
                    <CardDescription>Your latest one-on-one conversations.</CardDescription>
                  </div>
                  <Link className="text-sm text-secondary hover:underline" to="/direct">View all</Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threads.map(thread => (
                    <Link key={thread.user._id} to={`/direct`} className="group flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex-shrink-0 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                        <span className="text-xs font-bold text-secondary">
                          {(thread.user?.name || 'U').split(' ').map((w)=>w[0]).slice(0,2).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">{thread.user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
}