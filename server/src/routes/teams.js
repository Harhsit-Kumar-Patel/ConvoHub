import { Router } from 'express';
import Team from '../models/Team.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/teams - list teams for the current user
router.get('/', auth(true), async (req, res) => {
  const items = await Team.find({ members: req.user.id }).sort({ name: 1 });
  res.json(items);
});

export default router;