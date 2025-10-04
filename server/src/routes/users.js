import { Router } from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// A helper to check for admin privileges in either workspace
const hasAdminPrivileges = (user) => {
    if (!user) return false;
    const { role, workspaceType } = user;
    if (role === 'admin') return true;
    if (workspaceType === 'educational' && ['principal', 'admin'].includes(role)) return true;
    if (workspaceType === 'professional' && ['org_admin', 'admin'].includes(role)) return true;
    return false;
};

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

// GET /api/users/manage - Get all users for management
router.get('/manage', auth(true), async (req, res) => {
  if (!hasAdminPrivileges(req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const users = await User.find().select('-passwordHash').sort({ name: 1 }).lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// PUT /api/users/manage/:id - Update a user's role/details
router.put('/manage/:id', auth(true), async (req, res) => {
  if (!hasAdminPrivileges(req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const { name, email, role } = req.body;
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

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
    
    const updatedUser = userToUpdate.toObject();
    delete updatedUser.passwordHash;

    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE /api/users/manage/:id - Delete a user
router.delete('/manage/:id', auth(true), async (req, res) => {
  if (!hasAdminPrivileges(req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

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