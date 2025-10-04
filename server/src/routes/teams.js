import { Router } from 'express';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import { auth, authorize } from '../middleware/auth.js';
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

// GET /api/teams/:teamId/performance - Get performance metrics for a team
router.get('/:teamId/performance', auth(true), authorize({ min: 'lead', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId).populate('members', 'name').lean();

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const memberIds = team.members.map(m => m._id);

    const taskStats = await Project.aggregate([
      { $unwind: '$tasks' },
      { $match: { 'tasks.assignee': { $in: memberIds } } },
      {
        $group: {
          _id: {
            assigneeId: '$tasks.assignee',
            status: '$tasks.status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.assigneeId',
          tasksByStatus: {
            $push: {
              status: '$_id.status',
              count: '$count',
            },
          },
        },
      },
    ]);

    const performanceData = team.members.map(member => {
      const stats = taskStats.find(stat => stat._id.equals(member._id));
      const taskCounts = {
        todo: 0,
        'in-progress': 0,
        done: 0,
      };

      if (stats) {
        stats.tasksByStatus.forEach(item => {
          if (taskCounts.hasOwnProperty(item.status)) {
            taskCounts[item.status] = item.count;
          }
        });
      }
      
      const totalTasks = taskCounts.todo + taskCounts['in-progress'] + taskCounts.done;

      return {
        memberId: member._id,
        memberName: member.name,
        taskCounts,
        totalTasks,
      };
    });

    res.json(performanceData);
  } catch (e) {
    console.error('Failed to get team performance', e);
    res.status(500).json({ message: 'Failed to retrieve team performance data' });
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