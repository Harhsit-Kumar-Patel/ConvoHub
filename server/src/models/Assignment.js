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
    cohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' },
    submissions: [submissionSchema],
}, { timestamps: true });

export default mongoose.model('Assignment', AssignmentSchema);