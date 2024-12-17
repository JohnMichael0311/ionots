import mongoose from 'mongoose';

const taskProgressSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task', 
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
});

const assignmentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  candidateId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Assigned', 'Accepted', 'In Progress', 'Completed'],
    default: 'Assigned'
  },
  taskProgress: [taskProgressSchema],
  progress: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  acceptedDate: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});


assignmentSchema.methods.calculateScore = async function() {
  if (!this.projectId || !this.projectId.tasks) return 0; 
  const completedTasks = this.taskProgress.filter(tp => tp.completed);
  const totalWeightage = this.projectId.tasks.reduce((sum, task) => sum + task.weightage, 0);

  const completedWeightage = completedTasks.reduce((sum, tp) => {
    // Fetch task by id
    const task = this.projectId.tasks.find(t => t._id.equals(tp.taskId));
    return sum + (task ? task.weightage : 0);
  }, 0);

  const calculatedScore = (completedWeightage / totalWeightage) * this.projectId.maxScore;
  this.score = calculatedScore;
  return calculatedScore;  
};


const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;  
