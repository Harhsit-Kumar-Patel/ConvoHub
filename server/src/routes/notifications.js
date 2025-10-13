import { Router } from 'express';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/notifications - Get notifications for the current user
router.get('/', auth(true), async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// POST /api/notifications/mark-read - Mark all notifications as read
router.post('/mark-read', auth(true), async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
});

export default router;