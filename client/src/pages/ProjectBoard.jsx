import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '@/lib/api.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ProjectBoard() {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!location.state?.project);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });

  useEffect(() => {
    if (project) return;
    setLoading(true);
    api.get('/projects')
      .then((res) => {
        const found = (res.data || []).find((p) => String(p._id) === String(id));
        setProject(found || null);
      })
      .finally(() => setLoading(false));
  }, [id, project]);

  async function handleAddTask() {
    if (!newTask.title.trim()) return;
    try {
      const res = await api.post(`/projects/${project._id}/tasks`, newTask);
      const task = res.data;
      setProject((p) => ({ ...p, tasks: [...(p.tasks || []), task] }));
      setNewTask({ title: '', description: '', status: 'todo' });
    } catch (e) {
      console.error("Failed to add task", e);
    }
  }
  
  async function updateTaskStatus(taskId, status) {
    const originalTasks = project.tasks;
    setProject((p) => ({
      ...p,
      tasks: (p.tasks || []).map((t) => t._id === taskId ? { ...t, status } : t)
    }));
    try {
      await api.patch(`/projects/${project._id}/tasks/${taskId}`, { status });
    } catch (e) {
      setProject((p) => ({ ...p, tasks: originalTasks }));
    }
  }
  
  const groups = useMemo(() => {
    const tasks = project?.tasks || [];
    return {
      todo: tasks.filter((t) => t.status === 'todo'),
      'in-progress': tasks.filter((t) => t.status === 'in-progress'),
      done: tasks.filter((t) => t.status === 'done'),
    };
  }, [project]);

  if (loading) return <div className="p-6">Loading board…</div>;
  if (!project) return <div className="p-6">Project not found.</div>;

  return (
    <section className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-heading">{project.name}</h1>
        <p className="text-muted-foreground">A Kanban board to track progress.</p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">Task Title</label>
              <input className="w-full border rounded-md px-3 py-2 bg-background" value={newTask.title} onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))} placeholder="Enter a title for the new task..." />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">Description (Optional)</label>
              <input className="w-full border rounded-md px-3 py-2 bg-background" value={newTask.description} onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))} placeholder="Add a short description..." />
            </div>
            <div className="flex items-end gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Status</label>
                <select className="border rounded-md px-2 py-2 bg-background" value={newTask.status} onChange={(e) => setNewTask((t) => ({ ...t, status: e.target.value }))}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Column title="To Do" items={groups.todo} color="border-sky-500" onStatusChange={updateTaskStatus} />
        <Column title="In Progress" items={groups['in-progress']} color="border-amber-500" onStatusChange={updateTaskStatus} />
        <Column title="Done" items={groups.done} color="border-emerald-500" onStatusChange={updateTaskStatus} />
      </div>
    </section>
  );
}

function Column({ title, items, color, onStatusChange }) {
  return (
    <Card className={`border-t-4 ${color}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-sm font-bold text-muted-foreground">{items.length}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((t, i) => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:border-primary/40 transition-colors shadow-sm bg-background">
              <CardContent className="pt-4 pb-2">
                <p className="font-semibold text-sm mb-1">{t.title}</p>
                {t.description && <p className="text-xs text-muted-foreground mb-3">{t.description}</p>}
                <select
                  className="border rounded-md px-2 py-1 text-xs bg-background"
                  value={t.status}
                  onChange={(e) => onStatusChange(t._id, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-center text-muted-foreground py-8">
            <p>No tasks in this column.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}