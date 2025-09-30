import mongoose from 'mongoose';
import { connectDB } from '../src/db.js';
import User from '../src/models/User.js';
import Notice from '../src/models/Notice.js';
import Cohort from '../src/models/Cohort.js';
import Message from '../src/models/Message.js';
import Complaint from '../src/models/Complaint.js';
import { users, cohorts, notices } from './data.js';

async function run() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Notice.deleteMany({}),
    Cohort.deleteMany({}),
    Message.deleteMany({}),
    Complaint.deleteMany({}),
  ]);

  const [userDocs, cohortDocs] = await Promise.all([
    User.insertMany(users),
    Cohort.insertMany(cohorts),
  ]);
  await Notice.insertMany(notices);

  // Sample messages
  await Message.create({ from: userDocs[1]._id, toCohort: cohortDocs[0]._id, body: 'Hello Alpha cohort!' });

  console.log('Seed completed');
  await mongoose.connection.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
