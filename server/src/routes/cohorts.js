import { Router } from 'express';
import Cohort from '../models/Cohort.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/cohorts - list cohorts
router.get('/', auth(true), async (req, res) => {
  const items = await Cohort.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

export default router;
