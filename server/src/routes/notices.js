import { Router } from 'express';
import Notice from '../models/Notice.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/notices - List notices for educational workspace
router.get('/', auth(true), authorize({ workspaceOnly: 'educational' }), async (req, res) => {
  try {
    const notices = await Notice.find({ workspaceType: 'educational' }).sort({ pinned: -1, createdAt: -1 }).limit(50);
    res.json(notices);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load notices' });
  }
});

// POST /api/notices - Create a new notice for educational workspace
router.post('/', auth(true), authorize({ min: 'instructor', workspaceOnly: 'educational' }), async (req, res) => {
  try {
    const { title, body, pinned } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }

    const newNotice = await Notice.create({
      title,
      body,
      pinned: Boolean(pinned),
      author: req.user.name,
      workspaceType: 'educational',
    });

    const users = await User.find({ workspaceType: 'educational' }).select('_id');
    const notifications = users.map(user => ({
      user: user._id,
      title: `New Notice: ${title}`,
      body,
      type: 'announcement',
      link: '/notices',
    }));
    await Notification.insertMany(notifications);

    const io = req.app.get('io');
    io.of('/chat').emit('notification', {
        title: `New Notice: ${title}`,
        body,
        type: 'announcement',
        link: '/notices'
    });

    res.status(201).json(newNotice);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create notice' });
  }
});

// PUT /api/notices/:id - Update a notice
router.put('/:id', auth(true), authorize({ min: 'instructor', workspaceOnly: 'educational' }), async (req, res) => {
  try {
    const { title, body, pinned } = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, body, pinned },
      { new: true }
    );
    if (!updatedNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(updatedNotice);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update notice' });
  }
});

// DELETE /api/notices/:id - Delete a notice
router.delete('/:id', auth(true), authorize({ min: 'instructor', workspaceOnly: 'educational' }), async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
    if (!deletedNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete notice' });
  }
});

export default router;