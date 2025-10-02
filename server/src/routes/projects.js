import { Router } from 'express';
import Project from '../models/Project.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/auth.js';

const router = Router();

// GET /api/projects - List all projects
router.get('/', auth(true), async (req, res) => {
  try {
    // In a real app, you'd filter projects by the user's workspace/team
    const items = await Project.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load projects' });
  }
});

// POST /api/projects - Create a new project (admin only)
router.post('/', auth(true), admin(), async (req, res) => {
  try {
    const { name, description } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
    const doc = await Project.create({ name: String(name).trim(), description: description || '' });
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create project' });
  }
});

// POST /api/projects/:projectId/tasks - create new task (admin only)
router.post('/:projectId/tasks', auth(true), admin(), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const proj = await Project.findById(projectId);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    const task = { title, description: description || '', status: status || 'todo' };
    proj.tasks.push(task);
    await proj.save();
    const created = proj.tasks[proj.tasks.length - 1];
    return res.json(created);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create task' });
  }
});

// PATCH /api/projects/:projectId/tasks/:taskId - update task (status/description/title) (admin only)
router.patch('/:projectId/tasks/:taskId', auth(true), admin(), async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status } = req.body || {};
    const proj = await Project.findById(projectId);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    const t = proj.tasks.id(taskId);
    if (!t) return res.status(404).json({ message: 'Task not found' });
    if (title !== undefined) t.title = title;
    if (description !== undefined) t.description = description;
    if (status !== undefined) t.status = status;
    await proj.save();
    return res.json(t);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to update task' });
  }
});

export default router;