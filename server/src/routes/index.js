import { Router } from 'express';
import noticesRouter from './notices.js';
import authRouter from './auth.js';
import complaintsRouter from './complaints.js';
import cohortsRouter from './cohorts.js';
import messagesRouter from './messages.js';
import usersRouter from './users.js';
import assignmentsRouter from './assignments.js';
import projectsRouter from './projects.js';
import teamsRouter from './teams.js'; // Add this line

const router = Router();

// ... (health check route)

router.use('/notices', noticesRouter);
router.use('/auth', authRouter);
router.use('/complaints', complaintsRouter);
router.use('/cohorts', cohortsRouter);
router.use('/messages', messagesRouter);
router.use('/users', usersRouter);
router.use('/assignments', assignmentsRouter);
router.use('/projects', projectsRouter);
router.use('/teams', teamsRouter); // Add this line

export default router;