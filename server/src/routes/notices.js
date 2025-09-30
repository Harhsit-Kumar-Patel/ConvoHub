import { Router } from 'express';
import Notice from '../models/Notice.js';

const router = Router();

// List notices
router.get('/', async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 }).limit(50);
  res.json(notices);
});

export default router;
