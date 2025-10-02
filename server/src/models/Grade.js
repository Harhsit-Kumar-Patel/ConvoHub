import mongoose from 'mongoose';

const GradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  score: { type: String, required: true }, // e.g., "A+", "95/100"
  feedback: String,
}, { timestamps: true });

export default mongoose.model('Grade', GradeSchema);
