import { Router } from 'express';
import Project from '../models/Project.js';
import { auth, authorize } from '../middleware/auth.js';
import mongoose from 'mongoose';

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

// GET /api/projects/my-tasks - Get all tasks assigned to the current user
router.get('/my-tasks', auth(true), authorize({ workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const projectsWithMyTasks = await Project.aggregate([
      {
        $match: {
          'tasks.assignee': userId,
        },
      },
      {
        $addFields: {
          tasks: {
            $filter: {
              input: '$tasks',
              as: 'task',
              cond: { $eq: ['$$task.assignee', userId] },
            },
          },
        },
      },
    ]);
    res.json(projectsWithMyTasks);
  } catch (e) {
    console.error('Failed to fetch my tasks', e);
    res.status(500).json({ message: 'Failed to fetch assigned tasks' });
  }
});

// GET /api/projects/portfolio - Get a high-level overview of all projects
router.get('/portfolio', auth(true), authorize({ min: 'manager', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const portfolioData = await Project.aggregate([
      { $unwind: { path: '$tasks', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            projectId: '$_id',
            status: '$tasks.status',
          },
          taskCount: { $sum: { $cond: [{ $ifNull: ["$tasks._id", false] }, 1, 0] } },
        },
      },
      {
        $group: {
          _id: '$_id.projectId',
          statusCounts: {
            $push: {
              status: '$_id.status',
              count: '$taskCount',
            },
          },
          totalTasks: { $sum: '$taskCount' },
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectDetails',
        },
      },
      { $unwind: '$projectDetails' },
      {
        $project: {
          _id: 1,
          name: '$projectDetails.name',
          description: '$projectDetails.description',
          totalTasks: 1,
          statusCounts: 1,
          createdAt: '$projectDetails.createdAt',
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const results = portfolioData.map(p => {
      const counts = {
        todo: 0,
        'in-progress': 0,
        done: 0,
      };
      p.statusCounts.forEach(item => {
        if (counts.hasOwnProperty(item.status)) {
          counts[item.status] = item.count;
        }
      });
      const progress = p.totalTasks > 0 ? Math.round((counts.done / p.totalTasks) * 100) : 0;
      return {
        ...p,
        taskCounts: counts,
        progress,
      };
    });

    res.json(results);
  } catch (e) {
    console.error('Failed to get project portfolio', e);
    res.status(500).json({ message: 'Failed to retrieve project portfolio' });
  }
});

// POST /api/projects - Create a new project (professional: lead+)
router.post('/', auth(true), authorize({ min: 'lead', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const { name, description } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
    const doc = await Project.create({ name: String(name).trim(), description: description || '' });
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create project' });
  }
});

// POST /api/projects/:projectId/tasks - create new task (professional: lead+)
router.post('/:projectId/tasks', auth(true), authorize({ min: 'lead', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, assignee } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const proj = await Project.findById(projectId);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    const task = { 
        title, 
        description: description || '', 
        status: status || 'todo',
        assignee: assignee || null
    };
    proj.tasks.push(task);
    await proj.save();
    const created = proj.tasks[proj.tasks.length - 1];
    return res.json(created);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create task' });
  }
});

// PATCH /api/projects/:projectId/tasks/:taskId - update task (professional: lead+)
router.patch('/:projectId/tasks/:taskId', auth(true), authorize({ min: 'lead', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, assignee } = req.body || {};
    const proj = await Project.findById(projectId);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    const t = proj.tasks.id(taskId);
    if (!t) return res.status(404).json({ message: 'Task not found' });
    if (title !== undefined) t.title = title;
    if (description !== undefined) t.description = description;
    if (status !== undefined) t.status = status;
    if (assignee !== undefined) t.assignee = assignee;
    await proj.save();
    return res.json(t);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to update task' });
  }
});

export default router;