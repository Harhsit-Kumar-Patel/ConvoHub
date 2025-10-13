import { Router } from 'express';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import Grade from '../models/Grade.js'; // Import the Grade model
import { auth, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import Notification from '../models/Notification.js'; // --- NEW ---

const router = Router();

// --- Existing Routes (No changes needed here) ---

// GET /api/assignments/me - List assignments for the current user's courses
router.get('/me', auth(true), async (req, res) => {
  try {
    const userCourses = await Course.find({ students: req.user.id }).select('_id').lean();
    const courseIds = userCourses.map((course) => course._id);
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

// POST /api/assignments/:id/submissions - create or replace current user's submission
router.post('/:id/submissions', auth(), upload, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body || {};
    const doc = await Assignment.findById(id);
    if (!doc) return res.status(404).json({ message: 'Assignment not found' });

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

// --- NEW GRADING ROUTES ---

// GET /api/assignments/:id/submissions - Get all submissions for an assignment (instructor+)
router.get('/:id/submissions', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', 'name email')
      .lean();
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment.submissions || []);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load submissions' });
  }
});

// POST /api/assignments/:assignmentId/submissions/:submissionId/grade - Grade a submission (instructor+)
router.post(
  '/:assignmentId/submissions/:submissionId/grade',
  auth(true),
  authorize({ min: 'instructor' }),
  async (req, res) => {
    try {
      const { assignmentId, submissionId } = req.params;
      const { grade, feedback } = req.body;

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

      const submission = assignment.submissions.id(submissionId);
      if (!submission) return res.status(404).json({ message: 'Submission not found' });

      // Update the submission sub-document
      submission.grade = grade;
      submission.feedback = feedback;
      await assignment.save();

      // Create or update the master Grade document
      // This is useful for the student's "My Grades" page
      await Grade.findOneAndUpdate(
        { student: submission.student, assignment: assignmentId },
        {
          student: submission.student,
          assignment: assignmentId,
          course: assignment.course,
          score: grade,
          feedback: feedback,
        },
        { upsert: true, new: true }
      );

      // --- NEW: Create and emit notification for graded assignment ---
      const notification = await Notification.create({
        user: submission.student,
        title: `Graded: ${assignment.title}`,
        body: `You received a grade of ${grade}.`,
        type: 'grade',
        link: `/assignments/${assignmentId}`,
      });
      const io = req.app.get('io');
      io.of('/chat').to(`user:${submission.student}`).emit('notification', notification);
      // --- END NEW ---

      res.json(submission);
    } catch (e) {
      console.error('Grading error:', e);
      res.status(500).json({ message: 'Failed to save grade' });
    }
  }
);

export default router;