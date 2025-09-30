import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional for anonymous
    body: { type: String, required: true },
    anonymous: { type: Boolean, default: false },
    status: { type: String, enum: ['open', 'review', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', ComplaintSchema);
