import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/db.js';
import User from '../src/models/User.js';
import Notice from '../src/models/Notice.js';
import Cohort from '../src/models/Cohort.js';
import Assignment from '../src/models/Assignment.js';
import Project from '../src/models/Project.js';
import Team from '../src/models/Team.js';
import Course from '../src/models/Course.js';
import { assignments, cohorts, courses, educationalUsers, notices, professionalUsers, projects, teams } from './data.js';

async function insertIfEmpty(Model, docs) {
  const count = await Model.countDocuments();
  if (count > 0) return false;
  await Model.insertMany(docs);
  return true;
}

async function run() {
  await connectDB();

  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log(`Database already has ${userCount} user(s); skipping initial seed.`);
    await mongoose.connection.close();
    return;
  }

  console.log('Seeding initial demo data...');
  const demoPassword = process.env.DEMO_PASSWORD || 'password';
  const passwordHash = await bcrypt.hash(demoPassword, 10);
  const users = [...educationalUsers, ...professionalUsers].map((user) => ({
    ...user,
    passwordHash,
  }));

  await User.insertMany(users);
  await insertIfEmpty(Cohort, cohorts);
  await insertIfEmpty(Notice, notices);

  let courseDocs = await Course.find({}).lean();
  if (courseDocs.length === 0) {
    courseDocs = await Course.insertMany(courses);
  }

  const courseMap = courseDocs.reduce((acc, course) => {
    acc[course.code] = course._id;
    return acc;
  }, {});

  await insertIfEmpty(Assignment, assignments.map((assignment) => ({
    ...assignment,
    course: courseMap[assignment.courseCode] || null,
  })));
  await insertIfEmpty(Team, teams);
  await insertIfEmpty(Project, projects);

  if (courseDocs.length) {
    const studentIds = users
      .filter((user) => user.workspaceType === 'educational' && user.role === 'student')
      .map((user) => user._id);
    await Promise.all(
      courseDocs.map((course) => (
        Course.updateOne({ _id: course._id }, { $addToSet: { students: { $each: studentIds } } })
      ))
    );
  }

  console.log('Initial seed completed. Demo password:', demoPassword);
  await mongoose.connection.close();
}

run().catch((error) => {
  console.error('Initial seed failed:', error);
  process.exit(1);
});
