import mongoose from 'mongoose';

// New schema for course materials
const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }, // URL to the file
  fileType: String, // e.g., 'PDF', 'Slides'
});

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  instructor: { type: String },
  description: String,
  syllabus: String, // URL to a PDF or markdown content
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  materials: [materialSchema], // Add this line
}, { timestamps: true });

export default mongoose.model('Course', CourseSchema);