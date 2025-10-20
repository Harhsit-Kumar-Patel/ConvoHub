import { Router } from 'express';
import Notice from '../models/Notice.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/announcements - List announcements for professional workspace
router.get('/', auth(true), authorize({ workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const announcements = await Notice.find({ workspaceType: 'professional' }).sort({ pinned: -1, createdAt: -1 }).limit(50);
    res.json(announcements);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load announcements' });
  }
});

// POST /api/announcements - Create a new announcement for professional workspace
router.post('/', auth(true), authorize({ min: 'lead', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const { title, body, pinned } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }

    const newAnnouncement = await Notice.create({
      title,
      body,
      pinned: Boolean(pinned),
      author: req.user.name,
      workspaceType: 'professional',
    });

    const users = await User.find({ workspaceType: 'professional' }).select('_id');
    const notifications = users.map(user => ({
      user: user._id,
      title: `New Announcement: ${title}`,
      body,
      type: 'announcement',
      link: '/announcements',
    }));
    await Notification.insertMany(notifications);

    const io = req.app.get('io');
    io.of('/chat').emit('notification', {
        title: `New Announcement: ${title}`,
        body,
        type: 'announcement',
        link: '/announcements'
    });

    res.status(201).json(newAnnouncement);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create announcement' });
  }
});

// PUT /api/announcements/:id - Update an announcement
router.put('/:id', auth(true), authorize({ min: 'lead', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const { title, body, pinned } = req.body;
    const updatedAnnouncement = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, body, pinned },
      { new: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(updatedAnnouncement);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update announcement' });
  }
});

// DELETE /api/announcements/:id - Delete an announcement
router.delete('/:id', auth(true), authorize({ min: 'lead', workspaceOnly: 'professional' }), async (req, res) => {
  try {
    const deletedAnnouncement = await Notice.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
});

export default router;