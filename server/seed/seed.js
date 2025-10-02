import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/db.js';
import User from '../src/models/User.js';
import Notice from '../src/models/Notice.js';
import Cohort from '../src/models/Cohort.js';
import Message from '../src/models/Message.js';
import Complaint from '../src/models/Complaint.js';
import Assignment from '../src/models/Assignment.js'; // Import new model
import Project from '../src/models/Project.js';     // Import new model
import Team from '../src/models/Team.js';
import Course from '../src/models/Course.js';
import Grade from '../src/models/Grade.js';
import { educationalUsers, professionalUsers, cohorts, notices, assignments, projects, courses, teams } from './data.js';

async function run() {
  await connectDB();
  console.log('Clearing database...');
  await Promise.all([
    User.deleteMany({}),
    Notice.deleteMany({}),
    Cohort.deleteMany({}),
    Message.deleteMany({}),
    Complaint.deleteMany({}),
    Assignment.deleteMany({}),
    Project.deleteMany({}),
    Team.deleteMany({}),
    Course.deleteMany({}),
    Grade.deleteMany({}),
  ]);

  console.log('Seeding data...');
  // Users
  // Use a single known demo password for all seeded users, configurable via env.
  const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'password';
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);

  const eduUsersData = educationalUsers.map((u) => ({ ...u, passwordHash: hashed }));
  const proUsersData = professionalUsers.map((u) => ({ ...u, passwordHash: hashed }));

  const [eduUsers, proUsers] = await Promise.all([
    User.insertMany(eduUsersData),
    User.insertMany(proUsersData),
  ]);

  // Cohorts and notices (educational)
  const cohortDocs = await Cohort.insertMany(cohorts);
  await Notice.insertMany(notices);

  // Courses and Assignments
  const courseDocs = await Course.insertMany(courses);
  await Assignment.insertMany(assignments);

  // Teams and Projects (professional)
  const teamDocs = await Team.insertMany(teams);
  await Project.insertMany(projects);

  // Enroll all educational users into all courses for demo richness
  if (courseDocs.length && eduUsers.length) {
    const courseIds = courseDocs.map((c) => c._id);
    // Update each course with all student IDs (capped to 20 to avoid huge docs)
    const studentIds = eduUsers.slice(0, 20).map((u) => u._id);
    await Promise.all(
      courseDocs.map((c) => Course.updateOne({ _id: c._id }, { $addToSet: { students: { $each: studentIds } } }))
    );
  }

  // Create sample grades for first few users across assignments and first course
  const allAssignments = await Assignment.find({}).lean();
  const firstCourse = courseDocs[0];
  const gradeScale = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C'];
  if (allAssignments.length && firstCourse && eduUsers.length) {
    const toGradeUsers = eduUsers.slice(0, Math.min(10, eduUsers.length));
    const gradeDocs = [];
    for (const u of toGradeUsers) {
      for (const a of allAssignments) {
        const score = gradeScale[Math.floor(Math.random() * gradeScale.length)];
        gradeDocs.push({ student: u._id, assignment: a._id, course: firstCourse._id, score, feedback: 'Well done.' });
      }
    }
    if (gradeDocs.length) await Grade.insertMany(gradeDocs);
  }

  // Sample messages
  if (eduUsers.length && cohortDocs.length) {
    await Message.create({ from: eduUsers[0]._id, toCohort: cohortDocs[0]._id, body: 'Hello CS 2025 cohort!' });
  }

  console.log('Seed completed successfully!');
  await mongoose.connection.close();
}

run().catch((e) => {
  console.error('Seed script failed:', e);
  process.exit(1);
});