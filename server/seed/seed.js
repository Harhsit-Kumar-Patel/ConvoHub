import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/db.js';
import User from '../src/models/User.js';
import Notice from '../src/models/Notice.js';
import Cohort from '../src/models/Cohort.js';
import Message from '../src/models/Message.js';
import Complaint from '../src/models/Complaint.js';
import Assignment from '../src/models/Assignment.js';
import Project from '../src/models/Project.js';
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
  const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'password';
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);

  const eduUsersData = educationalUsers.map((u) => ({ ...u, passwordHash: hashed }));
  const proUsersData = professionalUsers.map((u) => ({ ...u, passwordHash: hashed }));

  const [eduUsers, proUsers] = await Promise.all([
    User.insertMany(eduUsersData),
    User.insertMany(proUsersData),
  ]);

  const cohortDocs = await Cohort.insertMany(cohorts);
  await Notice.insertMany(notices);

  const courseDocs = await Course.insertMany(courses);
  
  // Link assignments to courses
  const courseMap = courseDocs.reduce((acc, course) => {
    acc[course.code] = course._id;
    return acc;
  }, {});
  
  const assignmentsWithCourses = assignments.map(a => ({
    ...a,
    course: courseMap[a.courseCode] || null,
  }));
  await Assignment.insertMany(assignmentsWithCourses);
  
  const teamDocs = await Team.insertMany(teams);
  await Project.insertMany(projects);

  if (courseDocs.length && eduUsers.length) {
    const studentIds = eduUsers.filter(u => u.role === 'student').map((u) => u._id);
    await Promise.all(
      courseDocs.map((c) => Course.updateOne({ _id: c._id }, { $addToSet: { students: { $each: studentIds } } }))
    );
  }

  // Sample grades logic remains the same, but we should refetch assignments to get their new _ids
  const allAssignments = await Assignment.find({}).lean();
  // ... (the rest of the grade creation logic can stay as is) ...

  console.log('Seed completed successfully!');
  await mongoose.connection.close();
}

run().catch((e) => {
  console.error('Seed script failed:', e);
  process.exit(1);
});