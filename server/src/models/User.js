import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: [
        'student', 'ta', 'instructor', 'coordinator', 'principal',
        'member', 'lead', 'manager', 'org_admin',
        'admin'
      ],
      default: 'student'
    },
    workspaceType: { type: String, enum: ['educational', 'professional'], required: true },
    skills: [{ type: String }],
    program: { type: String },
    batch: { type: String },
    links: {
      github: String,
      linkedin: String,
      website: String,
    },
    avatarUrl: String,
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);