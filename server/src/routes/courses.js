import { Router } from 'express';
import Course from '../models/Course.js';
import { auth, authorize } from '../middleware/auth.js'; // Import authorize

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

// POST /api/courses - Create a new course (instructor+)
router.post('/', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
  try {
    const { name, code, instructor, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Course name and code are required.' });
    }

    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(409).json({ message: 'A course with this code already exists.' });
    }

    const newCourse = await Course.create({
      name,
      code,
      instructor,
      description,
    });

    res.status(201).json(newCourse);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create course' });
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