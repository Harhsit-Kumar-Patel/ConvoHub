import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
});

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [taskSchema],
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }, // Link to a workspace/company
  },
  { timestamps: true }
);

export default mongoose.model('Project', ProjectSchema);