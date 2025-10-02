import { Router } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/messages?cohortId=... | toUser=... | teamId=...
router.get('/', auth(true), async (req, res) => {
  try {
    const { cohortId, toUser, teamId, limit = 50 } = req.query; // Add teamId
    const q = {};
    if (cohortId) q.toCohort = new mongoose.Types.ObjectId(cohortId);
    if (teamId) q.toTeam = new mongoose.Types.ObjectId(teamId); // Add this line
    if (toUser) q.$or = [
      { from: new mongoose.Types.ObjectId(String(req.user.id)), toUser: new mongoose.Types.ObjectId(String(toUser)) },
      { from: new mongoose.Types.ObjectId(String(toUser)), toUser: new mongoose.Types.ObjectId(String(req.user.id)) },
    ];
    const items = await Message.find(q)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 50, 200))
      .populate('from', 'name')
      .lean();
    res.json(items.reverse());
  } catch (e) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

// POST /api/messages  { body, cohortId?, toUser?, teamId? }
router.post('/', auth(true), async (req, res) => {
  try {
    const { body, cohortId, toUser, teamId } = req.body || {}; // Add teamId
    if (!body || (!cohortId && !toUser && !teamId)) return res.status(400).json({ message: 'Invalid payload' }); // Add teamId check

    const doc = await Message.create({
      from: req.user.id,
      toCohort: cohortId || undefined,
      toUser: toUser || undefined,
      toTeam: teamId || undefined, // Add this line
      body: String(body),
    });

    // Emit via socket
    const io = req.app.get('io');
    const populatedDoc = await doc.populate('from', 'name');

    if (cohortId) {
      io.of('/chat').to(`cohort:${cohortId}`).emit('cohortMessage', {
        message: populatedDoc,
        cohortId,
      });
    }
    if (teamId) { // Add this block
      io.of('/chat').to(`team:${teamId}`).emit('teamMessage', {
        message: populatedDoc,
        teamId,
      });
    }
    if (toUser) {
      io.of('/chat').to(`user:${toUser}`).emit('directMessage', {
        message: populatedDoc,
      });
      // echo to sender thread as well
      io.of('/chat').to(`user:${req.user.id}`).emit('directMessage', {
        message: populatedDoc,
      });
    }

    res.status(201).json(populatedDoc);
  } catch (e) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});


// Recent DM threads for the authenticated user
router.get('/recent-threads', auth(true), async (req, res) => {
  try {
    const me = new mongoose.Types.ObjectId(String(req.user.id));
    const pipeline = [
      { $match: { toUser: { $exists: true, $ne: null }, $or: [{ from: me }, { toUser: me }] } },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          otherUser: {
            $cond: [{ $eq: ['$from', me] }, '$toUser', '$from']
          }
        }
      },
      {
        $group: {
          _id: '$otherUser',
          lastMessage: { $first: '$body' },
          lastAt: { $first: '$createdAt' },
        }
      },
      { $sort: { lastAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          user: { _id: '$user._id', name: '$user.name', email: '$user.email' },
          lastMessage: 1,
          lastAt: 1,
        }
      }
    ];
    const items = await Message.aggregate(pipeline);
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load recent threads' });
  }
});


export default router;