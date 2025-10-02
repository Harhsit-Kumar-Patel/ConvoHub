import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Team', TeamSchema);