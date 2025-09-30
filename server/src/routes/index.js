import { Router } from 'express';
import noticesRouter from './notices.js';
import authRouter from './auth.js';
import complaintsRouter from './complaints.js';
import cohortsRouter from './cohorts.js';
import messagesRouter from './messages.js';
import usersRouter from './users.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'convohub-server', time: new Date().toISOString() });
});

router.use('/notices', noticesRouter);
router.use('/auth', authRouter);
router.use('/complaints', complaintsRouter);
router.use('/cohorts', cohortsRouter);
router.use('/messages', messagesRouter);
router.use('/users', usersRouter);

export default router;
