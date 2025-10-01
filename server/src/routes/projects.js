import { Router } from 'express';
import Project from '../models/Project.js';
import { auth } from '../middleware/auth.js';

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

export default router;