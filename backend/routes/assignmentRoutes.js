import express from 'express';
import Assignment from '../models/Assignment.js';
import Project from '../models/Project.js';

const router = express.Router();


router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ candidateId: req.params.candidateId })
      .populate('projectId');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/accept', async (req, res) => {
  try {
    const { projectId, candidateId } = req.body;

    // Find the project first
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if there is an existing assignment for the candidate
    let assignment = await Assignment.findOne({ projectId, candidateId, status: 'Assigned' });

    if (assignment) {
      // If the assignment already exists, change the status to 'Accepted'
      assignment.status = 'Accepted';
      assignment.acceptedDate = new Date();
      assignment.startDate = new Date();

      // Initialize tasks if not set
      const taskProgress = project.tasks.map(task => ({
        taskId: task._id,
        completed: false,
        completedAt: null,
      }));

      assignment.taskProgress = taskProgress;

      
      await assignment.save();

      return res.status(200).json(assignment); // Return updated assignment
    } else {
      // If no existing assignment, create a new one
      assignment = new Assignment({
        projectId,
        candidateId,
        status: 'Accepted',
        taskProgress: project.tasks.map(task => ({
          taskId: task._id,
          completed: false,
          completedAt: null,
        })),
        acceptedDate: new Date(),
        startDate: new Date(),
      });

      const savedAssignment = await assignment.save();
      return res.status(201).json(savedAssignment); // Return newly created assignment
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.patch('/:assignmentId/task/:taskId', async (req, res) => {
  try {
    console.log('Request params:', req.params);  // Log assignmentId and taskId
    console.log('Request body:', req.body);      // Log completed (true/false)

    const assignment = await Assignment.findById(req.params.assignmentId)
      .populate('projectId');
    
    if (!assignment) {
      console.log('Assignment not found');
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const taskProgress = assignment.taskProgress.find(
      tp => tp.taskId.equals(req.params.taskId)
    );
    
    if (!taskProgress) {
      console.log('Task progress not found for taskId:', req.params.taskId);
      return res.status(404).json({ message: 'Task not found' });
    }

    taskProgress.completed = req.body.completed;
    if (req.body.completed) {
      taskProgress.completedAt = new Date();
    }

    // Log the updated taskProgress before saving
    console.log('Updated taskProgress:', taskProgress);

    const completedTasks = assignment.taskProgress.filter(tp => tp.completed).length;
    const totalTasks = assignment.taskProgress.length;
    assignment.progress = (completedTasks / totalTasks) * 100;

    if (assignment.progress === 100) {
      assignment.status = 'Completed';
    } else if (assignment.progress > 0) {
      assignment.status = 'In Progress';
    }

    // Log overall progress and status
    console.log('Progress:', assignment.progress, 'Status:', assignment.status);

    assignment.score = await assignment.calculateScore();  // Corrected with await

    assignment.lastUpdated = new Date();

    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating task progress:', error);  // Log error message
    res.status(400).json({ message: 'Error updating task progress', error: error.message });
  }
});


export default router;
