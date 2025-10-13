import { useEffect, useState, useCallback } from 'react'; // --- CORRECTED: Added useCallback import
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="dark:fill-gray-300">{`${value} Students`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};


export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get('/analytics/department')
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to fetch analytics", err))
      .finally(() => setLoading(false));
  }, []);
  
  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  if (loading) {
      return (
        <div className="p-8 space-y-6">
            <div className="h-10 w-1/3 rounded-lg bg-muted animate-pulse"></div>
            <div className="h-6 w-1/2 rounded-lg bg-muted animate-pulse"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                <div className="h-28 rounded-lg bg-muted animate-pulse"></div>
                <div className="h-28 rounded-lg bg-muted animate-pulse"></div>
                <div className="h-28 rounded-lg bg-muted animate-pulse"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="h-80 rounded-lg bg-muted animate-pulse"></div>
                <div className="h-80 rounded-lg bg-muted animate-pulse"></div>
            </div>
        </div>
      );
  }
  
  if (!data) {
      return <div className="p-8 text-center text-muted-foreground">Could not load analytics data.</div>;
  }

  const gradeChartData = Object.entries(data.gradeDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));

  const enrollmentChartData = data.enrollmentPerCourse.map(course => ({
      name: course.code,
      value: course.studentCount // --- CORRECTED: Renamed 'students' to 'value' to match PieChart dataKey
  }));


  return (
    <motion.div 
        className="p-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      <header>
        <h1 className="text-4xl font-bold font-heading">Department Analytics</h1>
        <p className="text-muted-foreground">An overview of academic performance and enrollment.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Courses" value={data.totalCourses} />
        <StatCard title="Total Students" value={data.totalStudents} />
        <StatCard title="Total Grades Recorded" value={data.totalGrades} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by Course</CardTitle>
            <CardDescription>Number of students enrolled in each course.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={enrollmentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value" // --- CORRECTED: dataKey should be 'value' now
                  onMouseEnter={onPieEnter}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Grade Distribution</CardTitle>
            <CardDescription>Distribution of all grades recorded across all courses.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Number of Grades" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}