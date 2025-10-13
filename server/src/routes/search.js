import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import Project from '../models/Project.js';
import Notice from '../models/Notice.js';

const router = Router();

// GET /api/search/global?q=...
router.get('/global', auth(true), async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.json({
        users: [],
        courses: [],
        assignments: [],
        projects: [],
        notices: [],
      });
    }

    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const limit = 5; // Limit results per category

    // Perform searches in parallel
    const [users, courses, assignments, projects, notices] = await Promise.all([
      User.find({ $or: [{ name: re }, { email: re }] }).select('name email workspaceType').limit(limit).lean(),
      Course.find({ $or: [{ name: re }, { code: re }] }).select('name code').limit(limit).lean(),
      Assignment.find({ $or: [{ title: re }, { description: re }] }).select('title').limit(limit).lean(),
      Project.find({ $or: [{ name: re }, { description: re }] }).select('name').limit(limit).lean(),
      Notice.find({ $or: [{ title: re }, { body: re }] }).select('title').limit(limit).lean(),
    ]);

    res.json({ users, courses, assignments, projects, notices });

  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ message: 'Failed to perform search' });
  }
});

export default router;