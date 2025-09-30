import { Router } from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/users/search?q=term
router.get('/search', auth(true), async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json([]);
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const items = await User.find({ $or: [{ name: re }, { email: re }] })
    .select('name email')
    .limit(20)
    .lean();
  res.json(items);
});

export default router;
