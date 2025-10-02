import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
    },
};

export default function ExploreTeams() {
    const [allTeams, setAllTeams] = useState([]);
    const [myTeams, setMyTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(null); // Track which team is being joined

    const fetchAllTeams = async () => {
        try {
            const res = await api.get('/teams/all');
            setAllTeams(res.data || []);
        } catch (err) {
            console.error("Failed to fetch all teams", err);
        }
    };

    const fetchMyTeams = async () => {
        try {
            const res = await api.get('/teams');
            setMyTeams(res.data || []);
        } catch (err) {
            console.error("Failed to fetch my teams", err);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchAllTeams(), fetchMyTeams()]).finally(() => setLoading(false));
    }, []);

    const myTeamIds = useMemo(() => new Set(myTeams.map(t => t._id)), [myTeams]);

    const handleJoinTeam = async (teamId) => {
        setJoining(teamId);
        try {
            await api.post(`/teams/${teamId}/join`);
            await fetchMyTeams();
        } catch (err) {
            console.error("Failed to join team", err);
        } finally {
            setJoining(null);
        }
    };

    if (loading) {
        return <div className="p-8">Loading teams...</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <header>
                <h1 className="text-4xl font-bold font-heading">Explore Teams</h1>
                <p className="text-muted-foreground">Find and join teams to start collaborating.</p>
            </header>

            <motion.div 
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {allTeams.map((team) => {
                    const isMember = myTeamIds.has(team._id);
                    return (
                        <motion.div
                            key={team._id}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="flex flex-col h-full">
                                <CardHeader>
                                    <CardTitle>{team.name}</CardTitle>
                                    <CardDescription>{team.description || 'No description provided.'}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-end">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{team.members.length} Member(s)</span>
                                        {isMember ? (
                                            <Button variant="outline" disabled>
                                                <Icons.profile className="w-4 h-4 mr-2" />
                                                Joined
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleJoinTeam(team._id)} disabled={joining === team._id}>
                                                {joining === team._id ? 'Joining...' : 'Join Team'}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
             {allTeams.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg col-span-full">
                    <p className="text-muted-foreground">No teams found. Why not create one?</p>
                    <Button asChild variant="link" className="mt-2">
                        <Link to="/teams">Create a Team</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}