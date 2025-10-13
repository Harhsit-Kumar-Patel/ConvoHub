import { Router } from 'express';
import Notice from '../models/Notice.js';
import User from '../models/User.js'; // --- NEW ---
import Notification from '../models/Notification.js'; // --- NEW ---
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/notices - List notices
router.get('/', auth(true), async (req, res) => { // Add auth() to allow token usage
  try {
    const notices = await Notice.find().sort({ pinned: -1, createdAt: -1 }).limit(50);
    res.json(notices);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load notices' });
  }
});

// POST /api/notices - Create a new notice (instructor+)
router.post('/', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
  try {
    const { title, body, pinned } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }

    const newNotice = await Notice.create({
      title,
      body,
      pinned: Boolean(pinned),
      author: req.user.name, // Use the logged-in user's name as the author
    });

    // --- NEW: Create and emit notifications for all users ---
    const users = await User.find({}).select('_id');
    const notifications = users.map(user => ({
      user: user._id,
      title: `New Announcement: ${title}`,
      body,
      type: 'announcement',
      link: '/notices',
    }));
    await Notification.insertMany(notifications);

    const io = req.app.get('io');
    io.of('/chat').emit('notification', {
        title: `New Announcement: ${title}`,
        body,
        type: 'announcement',
        link: '/notices'
    });
    // --- END NEW ---

    res.status(201).json(newNotice);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create notice' });
  }
});

export default router;