import { Router } from 'express';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js'; // Import Course model
import { auth, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js'; // Import the upload middleware

const router = Router();

// GET /api/assignments/me - List assignments for the current user's courses
router.get('/me', auth(true), async (req, res) => {
  try {
    // Find courses the current user is enrolled in
    const userCourses = await Course.find({ students: req.user.id }).select('_id').lean();
    const courseIds = userCourses.map((course) => course._id);

    // Find assignments for those courses
    const items = await Assignment.find({ course: { $in: courseIds } }).sort({ dueDate: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load your assignments' });
  }
});

// GET /api/assignments - List all assignments
router.get('/', auth(true), async (req, res) => {
  try {
    const items = await Assignment.find().sort({ dueDate: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load assignments' });
  }
});

// POST /api/assignments - Create a new assignment (educational: instructor+)
router.post('/', auth(true), authorize({ min: 'instructor', workspaceOnly: 'educational' }), async (req, res) => {
  try {
    const { title, description, dueDate } = req.body || {};
    if (!title || !dueDate) return res.status(400).json({ message: 'title and dueDate are required' });
    const doc = await Assignment.create({
      title: String(title).trim(),
      description: description || '',
      dueDate: new Date(dueDate),
    });
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create assignment' });
  }
});

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

// Submission endpoints
// POST /api/assignments/:id/submissions - create or replace current user's submission
router.post('/:id/submissions', auth(), upload, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body || {};
    const doc = await Assignment.findById(id);
    if (!doc) return res.status(404).json({ message: 'Assignment not found' });

    // Remove existing submission by user if exists, then push new one
    doc.submissions = (doc.submissions || []).filter((s) => String(s.student) !== String(userId));

    const newSubmission = {
      student: userId,
      submittedAt: new Date(),
      feedback: '',
      grade: '',
      comment,
      files: req.files.map((file) => ({
        filename: file.filename,
        path: file.path,
        originalName: file.originalname,
      })),
    };

    doc.submissions.push(newSubmission);
    await doc.save();
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to submit assignment' });
  }
});

// GET /api/assignments/:id/submissions/me - get current user's submission
router.get('/:id/submissions/me', auth(), async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const doc = await Assignment.findById(id).lean();
    if (!doc) return res.status(404).json({ message: 'Assignment not found' });
    const mine = (doc.submissions || []).find((s) => String(s.student) === String(userId));
    return res.json(mine || null);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load submission' });
  }
});

export default router;