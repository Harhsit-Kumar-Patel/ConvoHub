import { Router } from 'express';
import Grade from '../models/Grade.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/grades/me - all grades for current authenticated user (students)
router.get('/me', auth(), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const items = await Grade.find({ student: userId })
      .populate('assignment', 'title')
      .populate('course', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load grades' });
  }
});

// --- CORRECTED ---
// GET /api/grades/all - Get all grades for admin view (Instructor+)
router.get('/all', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
    try {
        const items = await Grade.find()
            .populate('student', 'name')
            .populate('assignment', 'title')
            .populate('course', 'name')
            .sort({ createdAt: -1 })
            .lean();
        res.json(items);
    } catch (e) {
        res.status(500).json({ message: 'Failed to load all grades' });
    }
});

export default router;