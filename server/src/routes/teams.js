import { Router } from 'express';
import Team from '../models/Team.js';
import { auth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = Router();

// GET /api/teams - list teams for the current user
router.get('/', auth(true), async (req, res) => {
  try {
    const items = await Team.find({ members: req.user.id }).sort({ name: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
});

// GET /api/teams/all - list all teams available to join
router.get('/all', auth(true), async (req, res) => {
  try {
    // In a real app, you might want pagination here
    const items = await Team.find().sort({ name: 1 }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch all teams' });
  }
});


// POST /api/teams - create a new team
router.post('/', auth(true), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Team name is required.' });
    }

    const newTeam = await Team.create({
      name,
      description: description || '',
      members: [req.user.id], // Add the creator as the first member
    });

    res.status(201).json(newTeam);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// POST /api/teams/:teamId/join - join a team
router.post('/:teamId/join', auth(true), async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const team = await Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: userId } }, // $addToSet prevents duplicate entries
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ message: 'Successfully joined team!', team });
  } catch (e) {
    res.status(500).json({ message: 'Failed to join team' });
  }
});

export default router;