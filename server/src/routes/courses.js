import { Router } from 'express';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js'; // Import Assignment
import Grade from '../models/Grade.js'; // Import Grade
import User from '../models/User.js'; // Import User
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/courses - list all courses
router.get('/', auth(true), async (req, res) => {
  try {
    const items = await Course.find().lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load courses' });
  }
});

// POST /api/courses - Create a new course (instructor+)
router.post('/', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
  try {
    const { name, code, instructor, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Course name and code are required.' });
    }

    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(409).json({ message: 'A course with this code already exists.' });
    }

    const newCourse = await Course.create({
      name,
      code,
      instructor,
      description,
    });

    res.status(201).json(newCourse);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create course' });
  }
});

// GET /api/courses/:id - get one course
router.get('/:id', auth(true), async (req, res) => {
  try {
    const item = await Course.findById(req.params.id).populate('students', 'name email').lean();
    if (!item) return res.status(404).json({ message: 'Course not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load course' });
  }
});

// --- NEW ---
// PUT /api/courses/:id - Update a course (instructor+)
router.put('/:id', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
  try {
    const { name, code, instructor, description } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code, instructor, description },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update course' });
  }
});

// --- NEW ---
// POST /api/courses/:id/enroll - Enroll a student (instructor+)
router.post('/:id/enroll', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
    try {
        const { studentId } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (course.students.includes(studentId)) {
            return res.status(409).json({ message: 'Student already enrolled' });
        }

        course.students.push(studentId);
        await course.save();
        res.status(200).json(course);
    } catch (e) {
        res.status(500).json({ message: 'Failed to enroll student' });
    }
});

// --- NEW ---
// DELETE /api/courses/:id/students/:studentId - Remove a student from a course (instructor+)
router.delete('/:id/students/:studentId', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.students.pull(req.params.studentId);
        await course.save();
        res.status(200).json(course);
    } catch (e) {
        res.status(500).json({ message: 'Failed to remove student' });
    }
});


// GET /api/courses/:id/gradebook - Get structured data for a course gradebook
router.get('/:id/gradebook', auth(true), authorize({ min: 'instructor' }), async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get all assignments for the course to create our columns
    const assignments = await Assignment.find({ course: id }).select('_id title').lean();

    // 2. Get all students enrolled in the course
    const course = await Course.findById(id).populate('students', '_id name').lean();
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const students = course.students;

    // 3. Get all grades for this course
    const grades = await Grade.find({ course: id }).lean();

    // 4. Structure the data
    const gradebookData = students.map(student => {
      const studentGrades = {};
      assignments.forEach(assignment => {
        const grade = grades.find(g => 
          g.student.toString() === student._id.toString() && 
          g.assignment.toString() === assignment._id.toString()
        );
        studentGrades[assignment._id] = grade ? grade.score : 'N/A';
      });
      return {
        studentId: student._id,
        studentName: student.name,
        grades: studentGrades,
      };
    });

    res.json({
      assignments, // The columns
      gradebook: gradebookData, // The rows
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to build gradebook data' });
  }
});

export default router;