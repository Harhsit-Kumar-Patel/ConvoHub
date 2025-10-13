import { Router } from 'express';
import noticesRouter from './notices.js';
import authRouter from './auth.js';
import complaintsRouter from './complaints.js';
import cohortsRouter from './cohorts.js';
import messagesRouter from './messages.js';
import usersRouter from './users.js';
import assignmentsRouter from './assignments.js';
import projectsRouter from './projects.js';
import teamsRouter from './teams.js';
import coursesRouter from './courses.js';
import gradesRouter from './grades.js';
import analyticsRouter from './analytics.js';
import notificationsRouter from './notifications.js';
import calendarRouter from './calendar.js';
import searchRouter from './search.js'; // --- NEW ---

const router = Router();

router.use('/notices', noticesRouter);
router.use('/auth', authRouter);
router.use('/complaints', complaintsRouter);
router.use('/cohorts', cohortsRouter);
router.use('/messages', messagesRouter);
router.use('/users', usersRouter);
router.use('/assignments', assignmentsRouter);
router.use('/projects', projectsRouter);
router.use('/teams', teamsRouter);
router.use('/courses', coursesRouter);
router.use('/grades', gradesRouter);
router.use('/analytics', analyticsRouter);
router.use('/notifications', notificationsRouter);
router.use('/calendar', calendarRouter);
router.use('/search', searchRouter); // --- NEW ---

export default router;