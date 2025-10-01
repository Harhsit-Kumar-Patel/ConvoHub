import { Router } from 'express';
import Assignment from '../models/Assignment.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/assignments - List all assignments
router.get('/', auth(true), async (req, res) => {
  try {
    const items = await Assignment.find().sort({ dueDate: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load assignments' });
  }
});

// ADD THIS NEW ROUTE
// GET /api/assignments/:id - Get a single assignment by ID
router.get('/:id', auth(true), async (req, res) => {
  try {
    const item = await Assignment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load assignment' });
  }
});

export default router;