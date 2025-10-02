import { Router } from 'express';
import Grade from '../models/Grade.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/grades/me - all grades for current authenticated user
router.get('/me', auth(), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const items = await Grade.find({ student: userId })
      .populate('assignment')
      .populate('course')
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load grades' });
  }
});

export default router;
