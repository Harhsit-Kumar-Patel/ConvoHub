import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StatCard = ({ title, value }) => (
    <div className="flex flex-col p-4 border rounded-lg bg-background text-center">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm font-medium text-muted-foreground capitalize">{title.replace('-', ' ')}</p>
    </div>
);


export default function TeamPerformance() {
    const [myTeams, setMyTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch teams the current user is a member of (to populate dropdown)
    useEffect(() => {
        setLoading(true);
        api.get('/teams')
            .then(res => {
                const teams = res.data || [];
                setMyTeams(teams);
                if (teams.length > 0) {
                    setSelectedTeam(teams[0]._id);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Failed to fetch teams", err);
                setLoading(false);
            });
    }, []);

    // Fetch performance data when a team is selected
    useEffect(() => {
        if (!selectedTeam) return;
        setLoading(true);
        api.get(`/teams/${selectedTeam}/performance`)
            .then(res => {
                setPerformanceData(res.data || []);
            })
            .catch(err => {
                console.error("Failed to fetch performance data", err);
                setPerformanceData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedTeam]);

    return (
        <div className="p-8 space-y-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-heading">Team Performance</h1>
                    <p className="text-muted-foreground">View workload and task progress for your teams.</p>
                </div>
                {myTeams.length > 0 && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="team-select" className="text-sm font-medium shrink-0">Select Team:</label>
                        <select
                            id="team-select"
                            className="border rounded-lg px-3 py-2 bg-background"
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                        >
                            {myTeams.map((team) => (
                                <option key={team._id} value={team._id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </header>

            {loading ? (
                <p className="text-muted-foreground">Loading performance data...</p>
            ) : myTeams.length === 0 ? (
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You must be a member of a team to view its performance.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {performanceData.map(member => (
                        <Card key={member.memberId}>
                            <CardHeader>
                                <CardTitle>{member.memberName}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                               <StatCard title="Total Tasks" value={member.totalTasks} />
                               <StatCard title="To Do" value={member.taskCounts.todo} />
                               <StatCard title="In Progress" value={member.taskCounts['in-progress']} />
                               <StatCard title="Done" value={member.taskCounts.done} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}