import mongoose from 'mongoose';
import { connectDB } from '../src/db.js';
import User from '../src/models/User.js';
import Notice from '../src/models/Notice.js';
import Cohort from '../src/models/Cohort.js';
import Message from '../src/models/Message.js';
import Complaint from '../src/models/Complaint.js';
import Assignment from '../src/models/Assignment.js'; // Import new model
import Project from '../src/models/Project.js';     // Import new model
import { users, cohorts, notices, assignments, projects } from './data.js'; // Import new data

async function run() {
  await connectDB();
  console.log('Clearing database...');
  await Promise.all([
    User.deleteMany({}),
    Notice.deleteMany({}),
    Cohort.deleteMany({}),
    Message.deleteMany({}),
    Complaint.deleteMany({}),
    Assignment.deleteMany({}), // Clear old assignments
    Project.deleteMany({}),    // Clear old projects
  ]);

  console.log('Seeding data...');
  const [userDocs, cohortDocs] = await Promise.all([
    User.insertMany(users),
    Cohort.insertMany(cohorts),
  ]);
  await Notice.insertMany(notices);
  await Assignment.insertMany(assignments); // Seed assignments
  await Project.insertMany(projects);       // Seed projects

  // Sample messages
  await Message.create({ from: userDocs[1]._id, toCohort: cohortDocs[0]._id, body: 'Hello Alpha cohort!' });

  console.log('Seed completed successfully!');
  await mongoose.connection.close();
}

run().catch((e) => {
  console.error('Seed script failed:', e);
  process.exit(1);
});