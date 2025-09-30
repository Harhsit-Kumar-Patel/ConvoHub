import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notice', NoticeSchema);
