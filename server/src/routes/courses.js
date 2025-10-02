import { Router } from 'express';
import Course from '../models/Course.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/courses - list all courses
router.get('/', auth(true), async (req, res) => {
  try {
    const items = await Course.find().lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load courses' });
  }
});

// GET /api/courses/:id - get one course
router.get('/:id', auth(true), async (req, res) => {
  try {
    const item = await Course.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Course not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load course' });
  }
});

export default router;
