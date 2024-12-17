import mongoose from 'mongoose';

const { Schema } = mongoose;
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  weightage: { type: Number, default: 0 }, // For score calculation
  isCompleted: { type: Boolean, default: false }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  skillsRequired: [String],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  tasks: [taskSchema], // Breaking down project into tasks
  maxScore: { type: Number, default: 100 }
});

export default mongoose.model('Project', projectSchema);