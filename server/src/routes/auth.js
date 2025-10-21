import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { JWT_SECRET } from '../config.js';
import { validateRegister, validateLogin, validate } from '../validators/auth.js';
import logger from '../logger.js';

const router = Router();

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// POST /api/auth/register
router.post('/register', authLimiter, validateRegister, validate, async (req, res) => {
  try {
    const { name, email, password, workspaceType, role } = req.body;
    if (!name || !email || !password || !workspaceType) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Hierarchical defaults by workspace
    const defaultRole = String(workspaceType) === 'professional' ? 'member' : 'student';
    // Validate requested role against allowed enums
    const allowedRoles = [
      'student', 'ta', 'instructor', 'dept_admin',
      'member', 'lead', 'manager', 'org_admin',
      'admin'
    ];
    let roleToUse = defaultRole;
    if (role && allowedRoles.includes(role)) {
      roleToUse = role;
    }
    const user = await User.create({ name, email, passwordHash, role: roleToUse, workspaceType });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, workspaceType: user.workspaceType }, JWT_SECRET, { expiresIn: '7d' });
    
    logger.info('User registered', { userId: user._id, email: user.email });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, workspaceType: user.workspaceType },
    });
  } catch (err) {
    logger.error('Registration error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, workspaceType: user.workspaceType }, JWT_SECRET, { expiresIn: '7d' });
    
    logger.info('User logged in', { userId: user._id, email: user.email });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, workspaceType: user.workspaceType },
    });
  } catch (err) {
    logger.error('Login error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;