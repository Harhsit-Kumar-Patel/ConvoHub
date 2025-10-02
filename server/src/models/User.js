import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    // Hierarchical roles across workspaces. Back-compat: include 'admin'.
    // Educational: student < ta < instructor < dept_admin
    // Professional: member < lead < manager < org_admin
    role: {
      type: String,
      enum: [
        'student', 'ta', 'instructor', 'dept_admin',
        'member', 'lead', 'manager', 'org_admin',
        'admin' // legacy superuser
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