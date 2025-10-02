import { Router } from 'express';
import Complaint from '../models/Complaint.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// Create a complaint (optionally anonymous)
router.post('/', auth(true), async (req, res) => {
  try {
    const { body, anonymous } = req.body || {};
    if (!body || typeof body !== 'string' || body.trim().length < 5) {
      return res.status(400).json({ message: 'Please provide a valid complaint (min 5 chars)' });
    }
    const doc = await Complaint.create({
      user: anonymous ? undefined : req.user.id,
      body: body.trim(),
      anonymous: Boolean(anonymous),
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: 'Failed to submit complaint' });
  }
});

// Get complaints for current user (non-anonymous only)
router.get('/me', auth(true), async (req, res) => {
  try {
    const items = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load complaints' });
  }
});

// Get all complaints (educational: coordinator+)
router.get('/all', auth(true), authorize({ min: 'coordinator', workspaceOnly: 'educational' }), async (req, res) => {
  try {
    const items = await Complaint.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load complaints' });
  }
});

// GET all complaints (for coordinators and above)
router.get('/all', auth(true), authorize({ min: 'coordinator', workspaceOnly: 'educational' }), async (req, res) => {
  try {
    const items = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load complaints' });
  }
});

export default router;