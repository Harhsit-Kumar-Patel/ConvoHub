import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Grade from '../models/Grade.js';

const router = Router();

// GET /api/analytics/department - for coordinators and above
router.get('/department', auth(true), authorize({ min: 'coordinator' }), async (req, res) => {
  try {
    const courses = await Course.find().lean();
    const students = await User.find({ role: 'student' }).lean();
    const grades = await Grade.find().lean();

    // Calculate total students and courses
    const totalCourses = courses.length;
    const totalStudents = students.length;

    // Calculate enrollment per course
    const enrollmentPerCourse = courses.map(course => ({
      _id: course._id,
      name: course.name,
      code: course.code,
      studentCount: course.students.length,
    }));

    // Calculate grade distribution (simple version for letter grades)
    const gradeDistribution = grades.reduce((acc, grade) => {
        const score = String(grade.score).toUpperCase().charAt(0); // A+, A, A- -> A
        if (['A', 'B', 'C', 'D', 'F'].includes(score)) {
            acc[score] = (acc[score] || 0) + 1;
        }
        return acc;
    }, {});

    res.json({
      totalCourses,
      totalStudents,
      totalGrades: grades.length,
      enrollmentPerCourse,
      gradeDistribution,
    });

  } catch (e) {
    console.error('Failed to generate analytics:', e);
    res.status(500).json({ message: 'Failed to generate analytics data' });
  }
});

export default router;