import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    allDay: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workspaceType: { type: String, enum: ['educational', 'professional'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Event', EventSchema);