import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '@/lib/api.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast.jsx';
import { motion } from 'framer-motion';

export default function ProjectBoard() {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!location.state?.project);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const [toast, setToast] = useState({ open: false, title: '', desc: '' });

  useEffect(() => {
    if (project) return;
    // Fallback fetch: if user landed directly on the board URL, we need a detail endpoint.
    // Since backend lacks /projects/:id, load all and pick one for now.
    setLoading(true);
    api.get('/projects')
      .then((res) => {
        const list = res.data || [];
        const found = list.find((p) => String(p._id) === String(id));
        setProject(found || null);
      })
      .finally(() => setLoading(false));
  }, [id, project]);

  const groups = useMemo(() => {
    const tasks = project?.tasks || [];
    return {
      todo: tasks.filter((t) => t.status === 'todo'),
      inProgress: tasks.filter((t) => t.status === 'in-progress'),
      done: tasks.filter((t) => t.status === 'done'),
    };
  }, [project]);

  if (loading) return <div className="p-6">Loading board…</div>;
  if (!project) return <div className="p-6">Project not found.</div>;

  return (
    <section className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-heading">{project.name}</h1>
        <p className="text-muted-foreground">Kanban board</p>
      </header>

      {/* Quick add task */}
      <div className="rounded-2xl border bg-white/70 dark:bg-slate-900/60 backdrop-blur p-3">
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1">Title</label>
            <input className="w-full border rounded-md px-3 py-2 bg-white" value={newTask.title} onChange={(e)=>setNewTask((t)=>({...t, title: e.target.value}))} placeholder="Add task title" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1">Description</label>
            <input className="w-full border rounded-md px-3 py-2 bg-white" value={newTask.description} onChange={(e)=>setNewTask((t)=>({...t, description: e.target.value}))} placeholder="Optional description" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            <select className="border rounded-md px-2 py-2 bg-white" value={newTask.status} onChange={(e)=>setNewTask((t)=>({...t, status: e.target.value}))}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <button
              className="px-3 py-2 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground text-sm"
              onClick={async ()=>{
                if (!newTask.title.trim()) return;
                try {
                  const res = await api.post(`/projects/${project._id}/tasks`, newTask);
                  const task = res.data;
                  setProject((p)=>({ ...p, tasks: [...(p.tasks||[]), task] }));
                  setToast({ open: true, title: 'Task created', desc: 'Your task was added to the board.' });
                } catch (e) {
                  setToast({ open: true, title: 'Failed to create task', desc: 'Please try again.' });
                }
              }}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Column title="To Do" items={groups.todo} color="border-sky-300" onStatusChange={(taskId, status)=>updateTaskStatus(project, setProject, id, taskId, status, setToast)} />
        <Column title="In Progress" items={groups.inProgress} color="border-amber-300" onStatusChange={(taskId, status)=>updateTaskStatus(project, setProject, id, taskId, status, setToast)} />
        <Column title="Done" items={groups.done} color="border-emerald-300" onStatusChange={(taskId, status)=>updateTaskStatus(project, setProject, id, taskId, status, setToast)} />
      </div>

      {/* Local toasts */}
      {toast.open && (
        <Toast open={toast.open} onOpenChange={(o)=>!o && setToast((t)=>({ ...t, open: false }))}>
          <ToastTitle>{toast.title}</ToastTitle>
          {toast.desc && <ToastDescription>{toast.desc}</ToastDescription>}
        </Toast>
      )}
    </section>
  );
}

function Column({ title, items, color, onStatusChange }) {
  return (
    <div className="rounded-2xl border bg-white/70 dark:bg-slate-900/60 backdrop-blur p-3">
      <div className={`mb-3 flex items-center justify-between`}>
        <h3 className="font-semibold">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded border ${color}`}>{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((t, i) => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">{t.title}</CardTitle>
              </CardHeader>
              {t.description && (
                <CardContent className="pt-0 pb-3 text-xs text-muted-foreground">{t.description}</CardContent>
              )}
              <CardContent className="pt-0 pb-3">
                <label className="text-xs text-muted-foreground mr-2">Status</label>
                <select
                  className="border rounded-md px-2 py-1 text-xs"
                  value={t.status}
                  onChange={async (e)=>{
                    const next = e.target.value;
                    await onStatusChange(t._id, next);
                  }}
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
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>🗂️</span>
            <span>No tasks. Use "Add Task" above to create one.</span>
          </div>
        )}
      </div>
    </div>
  );
}

async function updateTaskStatus(project, setProject, projectId, taskId, status, setToast) {
  // optimistic update
  setProject((p)=>({
    ...p,
    tasks: (p.tasks||[]).map((t)=> t._id === taskId ? { ...t, status } : t)
  }));
  try {
    await api.patch(`/projects/${projectId}/tasks/${taskId}`, { status });
    setToast({ open: true, title: 'Task updated', desc: 'Status changed successfully.' });
  } catch (e) {
    // revert on error
    setProject(project);
    setToast({ open: true, title: 'Update failed', desc: 'Could not update task status.' });
  }
}
