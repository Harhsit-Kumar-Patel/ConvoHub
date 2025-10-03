// server/src/models/Assignment.js
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submittedAt: { type: Date, default: Date.now },
    grade: String,
    feedback: String,
});

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Add this line
    submissions: [submissionSchema],
}, { timestamps: true });

export default mongoose.model('Assignment', AssignmentSchema);