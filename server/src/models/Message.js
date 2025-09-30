import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toCohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Message', MessageSchema);
