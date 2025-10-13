import { Router } from 'express';
import Assignment from '../models/Assignment.js';
import Event from '../models/Event.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/calendar/items - Get all items for the calendar view
router.get('/items', auth(true), async (req, res) => {
  try {
    const { workspaceType } = req.user;

    // Fetch assignments
    const assignments = await Assignment.find({}).lean();
    const assignmentEvents = assignments.map(a => ({
      _id: a._id,
      title: `(Due) ${a.title}`,
      start: a.dueDate,
      end: a.dueDate,
      allDay: true, // Treat due dates as all-day events on the calendar
      type: 'assignment',
      link: `/assignments/${a._id}`,
    }));

    // Fetch custom events for the user's workspace
    const customEvents = await Event.find({ workspaceType }).lean();
    const formattedCustomEvents = customEvents.map(e => ({
        ...e,
        type: 'event'
    }));

    res.json([...assignmentEvents, ...formattedCustomEvents]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch calendar items' });
  }
});

// POST /api/calendar/events - Create a new custom event
router.post('/events', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
    try {
        const { title, start, end, allDay } = req.body;
        if (!title || !start || !end) {
            return res.status(400).json({ message: 'Title, start, and end dates are required.' });
        }

        const newEvent = await Event.create({
            title,
            start: new Date(start),
            end: new Date(end),
            allDay: !!allDay,
            createdBy: req.user.id,
            workspaceType: req.user.workspaceType,
        });

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create event' });
    }
});

export default router;