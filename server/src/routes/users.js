import { Router } from 'express';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/users/search?q=term
router.get('/search', auth(true), async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json([]);
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const items = await User.find({ $or: [{ name: re }, { email: re }] })
    .select('name email role skills')
    .limit(20)
    .lean();
  res.json(items);
});

// --- NEW ---
// GET /api/users/manage - Get all users for management (Principal+)
router.get('/manage', auth(true), authorize({ min: 'principal' }), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ name: 1 }).lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// --- NEW ---
// PUT /api/users/manage/:id - Update a user's role/details (Principal+)
router.put('/manage/:id', auth(true), authorize({ min: 'principal' }), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent a principal from demoting the only admin
    if (userToUpdate.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove the last administrator.' });
      }
    }

    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.role = role || userToUpdate.role;
    
    await userToUpdate.save();
    
    // Return user without password hash
    const updatedUser = userToUpdate.toObject();
    delete updatedUser.passwordHash;

    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// --- NEW ---
// DELETE /api/users/manage/:id - Delete a user (Principal+)
router.delete('/manage/:id', auth(true), authorize({ min: 'principal' }), async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-deletion and deletion of admins
    if (userToDelete._id.toString() === req.user.id) {
        return res.status(400).json({ message: 'You cannot delete your own account.' });
    }
    if (userToDelete.role === 'admin') {
      return res.status(403).json({ message: 'Administrators cannot be deleted.' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});


export default router;